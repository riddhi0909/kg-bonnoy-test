"use client";


import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/modules/product/components/ProductCard";
import { productPath } from "@/modules/product/routes/paths";


const INK = "#001122 hover:text-[#FF6633]";
const INK_20 = "rgba(0, 17, 34, 0.2)";


function StripScrollNav({ dir, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center
        text-[#001122]
        transition-colors duration-300
        hover:text-[#FF6633]
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
 * Homepage product strip — Figma peek counts vs track width (gaps: 16px &lt;768, 30px ≥768):
 * ≤480px → 1.1 cards; 481–1023 → 2.2; 1024–1439 → 3.2; ≥1440 → fixed row, five equal flex columns.
 * @param {{ products: object[]; locale: string; title: string; viewAllHref: string; viewAllLabel?: string; titleDisplayMode?: "pluralWithBrand" | "raw" }} props
 */
export function HomeProductStrip({
  products,
  locale,
  title,
  viewAllHref,
  viewAllLabel,
  titleDisplayMode = "pluralWithBrand",
}) {
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
  }, [products, updateScrollUi]);


  const scrollStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 330;
    const first = el.querySelector("[data-strip-card]");
    const second = first?.nextElementSibling;
    if (first && "offsetWidth" in first) {
      let gap = 30;
      if (second && "offsetLeft" in second && "offsetLeft" in first) {
        gap = second.offsetLeft - first.offsetLeft - first.offsetWidth;
      }
      return first.offsetWidth + Math.max(0, gap);
    }
    return 330;
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


  if (!products?.length) return null;


  const shouldScroll = canScroll;


  const trackFill = `${scrollProgress * 100}%`;


  /** @ 1440: fixed row width; five cards flex equally — no horizontal scroll. */
  const stripShell = "flex w-full min-w-0 flex-col gap-3";


  /** Card width = (track − full gaps) / visible fractional count; matches Figma peek. */
  const stripCardClasses =
    "shrink-0 snap-start " +
    "max-[480px]:w-[calc((100%-1rem)/1.1)] " +
    "min-[481px]:max-[768px]:w-[calc((100%-2rem)/2.2)] " +
    "min-[768px]:max-[1024px]:w-[calc((100%-60px)/2.2)] " +
    "min-[1024px]:max-[1400px]:w-[calc((100%-90px)/3.2)] " +
    "min-[1400px]:w-[calc((100%-1rem)/4.1)]";


  const scrollTrackClasses = `
    strip-hide-scrollbar flex min-h-0 min-w-0 overflow-y-hidden overscroll-x-contain pb-2
    snap-x snap-mandatory
    overflow-x-auto
    max-[767px]:gap-4 min-[767px]:gap-[15px]
    scroll-pl-4 scroll-pr-4 pb-2 min-[1440px]:scroll-pl-[60px] min-[1440px]:scroll-pr-[60px] px-4 min-[1440px]:px-[60px]
  `;


  const safeTitle = String(title || "").trim();
  const headingText =
    titleDisplayMode === "raw"
      ? (
        <>
          <span className="italic text-[28px]">L’authenticité{" "}</span>
          <span className="uppercase">des {safeTitle}s Bonnot Paris</span>
        </>
      )
      : <span className="uppercase">Les {safeTitle}s Bonnot Paris</span>;
  const fallbackViewAllLabel =
    titleDisplayMode === "raw"
      ? `Tous les ${safeTitle}`
      : `Tous les ${safeTitle}s`;
  const viewAllText = String(viewAllLabel || fallbackViewAllLabel).trim();

  return (
    <div className="flex min-w-0 flex-col gap-[30px]">
      {/* Mobile (ref): title centré, lien « Tous les saphirs » aligné à droite en dessous */}
      <div className="flex w-full flex-col gap-[30px] min-[768px]:flex-row min-[768px]:items-center min-[768px]:justify-between min-[768px]:gap-3 px-4 min-[1440px]:px-[60px]">
        <h2 className="w-full text-left font-serif text-[17px] font-normal leading-[1.19] tracking-[0.02em] text-[#001122] min-[768px]:w-auto min-[1440px]:text-[21px]">
          {headingText}
        </h2>
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-[10px] self-end text-sm font-semibold leading-5 text-[#001122] hover:text-[#FF6633] transition-opacity min-[768px]:self-auto min-[768px]:gap-[12px]"
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {viewAllText}
          <svg className="shrink-0" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
              d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
              stroke="currentColor"
              strokeOpacity="0.85"
              strokeMiterlimit="10"
            />
          </svg>
        </Link>
      </div>


      <div className={stripShell}>
        <div ref={scrollRef} className={scrollTrackClasses}>
          {products.map((p) => (
            <div
              key={p.id}
              data-strip-card
              className={stripCardClasses}
            >
              <ProductCard product={p} locale={locale} href={productPath(locale, p.slug)} variant="strip" />
            </div>
          ))}
        </div>


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
                label="Voir les produits précédents"
                onClick={goPrev}
                disabled={!canScroll || atStart}
              />
              <StripScrollNav
                dir="next"
                label="Voir les produits suivants"
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