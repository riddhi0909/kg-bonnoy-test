"use client";

import Link from "next/link";
import { cn } from "@/modules/common/utils/cn";

/**
 * Promo card displayed in the category grid alongside product cards.
 * Styled as a luxury editorial block with full-bleed image and overlay content.
 *
 * @param {{
 *   image: string;
 *   title: string;
 *   description: string;
 *   buttonText: string;
 *   url: string;
 *   overlay?: "dark" | "light";
 *   badge?: string;
 *   className?: string;
 * }} props
 */
export function CategoryPromoCard({
  image,
  title,
  description,
  buttonText,
  url,
  overlay = "dark",
  badge,
  className,
}) {
  const isDark = overlay === "dark";

  return (
    <Link
      href={url}
      className={cn(
        "group/promo relative flex h-full min-h-[400px] flex-col overflow-hidden bg-[#001122] no-underline",
        "border border-[rgba(0,17,34,0.08)]",
        className
      )}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/promo:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay for text readability */}
        <div
          className={cn(
            "absolute inset-0",
            isDark
              ? "bg-gradient-to-t from-[rgba(0,17,34,0.85)] via-[rgba(0,17,34,0.4)] to-transparent"
              : "bg-gradient-to-t from-[rgba(255,255,255,0.9)] via-[rgba(255,255,255,0.5)] to-transparent"
          )}
        />
      </div>

      {/* Badge (optional - e.g., Trustpilot) */}
      {badge && (
        <div className="relative z-10 p-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium",
              isDark ? "bg-[#00b67a] text-white" : "bg-[#00b67a] text-white"
            )}
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {badge}
          </span>
        </div>
      )}

      {/* Content positioned at bottom */}
      <div className="relative z-10 mt-auto flex flex-col gap-4 p-5 min-[1440px]:p-6">
        <div className="space-y-2">
          <h3
            className={cn(
              "font-serif text-xl font-normal leading-tight min-[1440px]:text-2xl",
              isDark ? "text-white" : "text-[#001122]"
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-sm leading-relaxed min-[1440px]:text-[15px]",
              isDark ? "text-white/85" : "text-[#001122]/80"
            )}
          >
            {description}
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-1">
          <span
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium transition-all duration-200",
              isDark
                ? "text-white group-hover/promo:gap-3"
                : "text-[#001122] group-hover/promo:gap-3"
            )}
          >
            {buttonText}
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover/promo:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
