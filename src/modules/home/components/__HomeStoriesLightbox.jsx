"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const STORY_DURATION_MS = 4500;

const INK = "#001122";
const INK_20 = "rgba(0, 17, 34, 0.2)";
/** Name accent — design ~#E35235; keep vivid orange for brand continuity */
const NAME_ACCENT = "#E35235";

const PROFILE_AVATAR = "/figma/hp/hp-hero-c4c.png";

const HEADLINE =
  "Négociant en pierres de couleur, un métier inspirant fait de voyages authentiques";
const FOLLOW_LABEL = "Suivre @french_gemhunter";
const STORY_SLOT_ORDER = [
  ["1", "Top"],
  ["1", "Bottom"],
  ["2", "Top"],
  ["2", "Center"],
  ["2", "Bottom"],
  ["4", "Top"],
  ["4", "Center"],
  ["4", "Bottom"],
  ["5", "Top"],
  ["5", "Bottom"],
  ["3", "Bottom"],
];

/** Mobile masonry: middle column taller (Figma). Heights ≈px at ~390 logical width. */
const MOBILE_MASONRY_SHORT = ["aspect-[3/4]", "aspect-[3/4]", "aspect-[3/4]"];
const MOBILE_MASONRY_TALL = ["aspect-[9/16]", "aspect-[9/16]", "aspect-[9/16]"];

function plainText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mediaUrl(value) {
  return value?.node?.mediaItemUrl || value?.mediaItemUrl || value?.node?.sourceUrl || value?.sourceUrl || value || "";
}

function buildStoryItems(raw) {
  if (!raw || typeof raw !== "object") return [];
  return STORY_SLOT_ORDER
    .map(([column, position], index) => {
      const base = `storiesCol${column}${position}`;
      const src = mediaUrl(raw[`${base}Image`]);
      const videoSrc = mediaUrl(raw[`${base}Video`]);
      const caption = plainText(raw[`${base}ImageTitle`]);
      if (!src && !videoSrc && !caption) return null;
      return {
        id: `story-${index + 1}`,
        src,
        videoSrc,
        caption,
      };
    })
    .filter(Boolean);
}

export function HomeStoriesLightbox({ items }) {
  const storyItems = useMemo(() => buildStoryItems(items), [items]);
  const profileAvatar = mediaUrl(items?.storiesProfileImage) || PROFILE_AVATAR;
  const profileTitle = plainText(items?.storiesProfileTitle) || "Francois Deprez";
  const profileDescription = plainText(items?.storiesProfileDescription) || HEADLINE;
  const profileButtonTitle = plainText(items?.storiesProfileButtonTitle) || FOLLOW_LABEL;
  const profileButtonLink = String(items?.storiesProfileButtonLink || "").trim();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [progressPct, setProgressPct] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const rafRef = useRef(null);
  const startedAtRef = useRef(0);
  const progressBaseRef = useRef(0);
  const videoRef = useRef(null);

  const isOpen =
    storyItems.length > 0 && activeIndex >= 0 && activeIndex < storyItems.length;

  const stopLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const closeLightbox = () => {
    stopLoop();
    setActiveIndex(-1);
    setProgressPct(0);
    setIsPaused(false);
  };

  const goNext = () => {
    if (!storyItems.length) return;
    setActiveIndex((prev) => (prev + 1) % storyItems.length);
    setProgressPct(0);
    progressBaseRef.current = 0;
    startedAtRef.current = performance.now();
  };

  const goPrev = () => {
    if (!storyItems.length) return;
    setActiveIndex((prev) => (prev - 1 + storyItems.length) % storyItems.length);
    setProgressPct(0);
    progressBaseRef.current = 0;
    startedAtRef.current = performance.now();
  };

  const openAtIndex = (index) => {
    if (index < 0 || index >= storyItems.length) return;
    setActiveIndex(index);
    setIsPaused(false);
    setProgressPct(0);
    setVideoError(false);
    progressBaseRef.current = 0;
    startedAtRef.current = performance.now();
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === " ") {
        event.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isPaused) return;
    progressBaseRef.current = progressPct;
    startedAtRef.current = performance.now();
  }, [isPaused, progressPct]);

  const activeItem = isOpen ? storyItems[activeIndex] : null;
  const hasVideo = Boolean(activeItem?.videoSrc) && !videoError;

  useEffect(() => {
    if (!activeItem?.videoSrc) return;
    setVideoError(false);
  }, [activeItem?.id, activeItem?.videoSrc]);

  useEffect(() => {
    if (!isOpen || !hasVideo || !videoRef.current) return;
    const videoEl = videoRef.current;
    videoEl.muted = isMuted;
  }, [hasVideo, isMuted, isOpen]);

  useEffect(() => {
    if (!isOpen || !hasVideo || !videoRef.current) return;
    const videoEl = videoRef.current;
    if (isPaused) {
      videoEl.pause();
      return;
    }
    const playPromise = videoEl.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay can fail in some browsers, keep controls active.
      });
    }
  }, [hasVideo, isOpen, isPaused, activeIndex]);

  useEffect(() => {
    if (hasVideo) return undefined;
    stopLoop();
    if (!isOpen || isPaused) return undefined;

    if (!startedAtRef.current) {
      startedAtRef.current = performance.now();
    }

    const step = (now) => {
      const elapsed = now - startedAtRef.current;
      const pct = Math.min(100, progressBaseRef.current + (elapsed / STORY_DURATION_MS) * 100);

      if (pct >= 100) {
        goNext();
        return;
      }

      setProgressPct(pct);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return stopLoop;
  }, [activeIndex, hasVideo, isOpen, isPaused]);

  if (!storyItems.length) return null;

  const col1 = storyItems.slice(0, 2);
  const col2 = storyItems.slice(2, 5);
  const col4 = storyItems.slice(5, 8);
  const col5 = storyItems.slice(8, 10);
  const centerBottom = storyItems[10] || null;

  const mobileHero =
    storyItems.find((s) => s.id === "story-2") ||
    storyItems.find((s) => /gem dealer/i.test(String(s.caption || ""))) ||
    storyItems[0] ||
    null;
  const mobileMasonryItems = storyItems.filter((s) => s.id !== mobileHero?.id).slice(0, 9);

  const renderCard = (item, index, sizeClass, { variant = "default" } = {}) => (
    <button
      key={`${item.id}-${variant}`}
      type="button"
      className={` group relative overflow-hidden text-left shadow-none ring-0 ${sizeClass} cursor-pointer`}
      onClick={() => openAtIndex(index)}
      aria-label={`Ouvrir la story: ${item.caption}`}
    >
      <img src={item.src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]
          h-[45%]
          bg-gradient-to-t from-black/75 via-black/25 to-transparent
          transition-opacity duration-300
          group-hover:from-black/85"
        aria-hidden
      />
      <span
        className="absolute left-2.5 top-2.5 z-[2]
          flex h-8 w-8 items-center justify-center
          rounded-full bg-white/35 text-[11px] text-white
          backdrop-blur-[2px]
          transition-all duration-300
          group-hover:bg-white group-hover:text-[#001122]
          min-[1024px]:hidden"
        aria-hidden
      >
        ▶
      </span>
      <p className="absolute bottom-0 left-0 right-0 z-[2]
          p-2.5 text-left text-xs font-normal leading-snug text-white
          transition-transform duration-300
          group-hover:translate-y-[-2px]

          min-[1024px]:text-sm min-[1024px]:leading-[1.428]">
        {item.caption}
      </p>
    </button>
  );

  return (
    <>
      <div className="w-full bg-[#FDF8F3] py-8 min-[1024px]:bg-[#FCF9F5] min-[1024px]:py-10">
        {/* Mobile — Figma: hero → profil → grille 3 col (centre plus haut) */}
        <div className="mx-auto flex w-full max-w-full flex-col items-stretch pb-2 min-[1024px]:hidden">
          {mobileHero ? (
            <div className="w-full text-center">
              {renderCard(
                mobileHero,
                storyItems.findIndex((x) => x.id === mobileHero.id),
                "aspect-[3/4] w-full max-w-[360px] mx-auto min-h-[280px] max-[480px]:aspect-auto max-[480px]:h-[240px] max-[480px]:w-[135px]",
                { variant: "hero" },
              )}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col items-center px-1 text-center">
            <img
              src={profileAvatar}
              alt={profileTitle}
              className="h-14 w-14 rounded-full object-cover ring-1 ring-black/5"
            />
            <p
              className="mt-3 text-xs font-semibold uppercase leading-[1.35] tracking-[0.06em]"
              style={{ color: NAME_ACCENT }}
            >
             {profileTitle}
            </p>
            <p className="mt-4 max-w-[340px] font-serif text-[26px] font-normal leading-[1.12] text-[#061A2F]">
              {profileDescription}
            </p>
            {/* <button
              type="button"
              className="mt-6 inline-flex h-11 w-full max-w-[320px] items-center justify-center gap-3 rounded border bg-white px-4 text-sm font-semibold leading-[1.428] shadow-sm cursor-pointer transition-colors hover:bg-[#fafafa]"
              style={{ borderColor: INK_20, color: INK }}
              onClick={onProfileButtonClick}
            >
              {profileButtonTitle}
              <span aria-hidden className="text-base">
                →
              </span>
            </button> */}

            <Link
              href={items?.storiesProfileButtonLink}
              className="mt-6 inline-flex h-11 w-full max-w-[320px] items-center justify-center gap-3 rounded border bg-white px-4 text-sm font-semibold leading-[1.428] shadow-sm cursor-pointer transition-colors hover:bg-[#fafafa]"
              style={{ borderColor: INK_20, color: INK }}
            >
              {items?.storiesProfileButtonTitle}
              <span aria-hidden className="text-base">
                →
              </span>
            </Link>
          </div>

          <div className="mt-8 grid w-full gap-[23px] grid-cols-[minmax(0,180fr)_minmax(0,280fr)_minmax(0,180fr)]">
            {[0, 1, 2].map((colIdx) => (
              <div
                key={colIdx}
                className={`flex min-w-0 flex-1 flex-col justify-between gap-[20px] ${
                  colIdx === 0 || colIdx === 2 ? "py-[90px]" : ""
                }`}
              >
                {[0, 1, 2].map((rowIdx) => {
                  const itemIdx = colIdx + rowIdx * 3;
                  const item = mobileMasonryItems[itemIdx];
                  if (!item) return null;
                  const tall = colIdx === 1;
                  const hClass = tall ? MOBILE_MASONRY_TALL[rowIdx] : MOBILE_MASONRY_SHORT[rowIdx];
                  return (
                    <div key={item.id} className={`${hClass} w-full shrink-0`}>
                      {renderCard(
                        item,
                        storyItems.findIndex((x) => x.id === item.id),
                        "h-full min-h-0 w-full",
                        { variant: `m-${colIdx}-${rowIdx}` },
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop — 5 colonnes, gouttière ~20px, bloc central */}
        <div className="mx-auto hidden w-full max-w-[1440px] grid-cols-[minmax(0,280fr)_minmax(0,180fr)_minmax(0,280fr)_minmax(0,180fr)_minmax(0,280fr)] gap-5 min-[1024px]:grid min-[1200px]:gap-5">
          <div className="flex flex-col justify-between gap-5 py-[30px]">
            {col1.map((item) =>
              renderCard(item, storyItems.findIndex((x) => x.id === item.id), "aspect-[9/16] w-full"),
            )}
          </div>

          <div className="flex flex-col justify-between gap-5">
            {col2.map((item) =>
              renderCard(item, storyItems.findIndex((x) => x.id === item.id), "aspect-[9/16] w-full"),
            )}
          </div>

          <div className="flex min-h-[min(100vh-120px,860px)] flex-col justify-between gap-6">
            <div className="flex flex-col items-center justify-center h-full gap-5 px-2 pt-4 text-center min-[1200px]:gap-6 min-[1200px]:pt-6">
              <img
                src={profileAvatar}
                alt={profileTitle}
                className="h-12 w-12 rounded-full object-cover ring-1 ring-black/5 min-[1200px]:h-14 min-[1200px]:w-14"
              />
              <p
                className="text-xs font-semibold uppercase leading-[1.35] tracking-[0.08em] min-[1200px]:text-sm"
                style={{ color: NAME_ACCENT }}
              >
                {profileTitle}
              </p>
              <p className="max-w-[400px] font-serif text-[24px] font-normal leading-[1.12] text-[#001122] min-[1200px]:max-w-[420px] min-[1200px]:text-[28px] min-[1200px]:leading-[1.1]">
                {profileDescription}
              </p>
              {/* <button
                type="button"
                className="inline-flex h-10 w-full items-center justify-center gap-3
                  rounded border bg-white px-6
                  text-sm font-semibold leading-[1.428] text-[#001122]
                  shadow-sm cursor-pointer

                  transition-all duration-300

                  hover:bg-[#001122]
                  hover:text-white
                  hover:border-[#001122]

                  min-[1200px]:min-w-[290px]"
                style={{ borderColor: INK_20 }}
                onClick={onProfileButtonClick}
              >
                {profileButtonTitle}
                <span aria-hidden className="text-base">
                  →
                </span>
              </button> */}
              
              <Link
                href={items?.storiesProfileButtonLink}
                className="inline-flex h-10 w-full items-center shadow-sm cursor-pointer transition-all duration-300 hover:bg-[#001122] hover:text-white hover:border-[#001122] min-[1200px]:min-w-[290px] justify-center gap-3 rounded border bg-white px-6 text-sm font-semibold leading-[1.428] text-[#001122]"
                style={{ borderColor: INK_20 }}
                >
                  {items?.storiesProfileButtonTitle}
                  <span aria-hidden className="text-base">
                    →</span>
                </Link>

            </div>
            {centerBottom
              ? renderCard(
                  centerBottom,
                  storyItems.findIndex((x) => x.id === centerBottom.id),
                  "mx-auto aspect-[9/16] w-full max-w-[280px] min-[1200px]:max-w-none -mb-[60px]",
                  { variant: "center" },
                )
              : null}
          </div>

          <div className="flex flex-col justify-between gap-5">
            {col4.map((item) =>
              renderCard(item, storyItems.findIndex((x) => x.id === item.id), "aspect-[9/16] w-full"),
            )}
          </div>

          <div className="flex flex-col justify-between gap-5 py-[30px]">
            {col5.map((item) =>
              renderCard(item, storyItems.findIndex((x) => x.id === item.id), "aspect-[9/16] w-full"),
            )}
          </div>
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-[#001122]/60 backdrop-blur-sm"
            onClick={closeLightbox}
            aria-label="Fermer le lightbox"
          />

          <div className="relative flex items-center justify-center w-[min(75vw,340px)] min-[1440px]:w-[320px] px-4 mx-auto h-full">
            <div className="relative h-[70vh] w-[min(75vw,340px)] overflow-hidden min-[1440px]:h-[720px] min-[1440px]:w-[320px]">
              {hasVideo ? (
                <video
                  key={activeItem.id}
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  src={activeItem.videoSrc}
                  poster={activeItem.src}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  onError={() => setVideoError(true)}
                  onTimeUpdate={(event) => {
                    const { currentTime, duration } = event.currentTarget;
                    if (!duration || Number.isNaN(duration)) return;
                    setProgressPct(Math.min(100, (currentTime / duration) * 100));
                  }}
                  onEnded={goNext}
                />
              ) : (
                <img src={activeItem.src} alt={activeItem.caption} className="h-full w-full object-cover" loading="lazy" />
              )}

              <div className="absolute left-3 right-3 top-3 z-20 flex gap-1.5">
                {storyItems.map((item, index) => {
                  const barPct = index < activeIndex ? 100 : index === activeIndex ? progressPct : 0;
                  return (
                    <span key={item.id} className="relative h-0.5 flex-1 overflow-hidden bg-white/35">
                      <span className="absolute inset-y-0 left-0 bg-white" style={{ width: `${barPct}%` }} />
                    </span>
                  );
                })}
              </div>

              <div className="absolute right-3 top-7 z-20 flex flex-col gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#001122]/70 text-white cursor-pointer"
                  onClick={closeLightbox}
                  aria-label="Fermer"
                >
                  ×
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#001122]/70 text-white cursor-pointer"
                  onClick={() => {
                    setIsPaused((prev) => !prev);
                    if (videoRef.current) {
                      if (isPaused) {
                        videoRef.current.play().catch(() => {});
                      } else {
                        videoRef.current.pause();
                      }
                    }
                  }}
                  aria-label={isPaused ? "Reprendre" : "Pause"}
                >
                  {isPaused ? "▶" : "II"}
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#001122]/70 text-white cursor-pointer"
                  onClick={() => {
                    setIsMuted((prev) => !prev);
                    if (videoRef.current) {
                      videoRef.current.muted = !videoRef.current.muted;
                    }
                  }}
                  aria-label={isMuted ? "Activer le son" : "Couper le son"}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>

            </div>

            <button
              type="button"
              className="absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-[190px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#001122] shadow-sm transition-opacity hover:opacity-90 min-[1440px]:-translate-x-[205px]"
              onClick={goPrev}
              aria-label="Story precedente"
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M12.7072 6.35351L0.707154 6.35352M0.707154 6.35352L6.70715 12.3535M0.707154 6.35352L6.70715 0.353515" stroke="#001122" strokeMiterlimit="10"/>
            </svg>
              </button>

            <button
              type="button"
              className="absolute left-1/2 top-1/2 z-10 flex h-8 w-8 translate-x-[190px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#001122] shadow-sm transition-opacity hover:opacity-90 min-[1440px]:translate-x-[205px]"
              onClick={goNext}
              aria-label="Story suivante"
            >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="#001122" strokeMiterlimit="10"/>
          </svg>            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
