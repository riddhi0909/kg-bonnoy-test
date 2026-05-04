"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export function OurAchievementsSection({
  title,
  subHeading,
  buttonTitle,
  buttonLink,
  items = [],
}) {
  const safeTitle = String(title ?? "").trim();
  const safeSubHeading = String(subHeading ?? "").trim();
  const safeButtonTitle = String(buttonTitle ?? "").trim();
  const safeButtonLink = String(buttonLink ?? "").trim();
  const sliderItems = Array.isArray(items)
    ? items.filter((item) => item && (item.href || item.title || item.image))
    : [];
  const loopItems = sliderItems.slice(0, 9);
  const postCount = sliderItems.length;

  if (loopItems.length === 0) return null;

  return (
    <div className="mx-auto w-full color-#000d29">
      <div className="">
        <div className="flex flex-col items-center justify-start">
          <div className="mb-4 flex items-center justify-start gap-1 bg-[#ffd0a9] px-2 py-2 text-[12px] font-medium uppercase leading-none tracking-normal text-[#ff6633]">
            <span className="text-[#ff6633]">
              <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 6 6"
                className="h-[6px] w-auto shrink-0"
                aria-hidden="true"
              >
                <rect
                  fill="currentColor"
                  x="1.79"
                  y="0.88"
                  width="4.24"
                  height="4.24"
                  transform="translate(-1.89 3.65) rotate(-45)"
                ></rect>
              </svg>
            </span>
            <span>{safeSubHeading}</span>
            <div className="flex h-[15px] w-6 items-center justify-center rounded-[4px] bg-[#ffe9d4]">
              <span className="mt-[-1px] flex items-center justify-center bg-[#ffe9d4] p-0 text-[10px] leading-none text-[#000d29]">
                {postCount}
              </span>
            </div>
          </div>
          {safeTitle ? (
            <h2 className="mb-[42px] text-center font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#f4efe6] min-[768px]:text-[52px]">
              {safeTitle}
            </h2>
          ) : null}
        </div>
      </div>

      <Swiper
        modules={[Autoplay]}
        className="kg-portfolio-slider"
        spaceBetween={0}
        slidesPerView={5}
        centeredSlides
        loop
        loopAdditionalSlides={2}
        speed={1500}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        breakpoints={{
          1871: { slidesPerView: 5 },
          1440: { slidesPerView: 3.5 },
          768: { slidesPerView: 3 },
          0: { slidesPerView: 1.5 },
        }}
      >
        {loopItems.map((item) => (
          <SwiperSlide key={item.href}>
            {({ isActive }) => (
              <div
                className={`relative z-[100] flex h-full w-full flex-col items-start justify-start py-0 transition-transform duration-500 ease-in [transform:scale(.9)] ${
                  isActive ? "mx-auto w-[92%] [transform:scale(1,1)]" : ""
                }`}
              >
              <div className={`relative z-[-1] block h-full w-full max-w-full object-cover ${isActive ? "[aspect-ratio:1/1.5]" : "[aspect-ratio:6/8]"}`}>
                <Link href={item.href || "#"}>
                  <img src={item.image} alt={item.imageAlt || item.title} className="inline-block h-full w-full object-cover object-center" loading="lazy" />
                </Link>
              </div>
              <div className="absolute inset-x-0 bottom-0 z-[2] flex items-center justify-center bg-[#f4efe6] p-4 text-center text-[#000d29]">
                <h3 className="text-center font-serif text-[18px] font-medium leading-[1.2] tracking-normal text-[#000d29]">
                  <Link href={item.href || "#"} className="text-[#000d29] no-underline">
                    {item.title}
                  </Link>
                </h3>
              </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mt-[50px] flex justify-center">
          <Link
            href={safeButtonLink || "#"}
            className="group flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#f63] px-[15px] py-2 border border-[#f63] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-white hover:text-[#f63]"
          >
            {safeButtonTitle || "Learn more"}
            <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path
                d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                stroke="currentColor"
                strokeOpacity="0.85"
                strokeMiterlimit="10"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
