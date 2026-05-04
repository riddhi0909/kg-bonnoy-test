"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

/**
 * Inset image centered inside the card (Figma): md+ uses hover + click toggle;
 * below md, tap toggles the same inset in-place (no full-screen lightbox).
 */
export function PortfolioRevealCard({
  backgroundSrc,
  insetSrc,
  achivementTitle,
  achivementLink,
  achivementLinkText,
  achivementHoverTitle,
  achivementHoverLink,
  achivementHoverLinkText,
  /** If true, title + subheading stay the same on image hover (no second label layer). */
  staticFooterOnHover = false,
  /** Read by `RealisationsPortfolioTrack` for odd desktop slide count; not rendered. */
  desktopOnly = false,
  bottomInsetShadow,
}) {
  // desktopOnly: only used by parent track via child.props
  const [clickOpen, setClickOpen] = useState(false);
  const [suppressHover, setSuppressHover] = useState(false);

  const toggle = useCallback(() => {
    setClickOpen((open) => {
      if (open) {
        setSuppressHover(true);
        return false;
      }
      setSuppressHover(false);
      return true;
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    setSuppressHover(false);
    setClickOpen(false);
  }, []);

  const insetOpacityClass = clickOpen
    ? "opacity-100 md:group-hover:opacity-100"
    : suppressHover
      ? "opacity-0 md:group-hover:opacity-100"
      : "opacity-0 md:group-hover:opacity-100";
  const showHoverTextOnMobile = clickOpen;
  const defaultTitle = achivementTitle || "";
  const defaultSubTitle = achivementLinkText || "";
  const defaultLink = achivementLink || "#";
  const hoverTitle = achivementHoverTitle || defaultTitle;
  const hoverSubTitle = achivementHoverLinkText || defaultSubTitle;
  const hoverLink = achivementHoverLink || achivementLink || "#";
  const hasHoverMeta =
    !staticFooterOnHover &&
    Boolean(achivementHoverTitle || achivementHoverLinkText || achivementHoverLink) &&
    (hoverTitle !== defaultTitle || hoverSubTitle !== defaultSubTitle || hoverLink !== defaultLink);

  return (
    <article
      className="group relative h-[min(62vh,560px)] min-h-[420px] w-full overflow-hidden touch-manipulation md:h-full md:min-h-0"
      onMouseLeave={onMouseLeave}
    >
      <Image
        src={backgroundSrc}
        alt=""
        fill
        sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 720px"
        draggable={false}
        className="z-0 select-none object-cover"
        loading="lazy"
      />

      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 z-10 block h-[360px] w-[240px] max-md:min-[420px]:h-[360px] max-md:min-[420px]:w-[240px] min-[550px]:h-[min(82vw,520px)] min-[550px]:w-[min(70vw,340px)] min-[600px]:h-[min(78vw,470px)] min-[600px]:w-[min(66vw,310px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-opacity duration-500 md:h-[clamp(410px,48vw,440px)] md:w-[clamp(300px,36vw,330px)] min-[1440px]:h-[440px] min-[1440px]:w-[330px] ${insetOpacityClass}`}
      >
        <Image
          src={insetSrc}
          alt=""
          fill
          sizes="(max-width: 549px) 240px, (max-width: 1439px) 330px, 330px"
          draggable={false}
          className="pointer-events-none select-none object-cover"
          loading="lazy"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[15]"
        style={{ boxShadow: bottomInsetShadow }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-0 min-[1440px]:px-[15px] min-[1440px]:pb-[30px] min-[1440px]:pt-0">
        <div
          className={
            staticFooterOnHover
              ? "opacity-100"
              : `${showHoverTextOnMobile ? "opacity-0" : "opacity-100"} transition-opacity md:group-hover:opacity-0`
          }
        >
          <p className="font-serif text-[21px] font-normal leading-[1.19] text-white max-md:min-[420px]:text-[17px] pb-[5px]">
            {defaultTitle}
          </p>
          <a
            href={defaultLink}
            className="mt-1 text-sm font-normal leading-[1.428] text-white/75 hover:text-white"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {defaultSubTitle}
          </a>
        </div>
        {hasHoverMeta ? (
          <div className={`absolute inset-x-4 bottom-4 min-[1440px]:inset-x-[15px] min-[1440px]:bottom-[30px] ${showHoverTextOnMobile ? "opacity-100" : "opacity-0"} transition-opacity md:group-hover:opacity-100`}>
            <p className="font-serif text-[21px] font-normal leading-[1.19] text-white max-md:min-[420px]:text-[17px] pb-[5px]">
              {hoverTitle}
            </p>
            <a
              href={hoverLink}
              className="mt-1 text-sm font-normal leading-[1.428] text-white/75 hover:text-white"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {hoverSubTitle}
            </a>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className="absolute inset-0 z-[25] m-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001122]"
        onClick={toggle}
        aria-label={`${achivementTitle}. ${clickOpen ? "Masquer" : "Afficher"} la photo détaillée.`}
        aria-expanded={clickOpen}
      />
    </article>
  );
}
