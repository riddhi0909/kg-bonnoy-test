"use client";

import Link from "next/link";

/**
 * Figma PLP promo tile (4 fixed slots in the 4×4 grid).
 * @param {{
 *   title: string;
 *   imageUrl: string;
 *   videoUrl?: string;
 *   href: string;
 *   ctaLabel: string;
 *   imageAlt?: string;
 *   layout?: "top" | "bottom";
 *   eyebrow?: string;
 *   eyebrowSubtext?: string;
 * }} props
 */
export function PlpFeatureCard({
  title,
  imageUrl,
  videoUrl = "",
  href,
  ctaLabel,
  imageAlt = "",
  layout = "bottom",
  eyebrow = "",
  eyebrowSubtext = "",
}) {
  const desktopIsTop = layout === "top";
  const eyebrowParts = String(eyebrow || "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  const hasRatingMeta = eyebrowParts.length === 3;
  const videoSrc = String(videoUrl || "").trim();

  return (
    <article className="h-[250px] min-[1024px]:h-full overflow-hidden border border-[rgba(0,17,34,0.2)] bg-[#f5eee5] transition-[border-color,box-shadow] duration-200">
      <Link href={href} className="group relative block h-[250px] min-[1024px]:h-full w-full overflow-hidden bg-[#ECEBE8]">
        {videoSrc ? (
              <div className="absolute inset-0 overflow-hidden">
                <video
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  title={title || "Category feature video"}
                  className="pointer-events-none h-full w-full object-cover"
                />
              </div>
            ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="h-full max-[1024px]:h-[320px] w-full object-cover transition duration-300 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[rgba(0,17,34,0.45)]">Bonnot</div>
        )}
        <div
          className={
            desktopIsTop
              ? "pointer-events-none absolute inset-0 flex h-full flex-col justify-between bg-[linear-gradient(180deg,rgba(0,17,34,0.78)_0%,rgba(0,17,34,0.35)_45%,rgba(0,17,34,0.88)_100%)] min-[1024px]:bg-[linear-gradient(180deg,rgba(0,17,34,0.9)_0%,rgba(0,17,34,0)_50%)]"
              : "pointer-events-none absolute inset-0 flex h-full flex-col justify-between bg-[linear-gradient(180deg,rgba(0,17,34,0.78)_0%,rgba(0,17,34,0.35)_45%,rgba(0,17,34,0.88)_100%)] min-[1024px]:justify-end min-[1024px]:bg-[linear-gradient(180deg,rgba(0,17,34,0)_50%,rgba(0,17,34,0.9)_100%)]"
          }
        >
          <div
            className={
              desktopIsTop
                ? "px-3 pb-0 pt-3 min-[1024px]:pb-10 min-[1024px]:pt-3 min-[1440px]:px-4 min-[1440px]:pb-12 min-[1440px]:pt-4"
                : "px-3 pb-0 pt-3 min-[1024px]:pb-3 min-[1024px]:pt-16 min-[1440px]:px-4 min-[1440px]:pb-4 min-[1440px]:pt-20"
            }
          >
            {hasRatingMeta ? (
              <div className="mb-1 flex justify-between items-center gap-2 text-[12px] leading-tight text-[#fffaf5] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                <span className="text-[40px] font-light leading-none tracking-[-0.02em] [font-family:var(--font-bonnot-serif)]">{eyebrowParts[0]}</span>
                <span className="inline-flex items-center gap-[15px]">
                  <span className="relative top-[1px] text-[14px] tracking-[0.16em] text-[#fffaf5]">
                    {eyebrowParts[1]}
                  </span>
                  <span className="text-[14px] font-medium leading-none">{eyebrowParts[2]}</span>
                </span>
              </div>
            ) : eyebrow ? (
              <p className="mb-1 text-[14px] leading-tight text-[#ffffff] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                {eyebrow}
              </p>
            ) : null}
            <p
              className="max-w-[94%] pt-[10px] font-serif text-[17px] leading-[1.15] text-[#fffaf5] min-[1440px]:text-[21px]"
            >
              {title}
            </p>
            {eyebrowSubtext ? (
              <p
                className="mt-1 pt-[10px] text-[14px] leading-tight text-[#ffffff]/75 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
              >
                {eyebrowSubtext}
              </p>
            ) : null}
          </div>
          <div className="pointer-events-none p-3 min-[1440px]:p-4 pt-[10px]">
            <div className="group bg-[#001122] px-4 py-2.5 text-center min-[1440px]:py-2 transition-all duration-300 hover:bg-[#000b1a]">
              <span className="inline-flex gap-3 items-center justify-center text-[14px] font-semibold leading-tight text-[#ffffff] transition-all duration-300 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                {ctaLabel}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"></path>
                  </svg>
                </span>
              </span>
            </div>
          </div>
        </div>

       
      </Link>
    </article>
  );
}
