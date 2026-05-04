"use client";

import Link from "next/link";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { categoryPath } from "@/constants/routes";

/**
 * Horizontal gem rail (Figma: 90px discs, 15px gap). Uses WP categories when provided.
 * @param {{
 *   locale: string;
 *   categories?: Array<{ id: string; slug: string; name: string }>;
 *   currentSlug?: string;
 *   className?: string;
 * }} props
 */
export function CategoryGemScroller({ locale, categories = [], currentSlug = "", className = "" }) {
  function imageCandidatesForCategory(category) {
    const urls = [
      String(category?.image?.sourceUrl || "").trim(),
      String(category?.image?.mediaItemUrl || "").trim(),
    ].filter(Boolean);
    return Array.from(new Set(urls));
  }

  const items = categories
    .filter((c) => c?.slug && c?.name)
    .map((c) => ({
      key: c.id || c.slug,
      href: categoryPath(locale, c.slug),
      label: c.name,
      imageCandidates: imageCandidatesForCategory(c),
      active: c.slug === currentSlug,
    }));

  if (!items.length) return null;

  return (
    <Swiper
      modules={[FreeMode, Mousewheel]}
      slidesPerView="auto"
      freeMode
      mousewheel={true}
      className={`swiper !pl-1 min-[767px]:!pl-[30px] min-[1440px]:!pl-[70px] !pt-2 mb-[30px] min-[768px]:mb-[50px] ${className}`}
      aria-label="Pierres précieuses"
    >
      {items.map((item) => {
        const primaryImage = item.imageCandidates[0] || null;
        const inner = (
          <>
            <div
              className={`mx-auto h-[90px] w-[90px] rounded-full transition-all duration-300
              ${item.active ? "ring-1 ring-[#00112233] ring-offset-2 ring-offset-[#fffaf5]" : ""}`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#f5eee5] overflow-hidden">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt=""
                    className="h-[70px] w-[70px] transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={(event) => {
                      const img = event.currentTarget;
                      const fallback = item.imageCandidates[1] || "";
                      if (!fallback || img.src === fallback) return;
                      img.src = fallback;
                    }}
                  />
                ) : null}
              </div>
            </div>
            <p
              className={`mt-[15px] whitespace-nowrap text-center text-sm leading-[1.428] transition-colors duration-300
              [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]
              ${
                item.active
                  ? "font-semibold text-[#001122]"
                  : "text-[rgba(0,17,34,0.75)] group-hover:text-[#001122]"
              }`}
            >
              {item.label}
            </p>
          </>
        );

        return (
          <SwiperSlide key={item.key} className="!mr-[15px] !w-[150px] !shrink-0">
            <Link href={item.href} className="group block w-[150px] text-center no-underline">
              {inner}
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
