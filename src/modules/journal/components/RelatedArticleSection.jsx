 "use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { journalPath } from "@/constants/routes";

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function RelatedArticleSection({
    locale = "fr",
    relatedSection,
    relatedPosts = [],
}) {
    const items = useMemo(() => relatedPosts.slice(0, 2), [relatedPosts]);
    const [mobileIndex, setMobileIndex] = useState(0);
    const hasMobileSlider = items.length > 1;
    const isAtStart = mobileIndex === 0;
    const isAtEnd = mobileIndex >= Math.max(items.length - 1, 0);
    const mobileSwiperRef = useRef(null);
    const isDraggingRef = useRef(false);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const touchMovedRef = useRef(false);

    const goPrev = () => {
      mobileSwiperRef.current?.slidePrev();
    };

    const goNext = () => {
      mobileSwiperRef.current?.slideNext();
    };

    return (
        <div className="mx-auto w-full max-w-[1200px] px-[50px] py-[100px] max-[768px]:py-[75px] max-[768px]:px-4">
            <div className="py-0 px-0">
                <div className="mb-[80px] mx-auto flex w-fit flex-col items-center max-[991px]:mb-[64px] max-[768px]:mb-[40px]">
                    <h2 className="mb-4 text-center font-serif text-[52px] font-medium leading-[1.2] text-[#000d29]">
                      {relatedSection?.title || "À lire aussi"}
                    </h2>
                    <p className="text-center text-[24px] font-normal leading-[1.5] text-[#000d29] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] ">
                      {relatedSection?.description || ""}
                    </p>
                    <Link
                      href={journalPath(locale)}
                      className="link underlined-link scroll-trigger animate--slide-in min-[992px]:hidden mt-4 font-medium underline text-[16px]"
                    >
                      Tout afficher
                    </Link>
                </div>
                <div className="hidden min-[768px]:grid grid-cols-1 gap-2 min-[768px]:grid-cols-2">
                  {items.map((item) => {
                    const href = `/journal/${String(item?.slug || "").replace(/^\/+|\/+$/g, "")}`;
                    const title = stripHtml(item?.title);
                    const image = item?.featuredImage?.node?.sourceUrl || "";
                    const imageAlt = stripHtml(item?.featuredImage?.node?.altText) || title;
                    const author = stripHtml(item?.author?.node?.name) || "Bonnot Paris";
                    return (
                      <article key={item?.id || href} className="overflow-hidden">
                        <Link href={href} className="group block">
                          <div className="h-[300px] w-full overflow-hidden bg-[#f0e8de]">
                            {image ? (
                              <img src={image} alt={imageAlt} className="h-full w-full object-cover" loading="lazy" />
                            ) : null}
                          </div>
                          <div className="flex h-[150px] flex-col justify-between bg-[#faf5ef] p-6 transition-colors duration-200 group-hover:text-[#ee4308]">
                            <h3
                              className="mb-3 text-[20px] font-semibold leading-[1.5] text-[#000d29] transition-colors duration-200 group-hover:text-[#ee4308] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif]"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {title}
                            </h3>
                            <div className="mt-4 flex flex-wrap capitalize items-center gap-2 text-[14px] leading-[1.5] text-[#000d29] transition-colors duration-200 group-hover:text-[#ee4308] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif]">
                              <span className="font-semibold">{author}</span>
                              <span aria-hidden="true">•</span>
                              <span>{formatDate(item?.date)}</span>
                              {/* <span aria-hidden="true">•</span>
                              <span>5 Min Read</span> */}
                            </div>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
                <div className="block min-[768px]:hidden">
                  {items.length ? (
                    <>
                      <Swiper
                        slidesPerView={1.01}
                        slidesPerGroup={1}
                        spaceBetween={5}
                        speed={450}
                        watchOverflow
                        threshold={8}
                        preventClicks
                        preventClicksPropagation
                        className="w-full !overflow-visible"
                        onSwiper={(instance) => {
                          mobileSwiperRef.current = instance;
                          setMobileIndex(instance.realIndex || 0);
                        }}
                        onSlideChange={(instance) => {
                          setMobileIndex(instance.realIndex || 0);
                        }}
                        onTouchStart={() => {
                          isDraggingRef.current = false;
                        }}
                        onSliderMove={() => {
                          isDraggingRef.current = true;
                        }}
                        onTouchEnd={() => {
                          requestAnimationFrame(() => {
                            isDraggingRef.current = false;
                          });
                        }}
                      >
                        {items.map((item) => {
                          const href = `/journal/${String(item?.slug || "").replace(/^\/+|\/+$/g, "")}`;
                          const title = stripHtml(item?.title);
                          const image = item?.featuredImage?.node?.sourceUrl || "";
                          const imageAlt = stripHtml(item?.featuredImage?.node?.altText) || title;
                          const author = stripHtml(item?.author?.node?.name) || "Bonnot Paris";

                          return (
                            <SwiperSlide key={item?.id || href}>
                              <article className="overflow-hidden">
                                <Link
                                  href={href}
                                  className="group block"
                                  onTouchStartCapture={(event) => {
                                    const touch = event.touches?.[0];
                                    if (!touch) return;
                                    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
                                    touchMovedRef.current = false;
                                  }}
                                  onTouchMoveCapture={(event) => {
                                    const touch = event.touches?.[0];
                                    if (!touch) return;
                                    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
                                    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
                                    if (dx > 6 || dy > 6) {
                                      touchMovedRef.current = true;
                                    }
                                  }}
                                  onTouchEndCapture={() => {
                                    requestAnimationFrame(() => {
                                      touchMovedRef.current = false;
                                    });
                                  }}
                                  onClickCapture={(event) => {
                                    if (
                                      touchMovedRef.current ||
                                      isDraggingRef.current ||
                                      (mobileSwiperRef.current && mobileSwiperRef.current.allowClick === false)
                                    ) {
                                      event.preventDefault();
                                      event.stopPropagation();
                                    }
                                  }}
                                >
                                  <div className="h-[300px] w-full overflow-hidden bg-[#f0e8de]">
                                    {image ? (
                                      <img src={image} alt={imageAlt} className="h-full w-full object-cover" loading="lazy" />
                                    ) : null}
                                  </div>
                                  <div className="flex h-[150px] flex-col justify-between bg-[#faf5ef] p-6 transition-colors duration-200 group-hover:text-[#ee4308]">
                                    <h3
                                      className="mb-3 text-[20px] font-semibold leading-[1.5] text-[#000d29] transition-colors duration-200 group-hover:text-[#ee4308] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif]"
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {title}
                                    </h3>
                                    <div className="mt-4 flex flex-wrap capitalize items-center gap-2 text-[14px] leading-[1.5] text-[#000d29] transition-colors duration-200 group-hover:text-[#ee4308] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif]">
                                      <span className="font-semibold">{author}</span>
                                      <span aria-hidden="true">•</span>
                                      <span>{formatDate(item?.date)}</span>
                                    </div>
                                  </div>
                                </Link>
                              </article>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                      {hasMobileSlider ? (
                        <div className="mt-6 flex items-center justify-center gap-6 text-[#000d29]">
                          <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Faire glisser vers la gauche"
                            disabled={isAtStart}
                            className="inline-flex h-6 w-6 items-center justify-center text-[#000d29] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <svg className="h-2 w-2 rotate-90" viewBox="0 0 10 6" aria-hidden="true">
                              <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <div className="text-[10px] leading-[1.5] font-jakarta">
                            <span>{mobileIndex + 1}</span>
                            <span aria-hidden="true"> / </span>
                            <span className="sr-only">de</span>
                            <span>{items.length}</span>
                          </div>
                          <button
                            type="button"
                            onClick={goNext}
                            aria-label="Faire glisser vers la droite"
                            disabled={isAtEnd}
                            className="inline-flex h-6 w-6 items-center justify-center text-[#000d29] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <svg className="h-2 w-2 -rotate-90" viewBox="0 0 10 6" aria-hidden="true">
                              <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
                <div className="mt-10 flex justify-center max-[991px]:hidden">
                  <Link
                    href={journalPath(locale)}
                    className="inline-flex h-12 min-h-12 items-center gap-2 bg-[#000d29] px-6 text-[14px] font-medium leading-[1.5] text-[#f4efe6] transition-colors duration-300 hover:bg-[#fd641b]"
                  >
                    Tout afficher
                  </Link>
                </div>
            </div>
        </div>
    );
}
export default RelatedArticleSection;