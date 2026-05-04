import { getClient } from "@/apollo/register-client";
import {
  GET_JOURNAL_PAGE_BY_URI,
  GET_JOURNAL_PAGE_BY_DATABASE_ID,
  GET_GLOBAL_ACF_FIELDS,
  GET_JOURNAL_POSTS_CONNECTION,
} from "@/modules/journal/api/queries";

const JOURNAL_PAGE_DATABASE_ID = 249;
const JOURNAL_POSTS_PAGE_SIZE = 6;
const JOURNAL_POSTS_COUNT_BATCH = 100;

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchJournalPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageByUriRes, globalAcfFieldsRes] = await Promise.all([
    client.query({
      query: GET_JOURNAL_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    }),
    client.query({
      query: GET_GLOBAL_ACF_FIELDS,
      fetchPolicy: "no-cache",
    }),
  ]);

  const pageByUri = pageByUriRes?.data?.page ?? null;
  const pageRes = pageByUri
    ? pageByUriRes
    : await client.query({
        query: GET_JOURNAL_PAGE_BY_DATABASE_ID,
        variables: { databaseId: JOURNAL_PAGE_DATABASE_ID },
        fetchPolicy: "no-cache",
      });

  const data = pageRes?.data;
  const globalAcf = globalAcfFieldsRes?.data?.themeSettings?.globalAcfFields ?? null;
  const errors = [
    ...(pageRes?.errors ?? []),
    ...(globalAcfFieldsRes?.errors ?? []),
  ];

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.journalPageAcfField ?? null,
    globalAcfFields: globalAcf,
  };
}

export async function fetchJournalPageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchJournalPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;
  const globalAcf = pageData?.globalAcfFields ?? null;

  const showRelatedBlogSection =
    globalAcf?.showRelatedBlogSection !== false && globalAcf?.showRelatedBlogSection !== "No";
  const showBlogSection =
    acf?.showBlogSection !== false && acf?.showBlogSection !== "No";
  const showSingleBlogSharePostSection =
    globalAcf?.showSingleBlogSharePostSection !== false && globalAcf?.showSingleBlogSharePostSection !== "No";
  const showBlogAuthorDetailSection =
    globalAcf?.showBlogAuthorDetailSection !== false && globalAcf?.showBlogAuthorDetailSection !== "No";

  const singleBlogSharePostlistSource =
    globalAcf?.singleBlogSharePostList ??
    fallback.singleBlogSharePostList ??
    globalAcf?.singleBlogSharePostlist ??
    fallback.singleBlogSharePostlist ??
    [];
  const singleBlogSharePostlist = Array.isArray(singleBlogSharePostlistSource)
    ? singleBlogSharePostlistSource.map((item) => ({
        socialLink: String(item?.socialLink ?? "").trim(),
        socialIcon: String(item?.socialIcon?.node?.sourceUrl ?? "").trim(),
        socialIconAlt: String(item?.socialIcon?.node?.altText ?? "").trim(),
      }))
    : [];
  return {
    raw: acf,
    blogSection: {
      show: showBlogSection,
      prefix: String(acf?.blogPrefix ?? "").trim() || fallback.blogPrefix || "",
      title: String(acf?.blogTitle ?? "").trim() || fallback.blogTitle || "",
      subTitle: String(acf?.blogSubTitle ?? "").trim() || fallback.blogSubTitle || "",
    },
    relatedBlogSection: {
      show: showRelatedBlogSection,
      title: String(globalAcf?.relatedBlogTitle ?? "").trim() || fallback.relatedBlogTitle || "",
      description: String(globalAcf?.relatedBlogDescription ?? "").trim() || fallback.relatedBlogDescription || "",
    },
    singleBlogSharePostSection: {
      show: showSingleBlogSharePostSection,
      title: String(globalAcf?.singleBlogSharePostTitle ?? "").trim() || fallback.singleBlogSharePostTitle || "",
      list: singleBlogSharePostlist,
    },
    blogAuthorDetailSection: {
      show: showBlogAuthorDetailSection,
      title: String(globalAcf?.blogButton?.title ?? "").trim() || fallback.blogButton?.title || "",
      url: String(globalAcf?.blogButton?.url ?? "").trim() || fallback.blogButton?.url || "",
    },
  };
}

/**
 * @param {{ page?: number }} [options]
 */
export async function fetchJournalPostsPage(options = {}) {
  const page = Number.isFinite(options.page) ? Math.max(1, Math.floor(options.page)) : 1;
  const client = getClient();

  async function countTotalPosts() {
    let count = 0;
    let cursor = null;
    let keepGoing = true;

    while (keepGoing) {
      const { data, errors } = await client.query({
        query: GET_JOURNAL_POSTS_CONNECTION,
        variables: {
          first: JOURNAL_POSTS_COUNT_BATCH,
          ...(cursor ? { after: cursor } : { after: undefined }),
        },
        fetchPolicy: "no-cache",
      });
      if (errors?.length) {
        throw new Error(errors.map((error) => error.message).join(", "));
      }
      const conn = data?.posts;
      const nodes = conn?.nodes ?? [];
      const pageInfo = conn?.pageInfo ?? {};
      count += nodes.length;
      keepGoing = Boolean(pageInfo?.hasNextPage) && Boolean(pageInfo?.endCursor);
      cursor = pageInfo?.endCursor ?? null;
      if (!nodes.length) keepGoing = false;
    }

    return count;
  }

  let after = null;
  let hasNextPage = false;
  const totalPosts = await countTotalPosts();
  const totalPages = Math.max(1, Math.ceil(totalPosts / JOURNAL_POSTS_PAGE_SIZE));

  for (let cursorPage = 1; cursorPage <= page; cursorPage += 1) {
    const { data, errors } = await client.query({
      query: GET_JOURNAL_POSTS_CONNECTION,
      variables: {
        first: JOURNAL_POSTS_PAGE_SIZE,
        ...(after ? { after } : { after: undefined }),
      },
      fetchPolicy: "no-cache",
    });

    if (errors?.length) {
      throw new Error(errors.map((error) => error.message).join(", "));
    }

    const posts = data?.posts;
    const nodes = posts?.nodes ?? [];
    const pageInfo = posts?.pageInfo ?? {};

    if (cursorPage === page) {
      return {
        nodes,
        page,
        totalPages,
        hasNextPage: Boolean(pageInfo?.hasNextPage),
        hasPrevPage: page > 1,
      };
    }

    hasNextPage = Boolean(pageInfo?.hasNextPage);
    after = pageInfo?.endCursor ?? null;

    if (!hasNextPage || !after) {
      return {
        nodes: [],
        page,
        totalPages,
        hasNextPage: false,
        hasPrevPage: page > 1,
      };
    }
  }

  return {
    nodes: [],
    page,
    totalPages,
    hasNextPage: false,
    hasPrevPage: page > 1,
  };
}

/**
 * @param {{ excludeSlug?: string, first?: number }} [options]
 */
export async function fetchLatestJournalPosts(options = {}) {
  const client = getClient();
  const excludeSlug = String(options.excludeSlug || "").trim();
  const first = Number.isFinite(options.first) ? Math.max(1, Math.floor(options.first)) : 4;

  const { data, errors } = await client.query({
    query: GET_JOURNAL_POSTS_CONNECTION,
    variables: { first, after: undefined },
    fetchPolicy: "no-cache",
  });

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  const nodes = data?.posts?.nodes ?? [];
  return nodes.filter((node) => String(node?.slug || "").trim() !== excludeSlug);
}