"use client";

import Link from "next/link";
import { homePath } from "@/constants/routes";

/**
 * @param {{
 *   locale: string;
 *   currentLabel: string;
 *   rating?: number;
 *   parentCrumb?: { label: string; href: string };
 * }} props
 */
export function CategoryBreadcrumbs({ locale, currentLabel, rating = 5, parentCrumb }) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const label = (currentLabel ?? "").trim() || "Catégories";
  const mid = parentCrumb?.href && (parentCrumb?.label ?? "").trim()
    ? { href: parentCrumb.href, label: parentCrumb.label.trim() }
    : null;

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <div className="px-4 pb-[15px] pt-[30px] min-[1440px]:px-[60px] min-[768px]:pb-[30px] min-[768px]:pt-[50px]">
        <div className="flex w-full items-center justify-between gap-5 max-[768px]:flex-col max-[768px]:gap-[15px]">
          <nav
            aria-label="Fil d'ariane"
            className="min-w-0 text-[12px] leading-[2] text-[rgba(0,17,34,0.50)] max-[768px]:text-center"
          >
            <Link href={homePath(locale)} className="hover:text-[rgba(0,17,34,1)]">
              Accueil
            </Link>
            <span className="px-2">›</span>
            {mid ? (
              <>
                <Link href={mid.href} className="hover:text-[rgba(0,17,34,1)]">
                  {mid.label}
                </Link>
                <span className="px-2">›</span>
              </>
            ) : null}
            <span className="text-[rgba(0,17,34,1)]">{label}</span>
          </nav>
          <div className="flex shrink-0 items-center gap-2 text-[14px] leading-[1.6] font-semibold text-[#001122]">
            <div className="flex items-center gap-[2px]">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                key={i}
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill={i < safeRating ? "#001122" : "#00112233"}
                aria-hidden="true"
                >
                <path d="M6 0l1.76 3.57L12 4.3 9.18 7.13 9.88 12 6 9.9 2.12 12l.7-4.87L0 4.3l4.24-.73L6 0z"></path>
                </svg>
            ))}
            </div>
            <span>{safeRating} / 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}