"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ACHIEVEMENTS_LIST_PAGE_SIZE } from "@/modules/realisations/constants";
import { BonnotSiteTopProgressBar } from "@/modules/common/components/BonnotSiteTopProgressBar";

function isSapphireTagName(name) {
  return /saphir|sapphire/i.test(String(name || "").trim());
}

function inferSlugFromName(name) {
  return String(name ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const LISTING_IMAGE_TARGET_WIDTH = 640;

/** Smaller WP derivative for grid; browser only downloads `image` URL. */
function pickGridFeaturedImageUrl(imageNode) {
  const full = String(imageNode?.sourceUrl ?? "").trim();
  const rawSizes = imageNode?.mediaDetails?.sizes;
  if (!Array.isArray(rawSizes) || rawSizes.length === 0) return full;

  const sizes = rawSizes
    .map((s) => ({
      name: String(s?.name ?? "").toLowerCase(),
      url: String(s?.sourceUrl ?? "").trim(),
      width: Number.parseInt(String(s?.width ?? "0"), 10) || 0,
    }))
    .filter((s) => s.url);

  if (!sizes.length) return full;

  const byWidthAsc = [...sizes].sort((a, b) => a.width - b.width);
  const withWidth = byWidthAsc.filter((s) => s.width > 0);
  if (withWidth.length) {
    const hit = withWidth.find((s) => s.width >= LISTING_IMAGE_TARGET_WIDTH);
    if (hit) return hit.url;
    return withWidth[withWidth.length - 1].url;
  }

  const prefer = [
    "medium_large",
    "large",
    "medium",
    "woocommerce_thumbnail",
    "shop_catalog",
    "thumbnail",
  ];
  for (const name of prefer) {
    const found = sizes.find((s) => s.name === name);
    if (found) return found.url;
  }
  return sizes[0].url;
}

function mapAchievementNodesToUiItems(nodes) {
  if (!Array.isArray(nodes)) return [];
  return nodes
    .map((item, idx) => ({
      title: String(item?.title ?? "").trim(),
      description: String(item?.achievements?.shortDescription ?? "").trim(),
      href: String(item?.uri ?? "")
        .trim()
        .replace("/achievements-post/", "/realisations/"),
      image: pickGridFeaturedImageUrl(item?.featuredImage?.node),
      tagNames: (item?.achivementsTags?.nodes ?? []).map((n) => String(n?.name ?? "").trim()).filter(Boolean),
      key:
        String(item?.slug ?? "").trim() ||
        String(item?.uri ?? "").trim() ||
        `achievement-${idx}`,
    }))
    .filter((row) => row.title || row.description || row.href || row.image);
}

const AchievementGridCard = memo(function AchievementGridCard({ item, idx }) {
  return (
    <div className="flex w-full flex-col items-stretch">
      <Link href={item.href || "#"} className="no-underline group">
        <div className="relative mb-2 grid w-full overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title || `Achievement ${idx + 1}`}
              width={360}
              height={518}
              className="inline-block aspect-[1/1.44] h-auto w-full max-w-full object-cover"
              loading="lazy"
              decoding="async"
              fetchPriority={idx < 5 ? "high" : "low"}
            />
          ) : null}
          <div className="absolute inset-0 flex items-end justify-end bg-[#15151599] p-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="text-[12px] font-semibold tracking-normal text-[#e5dbcc]">Discover</span>
          </div>
        </div>
        <div className="flex flex-col text-[.88rem]">
          <h3 className="m-0 font-jakarta text-[14px] leading-[1.5] tracking-normal text-[#000d29]">
            {item.title}
          </h3>
          <p className="m-0 text-[12px] font-normal leading-[1.5] tracking-normal text-black group-hover:text-[#ff6633]">
            {item.description}
          </p>
        </div>
      </Link>
    </div>
  );
});

const AchievementFilterBar = memo(function AchievementFilterBar({
  tagLoading,
  activeTagSlug,
  isSapphireOpen,
  isSapphireActive,
  otherTagRows,
  sapphireTagRows,
  applyFilter,
  onToggleSapphireDropdown,
  onPickSapphireTag,
}) {
  return (
    <div className="mb-8 flex w-full flex-wrap items-center justify-between gap-4 max-[768px]:flex-col max-[768px]:items-start">
      <div className="relative z-[1] mt-5 flex w-full max-w-full flex-wrap items-center gap-x-[3px] gap-y-[5px] bg-[#fffaf5] max-[768px]:mt-[30px] max-[768px]:justify-center">
        <button
          type="button"
          disabled={tagLoading}
          onClick={() => applyFilter(null)}
          className={`shrink-0 cursor-pointer px-2 py-[2px] text-[14.08px] leading-[31px] tracking-normal text-[#000d29] disabled:opacity-60 ${
            activeTagSlug == null ? "bg-[#ece5da]" : "bg-transparent hover:bg-[#ece5da]"
          }`}
        >
          Toutes
        </button>

        {otherTagRows.map((tag) => (
          <button
            key={tag.slug}
            type="button"
            disabled={tagLoading}
            onClick={() => applyFilter(tag.slug)}
            className={`shrink-0 cursor-pointer px-2 py-[2px] text-[14.08px] leading-[31px] tracking-normal text-[#000d29] disabled:opacity-60 ${
              activeTagSlug === tag.slug ? "bg-[#ece5da]" : "bg-transparent hover:bg-[#ece5da]"
            }`}
          >
            {tag.name}
          </button>
        ))}

        {sapphireTagRows.length > 0 ? (
          <div className="relative shrink-0">
            <button
              type="button"
              disabled={tagLoading}
              onClick={onToggleSapphireDropdown}
              className={`flex cursor-pointer items-center gap-2 px-2 py-[2px] text-[14.08px] leading-[31px] tracking-normal text-[#000d29] disabled:opacity-60 ${
                isSapphireActive ? "bg-[#ece5da]" : "bg-transparent hover:bg-[#ece5da]"
              }`}
            >
              Saphir <span className="text-[10px]">▼</span>
            </button>
            {isSapphireOpen ? (
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] bg-white p-1 shadow-[0_2px_5px_rgba(0,0,0,0.24)]">
                {sapphireTagRows.map((tag) => (
                  <button
                    key={tag.slug}
                    type="button"
                    disabled={tagLoading}
                    onClick={() => onPickSapphireTag(tag.slug)}
                    className="block w-full cursor-pointer px-3 py-2 text-left text-[14px] text-[#000d29] hover:bg-[#ece5da69] disabled:opacity-60"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
});

function deriveTagsFallbackFromPosts(achievements) {
  const map = new Map();
  if (!Array.isArray(achievements)) return [];
  for (const post of achievements) {
    for (const node of post?.achivementsTags?.nodes ?? []) {
      const name = String(node?.name ?? "").trim();
      let slug = String(node?.slug ?? "").trim();
      if (!slug && name) slug = inferSlugFromName(name);
      if (name && slug && !map.has(slug)) map.set(slug, { name, slug });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

/**
 * @param {object} props
 * @param {unknown[]} props.achievements
 * @param {{ hasNextPage?: boolean, endCursor?: string | null }} [props.pageInfo]
 * @param {{ name: string, slug: string }[]} [props.achievementTags]
 * @param {string | null} [props.activeTagSlugFromUrl]
 * @param {string} props.realisationsBasePath
 */
export function RealisationsAchievementSection({
  achievements = [],
  pageInfo,
  achievementTags = [],
  activeTagSlugFromUrl,
  realisationsBasePath,
}) {
  const router = useRouter();
  const pageSize = ACHIEVEMENTS_LIST_PAGE_SIZE;

  const [items, setItems] = useState(() => mapAchievementNodesToUiItems(achievements));
  const [cursor, setCursor] = useState(() => pageInfo?.endCursor ?? null);
  const [hasMore, setHasMore] = useState(() => Boolean(pageInfo?.hasNextPage));
  const [loadingMore, setLoadingMore] = useState(false);
  const [tagLoading, setTagLoading] = useState(false);
  const [activeTagSlug, setActiveTagSlug] = useState(
    () =>
      typeof activeTagSlugFromUrl === "string" && activeTagSlugFromUrl.trim()
        ? activeTagSlugFromUrl.trim()
        : null,
  );
  const [isSapphireOpen, setIsSapphireOpen] = useState(false);
  const sentinelRef = useRef(null);
  const paginationRef = useRef({
    cursor: pageInfo?.endCursor ?? null,
    itemsLength: mapAchievementNodesToUiItems(achievements).length,
    activeTagSlug:
      typeof activeTagSlugFromUrl === "string" && activeTagSlugFromUrl.trim()
        ? activeTagSlugFromUrl.trim()
        : null,
    hasMore: Boolean(pageInfo?.hasNextPage),
    tagLoading: false,
  });
  const loadMoreInFlightRef = useRef(false);

  const loadingBar = loadingMore || tagLoading;

  paginationRef.current = {
    cursor,
    itemsLength: items.length,
    activeTagSlug,
    hasMore,
    tagLoading,
  };

  const tagListResolved = useMemo(() => {
    if (achievementTags?.length > 0) return achievementTags;
    return deriveTagsFallbackFromPosts(achievements);
  }, [achievementTags, achievements]);

  const { sapphireTagRows, otherTagRows } = useMemo(() => {
    const sorted = [...tagListResolved].sort((a, b) =>
      String(a?.name ?? "").localeCompare(String(b?.name ?? ""), "fr"),
    );
    return {
      sapphireTagRows: sorted.filter((t) => isSapphireTagName(t.name)),
      otherTagRows: sorted.filter((t) => !isSapphireTagName(t.name)),
    };
  }, [tagListResolved]);

  const isSapphireActive =
    typeof activeTagSlug === "string" &&
    sapphireTagRows.some((t) => t.slug === activeTagSlug);

  const qsForApi = useCallback(
    ({ afterCursor, tagSlug, offset }) => {
      const qs = new URLSearchParams({ first: String(pageSize) });
      if (tagSlug) {
        qs.set("tag", tagSlug);
        if (typeof offset === "number" && offset > 0) qs.set("offset", String(offset));
      } else if (afterCursor) qs.set("after", afterCursor);
      return qs;
    },
    [pageSize],
  );

  const applyFilter = useCallback(
    async (nextSlug) => {
      setTagLoading(true);
      setLoadingMore(false);
      setIsSapphireOpen(false);
      const nextUrl =
        realisationsBasePath + (nextSlug ? `?tag=${encodeURIComponent(nextSlug)}` : "");
      router.replace(nextUrl, { scroll: false });
      setActiveTagSlug(nextSlug ?? null);
      try {
        const qs = nextSlug ? qsForApi({ tagSlug: nextSlug, offset: 0 }) : qsForApi({});
        const res = await fetch(`/api/realisations?${qs}`, { cache: "no-store" });
        const payload = await res.json();
        if (!res.ok) return;
        setItems(mapAchievementNodesToUiItems(payload.nodes));
        setCursor(payload.pageInfo?.endCursor ?? null);
        setHasMore(Boolean(payload.pageInfo?.hasNextPage));
      } finally {
        setTagLoading(false);
      }
    },
    [qsForApi, realisationsBasePath, router],
  );

  const toggleSapphireDropdown = useCallback(() => {
    setIsSapphireOpen((prev) => !prev);
  }, []);

  const pickSapphireTag = useCallback(
    (slug) => {
      void applyFilter(slug);
      setIsSapphireOpen(false);
    },
    [applyFilter],
  );

  const loadMore = useCallback(async () => {
    if (loadMoreInFlightRef.current) return;
    const p = paginationRef.current;
    if (!p.hasMore || p.tagLoading) return;
    loadMoreInFlightRef.current = true;
    setLoadingMore(true);
    try {
      const qs = p.activeTagSlug
        ? qsForApi({
            tagSlug: p.activeTagSlug,
            offset: p.itemsLength,
          })
        : qsForApi({
            afterCursor: p.cursor ?? undefined,
          });
      const res = await fetch(`/api/realisations?${qs}`, { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok) return;
      const next = mapAchievementNodesToUiItems(payload.nodes);
      setItems((prev) => {
        const seen = new Set(prev.map((k) => k.key));
        const merged = [...prev];
        for (const row of next) {
          if (!seen.has(row.key)) {
            seen.add(row.key);
            merged.push(row);
          }
        }
        return merged;
      });
      setCursor(payload.pageInfo?.endCursor ?? null);
      setHasMore(Boolean(payload.pageInfo?.hasNextPage));
    } finally {
      loadMoreInFlightRef.current = false;
      setLoadingMore(false);
    }
  }, [qsForApi]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || cancelled) return;
        void loadMore();
      },
      { rootMargin: "120px", threshold: 0 },
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [loadMore]);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      {loadingBar ? <BonnotSiteTopProgressBar ariaLabel="Chargement…" /> : null}

      <AchievementFilterBar
        tagLoading={tagLoading}
        activeTagSlug={activeTagSlug}
        isSapphireOpen={isSapphireOpen}
        isSapphireActive={isSapphireActive}
        otherTagRows={otherTagRows}
        sapphireTagRows={sapphireTagRows}
        applyFilter={applyFilter}
        onToggleSapphireDropdown={toggleSapphireDropdown}
        onPickSapphireTag={pickSapphireTag}
      />

      <div className="[contain:layout]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 min-[768px]:grid-cols-3 min-[992px]:grid-cols-5">
          {items.map((item, idx) => (
            <AchievementGridCard key={item.key} item={item} idx={idx} />
          ))}
        </div>
      </div>

      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
    </div>
  );
}
