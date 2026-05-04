"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/** Matches `public/figma/hp/vector-arrow.svg` — `currentColor` for theme / disabled. */
function VectorArrowIcon({ className = "", mirrored }) {
  const svg = (
    <svg
      className={className}
      width="13"
      height="13"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
        stroke="currentColor"
        strokeMiterlimit={10}
      />
    </svg>
  );

  if (mirrored) {
    return (
      <span className="inline-flex items-center justify-center scale-x-[-1]" aria-hidden>
        {svg}
      </span>
    );
  }

  return svg;
}

/**
 * Scroll-snap slider. Arrows move by one "page": step = (visible slide count) × slide width.
 * Mobile (1 visible): 1,2,3,… per click. Desktop md+ (2 visible): 1–2 → 3–4 → 5–6, …
 */
export function RealisationsPortfolioTrack({ children, className = "" }) {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const items = Children.toArray(children).filter(isValidElement);

  const getSlideMetrics = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || items.length === 0) return null;
    const first = el.firstElementChild;
    if (!first) return null;
    const slideW = first.getBoundingClientRect().width;
    if (slideW <= 0) return null;
    const visible = Math.max(
      1,
      Math.min(items.length, Math.floor((el.clientWidth + 0.5) / slideW)),
    );
    const stepPx = visible * slideW;
    if (stepPx <= 0) return null;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const maxPage = Math.max(0, Math.floor((maxScroll + 0.5) / stepPx));
    return { slideW, visible, stepPx, maxPage };
  }, [items.length]);

  const updateActive = useCallback(() => {
    const m = getSlideMetrics();
    if (!m) return;
    const el = scrollerRef.current;
    if (!el) return;
    setMaxIndex(m.maxPage);
    const a = Math.min(
      m.maxPage,
      Math.max(0, Math.round(el.scrollLeft / m.stepPx)),
    );
    setActive(a);
  }, [getSlideMetrics]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    setActive(0);
    const m = getSlideMetrics();
    if (m) setMaxIndex(m.maxPage);
  }, [items.length, getSlideMetrics]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateActive();
    el.addEventListener("scroll", updateActive, { passive: true });
    const ro = new ResizeObserver(updateActive);
    ro.observe(el);
    const first = el.firstElementChild;
    if (first) ro.observe(first);
    return () => {
      el.removeEventListener("scroll", updateActive);
      ro.disconnect();
    };
  }, [updateActive]);

  const scrollToSlide = useCallback(
    (index) => {
      const m = getSlideMetrics();
      if (!m) return;
      const el = scrollerRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(m.maxPage, index));
      const maxLeft = el.scrollWidth - el.clientWidth;
      const nextLeft = Math.min(clamped * m.stepPx, maxLeft);
      el.scrollTo({ left: nextLeft, behavior: "smooth" });
    },
    [getSlideMetrics],
  );

  const arrowBtn =
    "pointer-events-auto flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-white/90 text-[#001122] shadow-[0_1px_4px_rgba(0,17,34,0.15)] backdrop-blur-sm transition-opacity cursor-pointer disabled:pointer-events-none disabled:opacity-35 md:h-11 md:w-11 ";

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={scrollerRef}
        className="flex h-full w-full flex-row flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <div
            key={i}
            className={
              child?.props?.desktopOnly
                ? "hidden h-full shrink-0 snap-start md:block md:min-w-0 md:w-1/2 min-[1440px]:w-[720px] min-[1440px]:shrink-0"
                : "h-full min-w-full shrink-0 snap-start md:min-w-0 md:w-1/2 min-[1440px]:w-[720px] min-[1440px]:shrink-0"
            }
          >
            {child}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-between px-3">
        <button
          type="button"
          aria-label="Réalisation précédente"
          disabled={active <= 0}
          className={arrowBtn}
          onClick={() => scrollToSlide(active - 1)}
        >
          <VectorArrowIcon mirrored />
        </button>
        <button
          type="button"
          aria-label="Réalisation suivante"
          disabled={active >= maxIndex}
          className={arrowBtn}
          onClick={() => scrollToSlide(active + 1)}
        >
          <VectorArrowIcon />
        </button>
      </div>
    </div>
  );
}
