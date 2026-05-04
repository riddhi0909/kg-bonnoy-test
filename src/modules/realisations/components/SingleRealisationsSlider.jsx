"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

/** Swiper config requested: 2/2 mobile, 4/4 tablet, 5/5 desktop. */
const SLIDE_CARD_COUNT_MOBILE = 2;
const SLIDE_CARD_COUNT_TABLET = 4;
const SLIDE_CARD_COUNT_DESKTOP = 5;

/**
 * Related réalisations strip — mobile: 2 slides + side peeks, centered; 2 per swipe.
 * @param {{ items: Array<{ href: string; image: string; title: string; subtitle: string }>; sectionTitle?: string; locale?: string }} props
 */
export function SingleRealisationsSlider({ items: itemsProp, sectionTitle, locale = "fr" }) {
  if (!itemsProp?.length) return null;

  const heading = sectionTitle ?? "You will also enjoy";
  const discoverLabel = locale === "en" ? "Discover" : "Découvrir";
  const paginationLabel =
    locale === "en" ? "Related creations carousel pages" : "Pages du carrousel des créations";

  const swiperKey = useMemo(() => itemsProp.map((i) => i.href).join("|"), [itemsProp]);
  const shouldShowDots = itemsProp.length > SLIDE_CARD_COUNT_MOBILE;
  const swiperRef = useRef(null);

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1440px] px-6 min-[1440px]:px-[60px]">
      <div className="relative px-4 min-[1440px]:px-[60px] pb-[40px] min-[768px]:pb-[80px]">
        <h2 className="m-0 text-center font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#000d29] min-[768px]:leading-[1.2] min-[1440px]:text-[48px]">
          {heading}
        </h2>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3">
        <Swiper
          key={swiperKey}
          className="you-will-also-enjoy-swiper min-h-0 min-w-0 w-full"
          style={{ overflow: "unset" }}
          modules={[Pagination]}
          slidesPerView={SLIDE_CARD_COUNT_MOBILE}
          slidesPerGroup={SLIDE_CARD_COUNT_MOBILE}
          spaceBetween={16}
          grabCursor
          speed={450}
          watchOverflow
          onSwiper={(instance) => {
            swiperRef.current = instance;
          }}
          preventClicks
          preventClicksPropagation
          pagination={{
            el: ".swiper-bullet-wrapper",
            bulletActiveClass: "is-active",
            bulletClass: "swiper-bullet",
            clickable: true,
          }}
          breakpoints={{
            768: {
              slidesPerView: SLIDE_CARD_COUNT_TABLET,
              slidesPerGroup: SLIDE_CARD_COUNT_TABLET,
            },
            992: {
              slidesPerView: SLIDE_CARD_COUNT_DESKTOP,
              slidesPerGroup: SLIDE_CARD_COUNT_DESKTOP,
            },
          }}
        >
          {itemsProp.map((item, index) => (
            <SwiperSlide key={`${item.href}-${index}`} className="!box-border">
              <Link
                href={item.href}
                className="group flex flex-col text-inherit no-underline"
                onClickCapture={(event) => {
                  if (swiperRef.current && swiperRef.current.allowClick === false) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }}
              >
                <div className="relative z-0 mb-2 w-full overflow-hidden rounded-none">
                  <figure className="relative m-0 block h-auto max-w-full overflow-hidden object-cover after:relative after:block after:w-full after:pt-[144%] after:content-['']">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      loading="lazy"
                      width={200}
                      height={288}
                    />
                  </figure>
                </div>
                <div className="min-w-0">
                  <p className="m-0 font-jakarta text-[14px] font-medium leading-[1.5] tracking-normal text-[#000d29]">
                    {item.title}
                  </p>
                  <span className="mt-0.5 block font-jakarta text-[12px] font-normal leading-[1.5] tracking-normal text-[#000d29] transition-colors duration-200 group-hover:text-[#ff6633]">
                    {item.subtitle}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {shouldShowDots ? (
          <div
            className="swiper-bullet-wrapper flex flex-wrap items-center justify-center gap-4 px-4 pt-8 min-[1440px]:px-[60px]"
            aria-label={paginationLabel}
          />
        ) : null}
      </div>
      <style jsx global>{`
        .swiper-bullet {
          width: 8px;
          height: 8px;
          transform: rotate(45deg);
          border: 0;
          padding: 0;
          background: #d4cfc7;
          transition: background-color 0.2s ease;
          cursor: pointer;
          opacity: 1;
          margin: 0;
        }
        .swiper-bullet.is-active {
          background: #ff6633;
        }
      `}</style>
    </div>
  );
}
