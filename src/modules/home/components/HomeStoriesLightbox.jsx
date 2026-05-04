"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { StoriesLightbox } from "./StoriesLightbox";

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

/** Mobile masonry: all cells use story aspect ratio (9/16). */
const MOBILE_MASONRY_ASPECT = "aspect-[9/16]";

function plainText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mediaUrl(value) {
  return (
    value?.node?.mediaItemUrl ||
    value?.mediaItemUrl ||
    value?.node?.sourceUrl ||
    value?.sourceUrl ||
    value ||
    ""
  );
}

function normalizeMimeType(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function buildStoryItems(raw) {
  if (!raw || typeof raw !== "object") return [];
  return STORY_SLOT_ORDER.map(([column, position], index) => {
    const base = `storiesCol${column}${position}`;
    const src = mediaUrl(raw[`${base}Image`]);
    const videoSrc = mediaUrl(raw[`${base}Video`]);
    const videoMimeType = normalizeMimeType(raw[`${base}VideoMimeType`]);
    const caption = plainText(raw[`${base}ImageTitle`]);
    if (!src && !videoSrc && !caption) return null;
    const hasVideoMime = videoMimeType.startsWith("video/");
    const hasImageMime = videoMimeType.startsWith("image/");
    const displaySrc = hasImageMime ? videoSrc || src : src || videoSrc;
    return {
      id: `story-${index + 1}`,
      src,
      videoSrc,
      videoMimeType,
      displaySrc,
      shouldRenderVideo: hasVideoMime && Boolean(videoSrc),
      caption,
    };
  }).filter(Boolean);
}

export function HomeStoriesLightbox({ items }) {
  const storyItems = useMemo(() => buildStoryItems(items), [items]);
  const profileAvatar = mediaUrl(items?.storiesProfileImage) || PROFILE_AVATAR;
  const profileTitle =
    plainText(items?.storiesProfileTitle) || "Francois Deprez";
  const profileDescription =
    plainText(items?.storiesProfileDescription) || HEADLINE;
  const profileButtonTitle =
    plainText(items?.storiesProfileButtonTitle) || FOLLOW_LABEL;
  const profileButtonLink = String(
    items?.storiesProfileButtonLink || "",
  ).trim();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [progressPct, setProgressPct] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const rafRef = useRef(null);
  const startedAtRef = useRef(0);
  const progressBaseRef = useRef(0);
  const videoRef = useRef(null);
  const wasPausedRef = useRef(false);

  const isOpen =
    storyItems.length > 0 &&
    activeIndex >= 0 &&
    activeIndex < storyItems.length;

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
    setActiveIndex(
      (prev) => (prev - 1 + storyItems.length) % storyItems.length,
    );
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

  const activeItem = isOpen ? storyItems[activeIndex] : null;
  const hasVideo = Boolean(activeItem?.shouldRenderVideo) && !videoError;

  useEffect(() => {
    if (!isOpen || hasVideo) {
      wasPausedRef.current = isPaused;
      return;
    }
    if (isPaused && !wasPausedRef.current) {
      // Freeze progress when pause is first triggered.
      progressBaseRef.current = progressPct;
      startedAtRef.current = performance.now();
    }
    if (!isPaused && wasPausedRef.current) {
      // Resume from the same point without counting paused time.
      startedAtRef.current = performance.now();
    }
    wasPausedRef.current = isPaused;
  }, [hasVideo, isOpen, isPaused, progressPct]);

  useEffect(() => {
    if (!activeItem?.shouldRenderVideo || !activeItem?.videoSrc) return;
    setVideoError(false);
  }, [activeItem?.id, activeItem?.shouldRenderVideo, activeItem?.videoSrc]);

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
      const pct = Math.min(
        100,
        progressBaseRef.current + (elapsed / STORY_DURATION_MS) * 100,
      );

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
  const mobileMasonryItems = storyItems
    .filter((s) => s.id !== mobileHero?.id)
    .slice(0, 9);

  const renderCard = (item, index, sizeClass, { variant = "default" } = {}) => (
    <button
      key={`${item.id}-${variant}`}
      type="button"
      className={` group relative overflow-hidden text-left shadow-none ring-0 ${sizeClass} cursor-pointer`}
      onClick={() => openAtIndex(index)}
      aria-label={`Ouvrir la story: ${item.caption}`}
    >
      {item.shouldRenderVideo && item.videoSrc ? (
        <video
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={item.videoSrc}
          poster={item.displaySrc || item.src}
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay
        />
      ) : (
        <img
          src={item.displaySrc || item.src}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      )}
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
      <p
        className="absolute bottom-0 left-0 right-0 z-[2]
          p-2.5 text-left text-[11px] font-normal leading-snug text-white
          transition-transform duration-300
          group-hover:translate-y-[-2px]

          min-[1024px]:text-sm min-[1024px]:leading-[1.428] min-[1024px]:max-w-[180px]"
      >
        {item.caption}
      </p>
    </button>
  );

  const togglePause = () => {
    setIsPaused((prev) => {
      const nextPaused = !prev;
      if (videoRef.current) {
        if (nextPaused) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => {});
        }
      }
      return nextPaused;
    });
  };

  return (
    <>
      <div className="w-full bg-[#FDF8F3] min-[1024px]:bg-[#FCF9F5] pb-[160px] max-[1024px]:pb-0">
        {/* Mobile — Figma: hero → profil → grille 3 col (centre plus haut) */}
        <div className="mx-auto flex w-full max-w-full flex-col items-stretch pb-2 min-[1024px]:hidden max-[768px]:pb-0">
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

          <div className="mt-8 max-[768px]:mt-[60px] flex flex-col items-center px-1 text-center">
            <img
              src={profileAvatar}
              alt={profileTitle}
              className="h-14 w-14 rounded-full object-cover ring-1 ring-black/5"
            />
            <p
              className="mt-3 max-[1024px]:mt-[30px] text-xs max-[768px]:text-[14px] font-semibold uppercase leading-[1.35] tracking-[0.06em]"
              style={{ color: NAME_ACCENT }}
            >
              {profileTitle}
            </p>
            <p className="mt-4 max-[1024px]:mt-[30px] max-w-[340px] font-serif text-[26px] max-[768px]:text-[21px] font-normal leading-[1.12] text-[#061A2F]">
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
              className="mt-6 max-[1024px]:mt-[30px] inline-flex h-10 w-full max-w-[320px] items-center justify-center gap-3 rounded border px-4 text-sm font-semibold leading-[1.428] cursor-pointer transition-colors hover:bg-[#fafafa]"
              style={{ borderColor: INK_20, color: INK }}
            >
              {items?.storiesProfileButtonTitle}
              <svg className="shrink-0 transition-transform duration-300 hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeOpacity="0.85" strokeMiterlimit="10"></path></svg>
            </Link>
          </div>

          <div className="mt-8 grid w-full gap-[23px] grid-cols-[minmax(0,180fr)_minmax(0,280fr)_minmax(0,180fr)] max-[1024px]:mt-[60px]">
            {[0, 1, 2].map((colIdx) => (
              <div
                key={colIdx}
                className={`flex min-w-0 flex-1 flex-col justify-center  ${
                  colIdx === 0 || colIdx === 2 ? "gap-[60px]" : "gap-[30px]"
                }`}
              >
                {[0, 1, 2].map((rowIdx) => {
                  const itemIdx = colIdx + rowIdx * 3;
                  const item = mobileMasonryItems[itemIdx];
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      className={`${MOBILE_MASONRY_ASPECT} w-full shrink-0`}
                    >
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
        <div className="mx-auto hidden w-full max-w-[1440px] grid-cols-[minmax(0,270fr)_minmax(0,180fr)_minmax(0,270fr)_minmax(0,180fr)_minmax(0,270fr)] gap-5 min-[1024px]:grid min-[1200px]:gap-[60px]">
          <div className="flex flex-col justify-between gap-[60px] py-[30px]">
            {col1.map((item) =>
              renderCard(
                item,
                storyItems.findIndex((x) => x.id === item.id),
                "aspect-[9/16] w-full",
              ),
            )}
          </div>

          <div className="flex flex-col justify-between gap-[60px]">
            {col2.map((item) =>
              renderCard(
                item,
                storyItems.findIndex((x) => x.id === item.id),
                "aspect-[9/16] w-full",
              ),
            )}
          </div>

          <div className="flex flex-col justify-between gap-[60px]">
            <div className="flex flex-col items-center justify-center gap-5 pt-4 text-center min-[1200px]:gap-[30px] min-[1200px]:pt-6 my-auto">
              <img
                src={profileAvatar}
                alt={profileTitle}
                className="h-12 w-12 rounded-full object-cover ring-1 ring-black/5 min-[1200px]:h-[60px] min-[1200px]:w-[60px]"
              />
              <p
                className="text-xs font-semibold uppercase leading-[1.35] tracking-[0.08em] min-[1200px]:text-sm"
                style={{ color: NAME_ACCENT }}
              >
                {profileTitle}
              </p>
              <p className="max-w-[400px] font-serif text-[24px] font-normal leading-[1.12] text-[#001122] min-[1200px]:max-w-[420px] min-[1200px]:text-[28px] min-[1200px]:leading-[1.4]">
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
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 w-full items-center cursor-pointer transition-all duration-300 hover:bg-[#001122] hover:text-white hover:border-[#001122] justify-center gap-3 border px-6 text-sm font-semibold leading-[1.428] text-[#001122]"
                style={{ borderColor: INK_20 }}
              >
                {items?.storiesProfileButtonTitle}
                <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeOpacity="0.85" strokeMiterlimit="10"></path></svg>
              </Link>
            </div>  
            {centerBottom
              ? renderCard(
                  centerBottom,
                  storyItems.findIndex((x) => x.id === centerBottom.id),
                  "mx-auto aspect-[9/16] w-full max-w-[280px] min-[1200px]:max-w-none -mb-[160px]",
                  { variant: "center" },
                )
              : null}
          </div>

          <div className="flex flex-col justify-between gap-[60px]">
            {col4.map((item) =>
              renderCard(
                item,
                storyItems.findIndex((x) => x.id === item.id),
                "aspect-[9/16] w-full",
              ),
            )}
          </div>

          <div className="flex flex-col justify-between gap-[60px] py-[30px]">
            {col5.map((item) =>
              renderCard(
                item,
                storyItems.findIndex((x) => x.id === item.id),
                "aspect-[9/16] w-full",
              ),
            )}
          </div>
        </div>
      </div>

      <StoriesLightbox
        isOpen={isOpen}
        activeItem={activeItem}
        storyItems={storyItems}
        activeIndex={activeIndex}
        progressPct={progressPct}
        profileAvatar={profileAvatar}
        profileTitle={profileTitle}
        isMuted={isMuted}
        isPaused={isPaused}
        videoRef={videoRef}
        closeLightbox={closeLightbox}
        goPrev={goPrev}
        goNext={goNext}
        togglePause={togglePause}
        setIsMuted={setIsMuted}
        setVideoError={setVideoError}
        setProgressPct={setProgressPct}
      />
    </>
  );
}
