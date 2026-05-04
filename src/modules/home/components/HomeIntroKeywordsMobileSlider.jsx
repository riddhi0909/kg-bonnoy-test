"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

function WhiteArrowLink({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-[15px] text-sm font-semibold leading-[1.428] text-white transition-opacity hover:opacity-90 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
    >
      {children}
      <Image src="/figma/arrow-link-white.svg" alt="" width={13} height={13} sizes="13px" className="h-[13px] w-[13px] shrink-0" loading="lazy" aria-hidden />
    </Link>
  );
}

function ChevronNav({ dir, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-35 hover:opacity-90"
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
 * Mobile-only intro keyword “slider”: one slide + progress bar + prev/next.
 * @param {{ rows: { title: string; link: string; href: string }[]; className?: string }} props
 */
export function HomeIntroKeywordsMobileSlider({ rows, className = "" }) {
  const n = rows?.length ?? 0;
  const [index, setIndex] = useState(0);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % n);
  }, [n]);

  if (n === 0) return null;

  const row = rows[index];
  const progressPct = n <= 1 ? 100 : ((index + 1) / n) * 100;

  return (
    <div
      className={`flex min-[768px]:hidden flex-col ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Accueil — points forts"
    >
      <div className="flex min-h-[140px] min-w-0 w-full flex-col items-center justify-center gap-6 px-2">
        <p className="max-w-[min(100%,320px)] whitespace-pre-line break-words text-center font-serif text-[21px] font-normal uppercase leading-[1.19] text-white">
          {row.title}
        </p>
        <WhiteArrowLink href={row.href}>{row.link}</WhiteArrowLink>
      </div>

      <div className="flex items-center gap-3 px-1">
        <div className="relative h-px min-h-px flex-1 bg-white/25" aria-hidden>
          <div
            className="absolute left-0 top-0 h-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex shrink-0 items-center gap-0">
          <ChevronNav dir="prev" label="Slide précédent" onClick={goPrev} disabled={n <= 1} />
          <ChevronNav dir="next" label="Slide suivant" onClick={goNext} disabled={n <= 1} />
        </div>
      </div>
    </div>
  );
}
