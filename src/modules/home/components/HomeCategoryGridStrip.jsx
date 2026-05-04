"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { productsPath } from "@/constants/routes";

const INK = "#001122";
const INK_20 = "rgba(0, 17, 34, 0.2)";

function renderStripTitle(title) {
  const raw = String(title || "").trim();
  if (!raw) return null;

  // Allow simple WYSIWYG markup from ACF title field.
  if (/[<][a-z/!]/i.test(raw)) {
    const safeHtml = raw
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "")
      .replace(/\sstyle="[^"]*"/gi, "")
      .replace(/\sstyle='[^']*'/gi, "");
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
      <span className="italic text-[28px] max-[768px]:text-[21px]">{parts[0]}</span>{" "}
      <span className="uppercase text-[21px] max-[768px]:text-[17px]">{parts.slice(1).join(" ")}</span>
    </>
  );
}

function StripScrollNav({ dir, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center transition-opacity disabled:cursor-not-allowed disabled:opacity-25 hover:opacity-80"
      style={{ color: INK }}
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

function normalizeCtaUrl(raw, locale) {
  const value = String(raw || "").trim();
  if (!value) return productsPath(locale);
  return value;
}

/**
 * Homepage category block matching provided Figma screenshot.
 * @param {{ categories?: Array<{ id?: string; slug?: string; name?: string }>; locale: string; title: string; viewAllLabel: string; viewAllHref?: string }} props
 */
export function HomeCategoryGridStrip({ categories = [], columns = [], locale, title, viewAllLabel, viewAllHref  }) {
  const cards = columns
    .filter(Boolean)
    .slice(0, 3)
    .map((col, index) => ({
      id: col?.id || `grid-column-${index}`,
      title: String(col?.title || "").trim(),
      image: String(col?.image || "").trim() || null,
      imageAlt: String(col?.imageAlt || col?.title || "").trim(),
      href: normalizeCtaUrl(col?.buttonUrl, locale),
      cta: String(col?.buttonTitle || "").trim(),
    }))
    .filter((card) => card.title || card.image || card.cta);
console.log(viewAllHref);

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
  }, [cards.length, updateScrollUi]);

  const scrollStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 120;
    const first = el.querySelector("[data-strip-card]");
    const second = first?.nextElementSibling;
    if (first && "offsetWidth" in first) {
      let gap = 24;
      if (second && "offsetLeft" in second && "offsetLeft" in first) {
        gap = second.offsetLeft - first.offsetLeft - first.offsetWidth;
      }
      return first.offsetWidth + Math.max(0, gap);
    }
    return 120;
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

  if (!cards.length) return null;

  return (
    <section className="mx-auto w-full max-w-[1440px]">
      <div className="mb-[30px] flex items-center justify-between px-4 min-[1440px]:px-[60px] max-[767px]:flex-col max-[767px]:gap-[30px]">
        <h2 className="kg-title-h2 font-serif text-[32px] font-normal leading-[1.05] text-[#001122] max-[1023px]:text-[24px]">
          {renderStripTitle(title)}
        </h2>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#001122] hover:text-[#FF6633] ml-auto"
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {viewAllLabel || "Toute la joaillerie"}
          <svg className="shrink-0" width="12" height="12" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M0 6.35H12M12 6.35L6 0.35M12 6.35L6 12.35" stroke="currentColor" strokeOpacity="0.85" />
          </svg>
        </Link>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3">
        <div
          ref={scrollRef}
          className="strip-hide-scrollbar min-w-0 gap-6 max-[899px]:flex max-[899px]:flex-row max-[899px]:flex-nowrap max-[899px]:overflow-x-auto max-[899px]:overflow-y-hidden max-[899px]:overscroll-x-contain max-[899px]:snap-x max-[899px]:snap-mandatory max-[899px]:scroll-pl-4 max-[899px]:scroll-pr-4 max-[899px]:px-4 max-[899px]:pb-2 min-[899px]:grid min-[899px]:grid-cols-3 min-[899px]:overflow-visible px-4 min-[1440px]:px-[60px]"
          aria-label="Catégories de joaillerie"
        >
        {cards.map((item, i) => (
          <article
            key={item.id}
            data-strip-card
            className="group flex min-w-0 flex-col
              max-[899px]:w-[calc((100%-1rem)/1.1)]
              max-[899px]:shrink-0 max-[899px]:snap-start"
          >
            <Link href={item.href} className="block">
              <div className="relative aspect-[0.72] w-full overflow-hidden bg-[#e8e2dc]">
                {item.image ? (
                  <Image src={item.image} alt={item.imageAlt || item.title} fill sizes="(max-width: 899px) 85vw, 33vw" className="object-cover
                    transition-transform duration-500
                    group-hover:scale-110" loading="lazy" />
                ) : null}
              </div>
            </Link>

            <div className="mt-[30px] flex flex-1 flex-col items-center h-full">
              <Link href={item.href} className="no-underline">
                <h3 className="text-center font-serif text-[21px] font-normal leading-[25px] mb-[30px]
                    text-[#001122]
                    transition-colors duration-300
                    group-hover:text-[#FF6633]

                    max-[768px]:text-[17px]">
                  {item.title}
                </h3>
              </Link>
              
              {/* {item.productThumbs.length > 0 ? (
                <div className="mb-[30px] flex flex-wrap items-center justify-center gap-3">
                  {item.productThumbs.map((thumb) => (
                    <Link
                      href={productPath(locale, thumb.slug)}
                      key={`${item.id}-product-${thumb.id}`}
                      className="h-[40px] w-[40px] overflow-hidden rounded-full
                        border border-[rgba(0,17,34,0.2)]
                        shadow-[0px_5px_5px_0px_rgba(0,0,0,0.25)]
                        transition-transform duration-300
                        hover:scale-110"
                    >
                      <img
                        src={thumb.image}
                        alt={thumb.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </Link>
                  ))}
                </div>
              ) : null} */}

              <Link
                href={item.href}
                className="group mt-auto inline-flex items-center justify-center gap-2
                    border border-[rgba(0,17,34,0.2)]
                    px-5 py-[9px]
                    text-sm font-semibold text-[#001122]

                    transition-all duration-300

                    hover:bg-[#001122]
                    hover:text-white
                    hover:border-[#001122]"
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
                }}
              >
                {item.cta || `Explorer les ${item.title}`}
                <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="12" height="12" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M0 6.35H12M12 6.35L6 0.35M12 6.35L6 12.35" stroke="currentColor" strokeOpacity="0.85" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
        </div>

        {shouldScroll && (
          <div className="flex w-full min-w-0 items-center gap-2 min-[768px]:gap-3 px-4 min-[1440px]:px-[60px] max-[899px]:flex min-[900px]:hidden ">
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
    </section>
  );
}
