import { unstable_cache } from "next/cache";
import { getClient } from "@/apollo/register-client";
import {
  GET_REALISATIONS_PAGE_BY_URI,
  GET_ACHIEVEMENTS_POSTS,
  GET_ACHIEVEMENTS_POSTS_CONNECTION,
  GET_ACHIEVEMENT_TAG_TERMS,
  GET_ACHIEVEMENT_TAGS_FROM_POSTS_SAMPLE,
  GET_ACHIEVEMENT_POST_BY_SLUG,
  GET_GLOBAL_ACF_FIELDS,
} from "@/modules/realisations/api/queries";
import {
  ACHIEVEMENTS_LIST_PAGE_SIZE,
  ACHIEVEMENTS_TAG_FILTER_POOL_CAP,
} from "@/modules/realisations/constants";

const PAGE = ACHIEVEMENTS_LIST_PAGE_SIZE;

/** Batch size when scanning posts by tag (cursor pagination); avoids loading entire catalogue upfront. */
const TAG_SCAN_BATCH = 160;

/** Data cache: cuts repeat TTFB on `/realisations` (Apollo uses fetch no-store). */
const REALISATIONS_ACF_REVALIDATE_SEC = 120;
const GLOBAL_ACF_REVALIDATE_SEC = 120;
const ACHIEVEMENT_TAGS_REVALIDATE_SEC = 300;

/** Continuation cache so offset > 0 continues the same WP cursor scan (same Node process). */
const TAG_MATCH_SCAN_TTL_MS = 90000;
/** @type {Map<string, { matches: unknown[]; after?: string; gqlHasNext: boolean; scanned: number; expiresAt: number }>} */
const tagMatchScanBySlug = new Map();

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function inferTagSlugFromName(name) {
  return String(name ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function achievementPostMatchesTagSlug(post, tagSlug) {
  const want = decodeURIComponent(String(tagSlug ?? "").trim()).toLowerCase();
  if (!want) return false;
  for (const t of post?.achivementsTags?.nodes ?? []) {
    const name = String(t?.name ?? "").trim();
    let slug = String(t?.slug ?? "").trim();
    if (!slug && name) slug = inferTagSlugFromName(name);
    if (slug && slug.toLowerCase() === want) return true;
    if (name && inferTagSlugFromName(name) === want) return true;
    if (name && name.toLowerCase() === want) return true;
  }
  return false;
}

/**
 * Walks date-ordered connection until `offset + limit` matching posts are collected or WP has no more pages.
 * Reuses per-tag scan state (TTL) so repeat filter clicks and scroll do not rescan from post #1 unless stale.
 *
 * @returns {Promise<{ nodes: unknown[], pageInfo: { hasNextPage: boolean, endCursor: null } }>}
 */
async function fetchAchievementPostsMatchingTagSlice(client, tagSlug, offset, limit) {
  const clean = String(tagSlug ?? "").trim();
  const wantOffset = Math.max(0, Math.floor(offset));
  const wantLimit = Math.min(
    Math.max(1, Math.floor(limit)),
    ACHIEVEMENTS_TAG_FILTER_POOL_CAP,
  );

  const now = Date.now();
  let state = tagMatchScanBySlug.get(clean);
  const stale = !state || now >= state.expiresAt;

  if (wantOffset === 0 || stale) {
    state = {
      matches: [],
      after: undefined,
      gqlHasNext: true,
      scanned: 0,
      expiresAt: now + TAG_MATCH_SCAN_TTL_MS,
    };
    tagMatchScanBySlug.set(clean, state);
  }

  while (
    state.gqlHasNext &&
    state.scanned < ACHIEVEMENTS_TAG_FILTER_POOL_CAP &&
    state.matches.length < wantOffset + wantLimit
  ) {
    const batch = Math.min(TAG_SCAN_BATCH, ACHIEVEMENTS_TAG_FILTER_POOL_CAP - state.scanned);
    const { data, errors } = await client.query({
      query: GET_ACHIEVEMENTS_POSTS_CONNECTION,
      variables: { first: batch, after: state.after },
      fetchPolicy: "no-cache",
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    const conn = data?.allAchievementsPost;
    const nodes = conn?.nodes ?? [];
    state.scanned += nodes.length;
    for (const p of nodes) {
      if (achievementPostMatchesTagSlug(p, clean)) state.matches.push(p);
    }
    state.gqlHasNext = Boolean(conn?.pageInfo?.hasNextPage) && nodes.length > 0;
    state.after = conn?.pageInfo?.endCursor ?? undefined;
    if (!nodes.length) state.gqlHasNext = false;
  }

  tagMatchScanBySlug.set(clean, state);

  const slice = state.matches.slice(wantOffset, wantOffset + wantLimit);
  let hasNextPage = false;
  if (slice.length < wantLimit) {
    hasNextPage = false;
  } else {
    hasNextPage =
      state.matches.length > wantOffset + wantLimit || state.gqlHasNext;
  }

  return {
    nodes: slice,
    pageInfo: {
      hasNextPage,
      endCursor: null,
    },
  };
}

/** @returns {Promise<{ name: string, slug: string }[]>} */
async function fetchAchievementTagsForFilters(client) {
  try {
    const { data, errors } = await client.query({
      query: GET_ACHIEVEMENT_TAG_TERMS,
      fetchPolicy: "no-cache",
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    return (data?.terms?.nodes ?? [])
      .map((n) => ({
        name: String(n?.name ?? "").trim(),
        slug: String(n?.slug ?? "").trim(),
      }))
      .filter((n) => n.name && n.slug);
  } catch {
    try {
      const { data, errors } = await client.query({
        query: GET_ACHIEVEMENT_TAGS_FROM_POSTS_SAMPLE,
        variables: { first: 400 },
        fetchPolicy: "no-cache",
      });
      if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
      const map = new Map();
      for (const post of data?.allAchievementsPost?.nodes ?? []) {
        for (const t of post?.achivementsTags?.nodes ?? []) {
          const name = String(t?.name ?? "").trim();
          let slug = String(t?.slug ?? "").trim();
          if (!slug && name) slug = inferTagSlugFromName(name);
          if (name && slug && !map.has(slug)) map.set(slug, { name, slug });
        }
      }
      return [...map.values()];
    } catch {
      return [];
    }
  }
}

const fetchRealisationsPageAcfCached = unstable_cache(
  async (normalizedUri) => {
    const client = getClient();
    const { data, errors } = await client.query({
      query: GET_REALISATIONS_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    return data?.page?.achievementsPageAcfField ?? null;
  },
  ["wp-realisations-page-acf"],
  { revalidate: REALISATIONS_ACF_REVALIDATE_SEC, tags: ["wp-realisations-acf"] },
);

const fetchGlobalAcfFieldsCached = unstable_cache(
  async () => {
    const client = getClient();
    const { data, errors } = await client.query({
      query: GET_GLOBAL_ACF_FIELDS,
      fetchPolicy: "no-cache",
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    return data?.themeSettings?.globalAcfFields ?? null;
  },
  ["wp-theme-global-acf"],
  { revalidate: GLOBAL_ACF_REVALIDATE_SEC, tags: ["wp-global-acf"] },
);

const fetchAchievementTagsForFiltersCached = unstable_cache(
  async () => {
    const client = getClient();
    return fetchAchievementTagsForFilters(client);
  },
  ["wp-achievement-filter-tags"],
  { revalidate: ACHIEVEMENT_TAGS_REVALIDATE_SEC, tags: ["wp-achievement-tags"] },
);

async function fetchInitialAchievementListingSlice(client, { tagSlug }) {
  if (typeof tagSlug === "string" && tagSlug.trim()) {
    const bundle = await fetchAchievementPostsMatchingTagSlice(
      client,
      tagSlug.trim(),
      0,
      PAGE,
    );
    return {
      achievementsPosts: bundle.nodes,
      achievementsPageInfo: bundle.pageInfo,
    };
  }

  const { data, errors } = await client.query({
    query: GET_ACHIEVEMENTS_POSTS_CONNECTION,
    variables: { first: PAGE, after: undefined },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  const conn = data?.allAchievementsPost;
  return {
    achievementsPosts: conn?.nodes ?? [],
    achievementsPageInfo: {
      hasNextPage: Boolean(conn?.pageInfo?.hasNextPage),
      endCursor: conn?.pageInfo?.endCursor ?? null,
    },
  };
}

/**
 * @param {string} uri
 * @param {{ achievementTagSlug?: string | null }} [options]
 */
export async function fetchRealisationsPageByUri(uri, options = {}) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);
  const tagSlug =
    typeof options.achievementTagSlug === "string" && options.achievementTagSlug.trim()
      ? options.achievementTagSlug.trim()
      : null;

  const [acf, bundle, achievementTags, globalAcfFields] = await Promise.all([
    fetchRealisationsPageAcfCached(normalizedUri),
    fetchInitialAchievementListingSlice(client, { tagSlug }),
    fetchAchievementTagsForFiltersCached(),
    fetchGlobalAcfFieldsCached(),
  ]);

  return {
    acf,
    globalAcfFields,
    achievementsPosts: bundle.achievementsPosts,
    achievementsPageInfo: bundle.achievementsPageInfo,
    achievementTags,
  };
}

/**
 * @param {string} slug
 * @returns {Promise<object | null>}
 */
export async function fetchAchievementPostBySlug(slug) {
  const client = getClient();
  const clean = decodeURIComponent(String(slug || "").trim()).replace(/^\/+|\/+$/g, "");
  if (!clean) return null;

  const { data, errors } = await client.query({
    query: GET_ACHIEVEMENT_POST_BY_SLUG,
    variables: { slug: clean },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }
  return data?.allAchievementsPost?.nodes?.[0] ?? null;
}

/**
 * @param {{ first?: number }} [options]
 * @returns {Promise<object[]>}
 */
export async function fetchAchievementPostsList(options = {}) {
  const first = typeof options.first === "number" && options.first > 0 ? options.first : 200;
  const client = getClient();
  const { data, errors } = await client.query({
    query: GET_ACHIEVEMENTS_POSTS,
    variables: { first },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }
  return data?.allAchievementsPost?.nodes ?? [];
}

/**
 * @param {{ first?: number, after?: string | null, tagSlug?: string | null, offset?: number }} options
 */
export async function fetchAchievementPostsPage(options = {}) {
  const first =
    typeof options.first === "number" && options.first > 0 ? options.first : PAGE;
  const after =
    typeof options.after === "string" && options.after.trim() ? options.after.trim() : null;
  const tagSlug =
    typeof options.tagSlug === "string" && options.tagSlug.trim() ? options.tagSlug.trim() : null;
  const offset =
    typeof options.offset === "number" && Number.isFinite(options.offset) && options.offset >= 0
      ? Math.floor(options.offset)
      : 0;

  const client = getClient();

  if (!tagSlug) {
    const { data, errors } = await client.query({
      query: GET_ACHIEVEMENTS_POSTS_CONNECTION,
      variables: {
        first,
        ...(after ? { after } : { after: undefined }),
      },
      fetchPolicy: "no-cache",
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    const conn = data?.allAchievementsPost;
    return {
      nodes: conn?.nodes ?? [],
      pageInfo: {
        hasNextPage: Boolean(conn?.pageInfo?.hasNextPage),
        endCursor: conn?.pageInfo?.endCursor ?? null,
      },
    };
  }

  return fetchAchievementPostsMatchingTagSlice(client, tagSlug, offset, first);
}

/**
 * @param {string} uri
 * @param {object} [fallback]
 * @param {{ achievementTagSlug?: string | null }} [options]
 */
export async function fetchRealisationsPageConfigByUri(uri, fallback = {}, options = {}) {
  const pageData = await fetchRealisationsPageByUri(uri, options).catch(() => null);
  const acf = pageData?.acf ?? null;
  const globalAcf = pageData?.globalAcfFields ?? null;
  const achievementsPosts = Array.isArray(pageData?.achievementsPosts)
    ? pageData.achievementsPosts
    : [];
  const showBreadcrumbSection =
    acf?.showBreadcrumbSection !== false && acf?.showBreadcrumbSection !== "No";
  const showAchievementSection =
    acf?.showAchievementSection !== false && acf?.showAchievementSection !== "No";
  const showFeaturesSection =
    acf?.showFeaturesSection !== false && acf?.showFeaturesSection !== "No";
  const showReadyToShipSection =
    acf?.showReadyToShipSection !== false && acf?.showReadyToShipSection !== "No";
  const showSourcingSection =
    acf?.showSourcingSection !== false && acf?.showSourcingSection !== "No";
  const showCenterVideoSection =
    globalAcf?.showCenterVideoSection !== false && globalAcf?.showCenterVideoSection !== "No";
  const showFaqSection = acf?.showFaqSection !== false && acf?.showFaqSection !== "No";
  const showTestimonialsSection =
    acf?.showTestimonialsSection !== false && acf?.showTestimonialsSection !== "No";
  const features = [
    {
      image: acf?.feature1Image?.node?.sourceUrl || fallback.feature1Image || "",
      imageAlt: String(acf?.feature1Image?.node?.altText ?? "").trim() || fallback.feature1ImageAlt || "",
      title: String(acf?.feature1Title ?? "").trim() || fallback.feature1Title || "",
      description: String(acf?.feature1Description ?? "").trim() || fallback.feature1Description || "",
    },
    {
      image: acf?.feature2Image?.node?.sourceUrl || fallback.feature2Image || "",
      imageAlt: String(acf?.feature2Image?.node?.altText ?? "").trim() || fallback.feature2ImageAlt || "",
      title: String(acf?.feature2Title ?? "").trim() || fallback.feature2Title || "",
      description: String(acf?.feature2Description ?? "").trim() || fallback.feature2Description || "",
    },
    {
      image: acf?.feature3Image?.node?.sourceUrl || fallback.feature3Image || "",
      imageAlt: String(acf?.feature3Image?.node?.altText ?? "").trim() || fallback.feature3ImageAlt || "",
      title: String(acf?.feature3Title ?? "").trim() || fallback.feature3Title || "",
      description: String(acf?.feature3Description ?? "").trim() || fallback.feature3Description || "",
    },
  ].filter((item) => item.image || item.title || item.description);

  return {
    raw: acf,
    breadcrumb: {
      show: showBreadcrumbSection,
      firstTitle:
        String(acf?.breadcrumbFirstTitle ?? "").trim() ||
        fallback.breadcrumbFirstTitle ||
        "",
      firstLink:
        String(acf?.breadcrumbFirstTitleLink ?? "").trim() ||
        fallback.breadcrumbFirstTitleLink ||
        "",
      secondTitle:
        String(acf?.breadcrumbSecondTitle ?? "").trim() ||
        fallback.breadcrumbSecondTitle ||
        "",
      secondLink:
        String(acf?.breadcrumbSecondTitleLink ?? "").trim() ||
        fallback.breadcrumbSecondTitleLink ||
        "",
    },
    achievementSection: {
      show: showAchievementSection,
      achievements: achievementsPosts,
      achievementsPageInfo: pageData?.achievementsPageInfo ?? {
        hasNextPage: false,
        endCursor: null,
      },
      achievementTags: Array.isArray(pageData?.achievementTags) ? pageData.achievementTags : [],
      activeAchievementTagSlug:
        typeof options.achievementTagSlug === "string" && options.achievementTagSlug.trim()
          ? options.achievementTagSlug.trim()
          : null,
    },
    featuresSection: {
      show: showFeaturesSection,
      features,
    },
    readyToShipSection: {
      show: showReadyToShipSection,
      imageSrc: acf?.readyToShipImage?.node?.sourceUrl || fallback.readyToShipImage || "",
      imageAlt: String(acf?.readyToShipImage?.node?.altText ?? "").trim() || fallback.readyToShipImageAlt || "",
      title: String(acf?.readyToShipTitle ?? "").trim() || fallback.readyToShipTitle || "",
      description: String(acf?.readyToShipDescription ?? "").trim() || fallback.readyToShipDescription || "",
      buttonTitle: String(acf?.readyToShipButtonTitle ?? "").trim() || fallback.readyToShipButtonTitle || "",
      buttonLink: String(acf?.readyToShipButtonLink ?? "").trim() || fallback.readyToShipButtonLink || "",
    },
    sourcingSection: {
      show: showSourcingSection,
      imageSrc: acf?.sourcingImage?.node?.sourceUrl || fallback.sourcingImage || "",
      imageAlt: String(acf?.sourcingImage?.node?.altText ?? "").trim() || fallback.sourcingImageAlt || "",
      title: String(acf?.sourcingTitle ?? "").trim() || fallback.sourcingTitle || "",
      subHeading: String(acf?.sourcingSubHeading ?? "").trim() || fallback.sourcingSubHeading || "",
      description: String(acf?.sourcingDescription ?? "").trim() || fallback.sourcingDescription || "",
      buttonTitle: String(acf?.sourcingButtonTitle ?? "").trim() || fallback.sourcingButtonTitle || "",
      buttonLink: String(acf?.sourcingButtonLink ?? "").trim() || fallback.sourcingButtonLink || "",
    },
    centerVideo: {
      show: showCenterVideoSection,
      video:
        String(globalAcf?.centerVideo ?? "").trim() ||
        String(acf?.centerVideo ?? "").trim() ||
        String(fallback.centerVideo ?? "").trim() ||
        "",
    },
    faqSection: {
      show: showFaqSection,
      faqDetails: (acf?.faqDetails || fallback.faqDetails || [])
        .map((item) => ({
          faqTitle: String(item?.faqTitle ?? "").trim(),
          faqDescription: String(item?.faqDescription ?? "").trim(),
          faqButtonLinkTitle: String(item?.faqButtonLinkTitle ?? "").trim(),
          faqButtonLink: String(item?.faqButtonLink ?? "").trim(),
          faqDetailsImage: String(item?.faqDetailsImage?.node?.sourceUrl ?? "").trim() || fallback.faqDetailsImage || "",
          faqDetailsImageAlt: String(item?.faqDetailsImage?.node?.altText ?? "").trim() || fallback.faqDetailsImageAlt || "",
        }))
        .filter(
          (item) =>
            item.faqTitle ||
            item.faqDescription ||
            item.faqButtonLinkTitle ||
            item.faqButtonLink ||
            item.faqDetailsImage,
        ),
    },
    testimonialsSection: {
      show: showTestimonialsSection,
    },
  };
}
