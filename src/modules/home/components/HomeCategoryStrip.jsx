"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categoryPath, productsPath } from "@/constants/routes";
import GemstoneModal from "./GemstoneModal";
import CategoryCard from "./CategoryCard";



const INK_20 = "rgba(0, 17, 34, 0.2)";

/** Shown only when WooCommerce category has no thumbnail (`image.sourceUrl` empty). */
const DEFAULT_CATEGORY_IMAGE_PLACEHOLDER = "/figma/gem-aigue-marine.png";

function plainText(v) {
  return String(v || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Two-line Figma title: first line italic, rest uppercase (split with `\n` in `title`). */
function renderStripTitle(title) {
  const raw = String(title || "").trim();
  if (!raw) return null;

  // Allow simple WYSIWYG markup from ACF title field.
  if (/[<][a-z/!]/i.test(raw)) {
    const safeHtml = raw
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "");
    return <span dangerouslySetInnerHTML={{ __html: safeHtml }} />;
  }

  const parts = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  return (
    <>
      <span className="italic">{parts[0]}</span>{" "}
      <span className="uppercase text-[21px] not-italic max-[768px]:text-[17px]">{parts.slice(1).join(" ")}</span>
    </>
  );
}

/**
 * Normalize WPGraphQL `productCategories.nodes` entry for the strip + modal (all from WP).
 * @param {object} c
 * @param {string} locale
 * @param {string} imagePlaceholder
 */
function mapCategoryToStripItem(c, locale, imagePlaceholder) {
  const slug = String(c.slug || "").trim();
  const title = String(c.name || "").trim();
  const wpUrl = c.image?.sourceUrl ? String(c.image.sourceUrl).trim() : "";
  const imageSrc = wpUrl || imagePlaceholder;
  const imageAlt = plainText(c.image?.altText) || title || "Catégorie";
  const description = plainText(c.description);
  return {
    id: c.id || slug,
    slug,
    href: categoryPath(locale, slug),
    title,
    label: title,
    count: Number(c.count ?? 0),
    description,
    summary: description,
    imageSrc,
    imageAlt,
  };
}

function StripScrollNav({ dir, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center
        cursor-pointer

        text-[#001122]
        transition-all duration-300

        hover:text-[#FF6633] hover:opacity-80

        disabled:cursor-not-allowed disabled:opacity-25"
      >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {dir === "prev" ? (
          <path d="M12.5 4L6.5 10L12.5 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M7.5 4L13.5 10L7.5 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

/**
 * Homepage category rail with the same scroll behavior/controls as product strips.
 * @param {{ categories?: Array<{ id?: string; slug?: string; name?: string; count?: number; description?: string; image?: { sourceUrl?: string; altText?: string } }>; locale: string; title: string; viewAllLabel: string; viewAllHref?: string; explorerLabel?: string; categoryImagePlaceholder?: string }} props
 */
export function HomeCategoryStrip({
  categories = [],
  locale,
  title,
  viewAllLabel,
  viewAllHref,
  explorerLabel = "Explorer",
  categoryImagePlaceholder = DEFAULT_CATEGORY_IMAGE_PLACEHOLDER,
}) {
  const fallbackTitle = String(categories?.[0]?.name || "").trim();
  const rawTitle = String(title || "").trim();
  const displayTitle = plainText(rawTitle || fallbackTitle);
  const hasCustomTitle = Boolean(rawTitle);
  const fallbackSlug = String(categories?.[0]?.slug || "").trim();
  // console.log('fallbackSlug = ' , fallbackSlug);
  const allCategoriesHref =
    viewAllHref || (fallbackSlug ? categoryPath(locale, fallbackSlug) : productsPath(locale));
  const displayViewAllLabel = String(viewAllLabel || "").trim() || `Toutes les ${displayTitle}s`;
  // console.log('allCategoriesHref = ' , allCategoriesHref);
  const items = useMemo(
    () =>
      categories
        .filter((c) => c?.slug && c?.name)
        .map((c) => mapCategoryToStripItem(c, locale, categoryImagePlaceholder)),
    [categories, locale, categoryImagePlaceholder],
  );

  if (!items.length) return null;

  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollUi = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScroll(max > 2);
    if (el.scrollWidth <= el.clientWidth) {
      setScrollProgress(1);
      setAtStart(true);
      setAtEnd(true);
      return;
    }
    const ratio = (el.scrollLeft + el.clientWidth) / el.scrollWidth;
    setScrollProgress(Math.min(1, Math.max(0, ratio)));
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    updateScrollUi();
    el.addEventListener("scroll", updateScrollUi, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateScrollUi) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollUi);
      ro?.disconnect();
    };
  }, [items.length, updateScrollUi]);

  const scrollStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 105;
    const first = el.querySelector("[data-strip-card]");
    const second = first?.nextElementSibling;
    if (first && "offsetWidth" in first) {
      let gap = 15;
      if (second && "offsetLeft" in second && "offsetLeft" in first) {
        gap = second.offsetLeft - first.offsetLeft - first.offsetWidth;
      }
      return first.offsetWidth + Math.max(0, gap);
    }
    return 105;
  }, []);

  const goPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -scrollStep(), behavior: "smooth" });
  }, [scrollStep]);

  const goNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: scrollStep(), behavior: "smooth" });
  }, [scrollStep]);

  const shouldScroll = canScroll;
  const trackFill = `${scrollProgress * 100}%`;
  const stripCardClasses =
    "shrink-0 snap-start bg-[rgba(245,238,229,1)] " +
    "max-[480px]:w-[calc((100%-1rem)/1.1)] " +
    "min-[481px]:max-[768px]:w-[calc((100%-2rem)/2.2)] " +
    "min-[768px]:max-[1024px]:w-[calc((100%-60px)/2.2)] " +
    "min-[1024px]:max-[1400px]:w-[calc((100%-90px)/3.2)] " +
    "min-[1400px]:w-[calc((100%-1rem)/4.1)]";

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
    
  return (
    <div className="flex min-w-0 flex-col gap-[30px]">
      <div className="flex w-full flex-col gap-2 min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between min-[768px]:gap-3 max-[768px]:gap-[30px] px-4 min-[1440px]:px-[60px]">
        {hasCustomTitle ? (
          <h2 className="w-full text-left font-serif text-base font-normal leading-[1.19] tracking-[0.02em] text-[#001122] min-[768px]:w-auto text-[28px] max-[768px]:text-[21px]">
            {renderStripTitle(rawTitle)}
          </h2>
        ) : null}
        <Link
          href={allCategoriesHref}
          className="group inline-flex items-center gap-[10px] self-end text-sm font-semibold leading-5 text-[#001122] hover:text-[#FF6633] transition-opacity min-[768px]:self-auto min-[768px]:gap-[12px]"
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {displayViewAllLabel}
          <svg className="shrink-0" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeOpacity="0.85" strokeMiterlimit="10" />
          </svg>
        </Link>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3">
        <div
          ref={scrollRef}
          className="strip-hide-scrollbar flex min-h-0 min-w-0 gap-[15px] overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory scroll-pl-4 scroll-pr-4 pb-2 min-[1440px]:scroll-pl-[60px] min-[1440px]:scroll-pr-[60px] px-4 min-[1440px]:px-[60px]"
          aria-label="Catégories de pierres"
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              data-strip-card
              className={`
                group ${stripCardClasses}
                transition-all duration-300
              `}
              onClick={() => {
                setSelectedIndex(index);
                setOpen(true);
              }}
            >
              <CategoryCard
                item={item}
                index={index}
                explorerLabel={explorerLabel}
                onOpen={(i) => {
                  setSelectedIndex(i);
                  setOpen(true);
                }}
              />
            </div>
          ))}
        </div>
        <GemstoneModal
          isOpen={open}
          onClose={() => setOpen(false)}
          initialIndex={selectedIndex}
          locale={locale}
          slides={items.map((item) => ({
            id: String(item.id),
            slug: item.slug,
            href: item.href,
            label: item.title,
            image: item.imageSrc,
            title: item.title,
            description: item.summary,
            count: item.count,
          }))}
        />

        {shouldScroll && (
          <div className="flex w-full min-w-0 items-center gap-2 min-[768px]:gap-3 px-4 min-[1440px]:px-[60px]">
            <div
              className="relative h-[2px] min-h-[2px] min-w-0 flex-1 rounded-full"
              style={{ backgroundColor: INK_20 }}
              aria-hidden
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[#001122] transition-[width] duration-150 ease-out"
                style={{ width: trackFill }}
              />
            </div>
            <div className="flex shrink-0 items-center">
              <StripScrollNav
                dir="prev"
                label="Voir les catégories précédentes"
                onClick={goPrev}
                disabled={!canScroll || atStart}
              />
              <StripScrollNav
                dir="next"
                label="Voir les catégories suivantes"
                onClick={goNext}
                disabled={!canScroll || atEnd}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
