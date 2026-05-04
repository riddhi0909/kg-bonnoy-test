"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryCard({ item, index, explorerLabel, onOpen, variant }) {
  const fallbackImage = "/figma/gem-aigue-marine.png";
  const shouldRoundImage = !(variant === "category_list" && item?.isMainCategory);
  const [imageSrc, setImageSrc] = useState(item.imageSrc || fallbackImage);

  useEffect(() => {
    setImageSrc(item.imageSrc || fallbackImage);
  }, [item.imageSrc]);

  return (
   
      <div className="flex h-full flex-col">
        <div
          className="block bg-[rgba(255,255,255,0.1)] cursor-pointer"
          onClick={() => onOpen(index)}
        >
          <div
            className={`relative mx-auto flex w-full aspect-square items-center justify-center
              overflow-hidden
              border border-[rgba(0,17,34,0.2)]
              bg-[rgba(255,255,255,0.1)]
              ${shouldRoundImage ? "rounded-full" : ""}`}
          >
            <Image
              src={imageSrc}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`h-full w-full object-cover
                transition-transform duration-500
                group-hover:scale-110
                ${shouldRoundImage ? "rounded-full" : ""}`}
              loading="lazy"
              onError={() => {
                if (imageSrc !== fallbackImage) setImageSrc(fallbackImage);
              }}
            />
          </div>
        </div>
        <div
          className="flex flex-col h-full gap-[30px] border-t border-[rgba(0,17,34,0.2)] p-[15px] text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mt-[15px] flex items-center justify-between gap-[10px]">
            <Link href={item.href} className="no-underline">
              <h3
                className="font-serif text-[21px] font-normal leading-[25px]
                  text-[#001122]
                  transition-colors duration-300
                  group-hover:text-[#FF6633]
                  max-[768px]:text-[17px]"
              >
                {item.title} 
                {variant === "category_list" && (
                  <span className="text-[14px] font-normal leading-[1.428] relative top-[-6px] ml-[5px]">
                    ({item.count})
                  </span>
                )}
              </h3>
            </Link>
            {variant !== "category_list" && (
            <p className="mt-1 text-center text-sm font-semibold leading-[1.428] text-[#001122]">
              {item.count} pierres
            </p>
            )}
          </div>
          {variant !== "category_list" && item.summary ? (
            <p className="line-clamp-3 text-sm font-normal leading-[1.428] text-[rgba(0,17,34,0.75)]">
              {item.summary}
            </p>
          ) : null}
          {variant !== "category_list" && (
            <Link
              href={item.href}
              className="group mt-auto inline-flex items-center justify-center gap-[10px]
                border border-[rgba(0,17,34,0.2)]
                p-[9px]
                text-sm font-semibold text-[#001122]
                transition-all duration-300
                hover:bg-[#001122]
                hover:text-white
                hover:border-[#001122]"
            >
              {explorerLabel}
              <svg
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                  stroke="currentColor"
                  strokeOpacity="0.85"
                  strokeMiterlimit="10"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
   
  );
}
