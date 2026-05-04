"use client";

import { useState } from "react";

const PHILOSOPHY_ITEMS = [
  {
    title: "Excellency",
    body: "We believe in the excellence of not only our gemstones, but also our craftsmanship. Each gem is carefully selected and each piece of jewelry is crafted with meticulous attention to detail.",
  },
  {
    title: "Authenticity",
    body: "We believe in the excellence of not only our gemstones, but also our craftsmanship. Each gem is carefully selected and each piece of jewelry is crafted with meticulous attention to detail.",
  },
  {
    title: "Singularity",
    body: "We believe in the excellence of not only our gemstones, but also our craftsmanship. Each gem is carefully selected and each piece of jewelry is crafted with meticulous attention to detail.",
  },
];

function decodeTextWithBreaks(value) {
  return String(value || "")
    .replace(/<\/p>/gi, "")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;|&#8217;|&#x2019;/gi, "'")
    .replace(/&lsquo;|&#8216;|&#x2018;/gi, "'")
    .replace(/&quot;|&#34;|&#x22;/gi, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

export function PhilosophyAccordionSection({ title, description, accordion, image, imageAlt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items =
    Array.isArray(accordion) && accordion.length
      ? accordion.map((item) => ({
          title: item?.title || "",
          body: item?.description || "",
        }))
      : PHILOSOPHY_ITEMS;
  const handleToggleClick = (idx) => {
    setActiveIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <div className="">
      <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
        <div className="">
          <h2 className="m-0 mb-5 text-center font-serif text-[36px] font-medium leading-[1.2] tracking-normal min-[768px]:mb-8 min-[768px]:text-[48px] max-[479px]:text-left">
            {title || "Our philosophy"}
          </h2>
          <p className="m-0 mb-12 text-center [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[20px] leading-[1.8] font-medium tracking-normal text-[#001122] min-[768px]:mb-[64px] min-[992px]:mb-20 min-[768px]:text-[18px] max-[479px]:text-left">
            {(decodeTextWithBreaks(description) ||
              "The philosophy of Maison Bonnot Paris is based on three fundamental pillars: Excellence, Authenticity and Singularity.")
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line, idx, arr) => (
                <span key={`${line}-${idx}`}>
                  {line}
                  {idx < arr.length - 1 ? <br /> : null}
                </span>
              ))}
          </p>
        </div>

        <div className="mx-auto grid h-auto min-h-[530px] grid-cols-1 bg-[#f0e9e0] min-[992px]:grid-cols-[1fr_.8fr] min-[992px]:gap-0 max-[991px]:flex max-[991px]:w-full max-[991px]:flex-col max-[991px]:gap-16 max-[991px]:p-16 max-[767px]:px-0 max-[767px]:pt-8 max-[767px]:pb-0">
          <div className="mx-auto flex w-full max-w-[458px] flex-col justify-center gap-4 min-[992px]:w-[90%] ">
            {items.map((item, idx) => {
              const active = idx === activeIndex;
              return (
                <div key={item.title}>
                  <div className="relative inline-block w-full text-left">
                    <button
                      type="button"
                      onClick={() => handleToggleClick(idx)}
                      className={`flex w-full items-center justify-between p-0 text-left cursor-pointer ${active ? "active" : ""}`}
                    >
                      <h3 className={`flex w-full items-center justify-between p-0 font-serif text-[28px] font-medium tracking-normal min-[768px]:text-[32px] ${active ? "text-[#FF6633]" : "text-[#707385]"}`}>
                        {item.title}
                      </h3>
                      <span className={`arrow-code absolute right-0 transition-all duration-700 ease-in-out ${active ? "rotate-0" : "rotate-180"}`}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M24 20L16 12L8 20" stroke="#707385" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>

                    <div
                      className={`relative min-w-full overflow-hidden transition-all duration-700 ease-in-out ${
                        active ? "max-h-[240px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="m-0 pt-5 text-left [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] font-normal leading-[1.5] tracking-normal text-[#7e7067] min-[768px]:pt-8">
                        {decodeTextWithBreaks(item.body)}
                      </p>
                    </div>
                  </div>
                  {idx < items.length - 1 ? <div className="block h-px w-full bg-[#ddd4c6] mt-[16px]" /> : null}
                </div>
              );
            })}
          </div>

          <div className="">
            <img
              src={image}
              alt={imageAlt || title || "Our philosophy"}
              className="inline-block h-full w-full max-w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
