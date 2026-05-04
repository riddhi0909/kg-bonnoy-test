"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StoriesLightbox } from "@/modules/home/components/StoriesLightbox";
import Image from "next/image";

const INK_20 = "rgba(0,17,34,0.2)";
const STORY_DURATION_MS = 4500;

/** Same visual order as HomeStoriesLightbox */
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
  return String(value || "").trim().toLowerCase();
}

function isLikelyVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /\.(mp4|webm|ogg|ogv|mov|m4v|mkv)(\?|#|$)/i.test(url.trim());
}

function resolveShouldRenderVideo(videoEdge, videoSrc) {
  if (!videoSrc) return false;
  const mime = normalizeMimeType(videoEdge?.node?.mimeType ?? videoEdge?.mimeType);
  if (mime.startsWith("video/")) return true;
  if (mime.startsWith("image/") || mime.startsWith("audio/")) return false;
  const wpMediaType = String(videoEdge?.node?.mediaType || "")
    .trim()
    .toLowerCase();
  if (wpMediaType === "video") return true;
  return isLikelyVideoUrl(videoSrc);
}

/**
 * @param {Record<string, unknown> | null | undefined} raw
 * @param {"stories" | "secondStories"} prefix
 */
function buildStoryItems(raw, prefix) {
  if (!raw || typeof raw !== "object") return [];
  
  // Determine the proper profile title and image keys based on the prefix.
  let profileTitle = "";
  let profileImage = "";

  if (prefix === "stories") {
    profileTitle = raw?.storiesProfileTitle || "";
    profileImage = mediaUrl(raw?.storiesProfileImage);
  } else if (prefix === "secondStories") {
    profileTitle = raw?.secondStoriesProfileTitle || "";
    profileImage = mediaUrl(raw?.secondStoriesProfileImage);
  }

  return STORY_SLOT_ORDER.map(([column, position], index) => {
    const base = `${prefix}Col${column}${position}`;
    const imageKey = `${base}Image`;
    const videoKey = `${base}Video`;
    const titleKey = `${base}ImageTitle`;
    const src = mediaUrl(raw[imageKey]);
    const videoEdge = raw[videoKey];
    const videoSrc = mediaUrl(videoEdge);
    const videoMimeType = normalizeMimeType(
      videoEdge?.node?.mimeType ?? raw[`${videoKey}MimeType`],
    );
    const caption = plainText(raw[titleKey]);
    if (!src && !videoSrc && !caption) return null;
    const shouldRenderVideo = resolveShouldRenderVideo(videoEdge, videoSrc);
    const hasImageMime = videoMimeType.startsWith("image/");
    const displaySrc = hasImageMime ? videoSrc || src : src || videoSrc;
    return {
      id: `story-${prefix}-${index + 1}`,
      src,
      videoSrc,
      displaySrc,
      shouldRenderVideo,
      caption,
      profileTitle,
      profileImage,
    };
  }).filter(Boolean);
}

function StoryTeaserMedia({ item, className }) {
  if (!item) return null;
  const imgSrc = item.src || item.displaySrc || item.videoSrc;
  if (!imgSrc) return null;
  return <Image width={200} height={200} src={imgSrc} alt="" className={className} loading="lazy" />;
}

function useStoriesLightboxState(storyItems, isOpen) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const rafRef = useRef(null);
  const startedAtRef = useRef(0);
  const progressBaseRef = useRef(0);
  const videoRef = useRef(null);
  const wasPausedRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const storyCount = storyItems.length;

  const goNext = useCallback(() => {
    if (!storyCount) return;
    setActiveIndex((prev) => (prev + 1) % storyCount);
    setProgressPct(0);
    progressBaseRef.current = 0;
    startedAtRef.current = performance.now();
  }, [storyCount]);

  const goPrev = useCallback(() => {
    if (!storyCount) return;
    setActiveIndex((prev) => (prev - 1 + storyCount) % storyCount);
    setProgressPct(0);
    progressBaseRef.current = 0;
    startedAtRef.current = performance.now();
  }, [storyCount]);

  const activeItem =
    isOpen && activeIndex >= 0 && activeIndex < storyItems.length
      ? storyItems[activeIndex]
      : null;
  const hasVideo =
    Boolean(activeItem?.shouldRenderVideo) && !videoError && Boolean(isOpen);

  useEffect(() => {
    if (!isOpen || hasVideo) {
      wasPausedRef.current = isPaused;
      return;
    }
    if (isPaused && !wasPausedRef.current) {
      progressBaseRef.current = progressPct;
      startedAtRef.current = performance.now();
    }
    if (!isPaused && wasPausedRef.current) {
      startedAtRef.current = performance.now();
    }
    wasPausedRef.current = isPaused;
  }, [hasVideo, isOpen, isPaused, progressPct]);

  useEffect(() => {
    if (!activeItem?.shouldRenderVideo || !activeItem?.videoSrc) return;
    setVideoError(false);
  }, [activeItem?.id, activeItem?.shouldRenderVideo, activeItem?.videoSrc]);

  useLayoutEffect(() => {
    if (!isOpen || !hasVideo || !videoRef.current) return;
    const v = videoRef.current;
    v.muted = isMutedRef.current;
    if (!isMutedRef.current) {
      v.volume = 1;
    }
  }, [hasVideo, isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen || !hasVideo || !videoRef.current) return;
    const videoEl = videoRef.current;
    if (isPaused) {
      videoEl.pause();
      return;
    }
    const playPromise = videoEl.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
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
  }, [activeIndex, goNext, hasVideo, isOpen, isPaused]);

  /** Unmute must run in the same gesture as the click (autoplay policy); `play()` helps some browsers. */
 const toggleMuted = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !v.muted;
    v.muted = nextMuted;

    if (!nextMuted) {
      v.volume = 1;
      const playPromise = v.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
      // If unmute resumes playback, sync pause icon state.
      setIsPaused(false);
    }

    setIsMuted(nextMuted);
  }, []);

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

  return {
    activeIndex,
    setActiveIndex,
    progressPct,
    setProgressPct,
    isPaused,
    setIsPaused,
    isMuted,
    setIsMuted,
    videoError,
    setVideoError,
    videoRef,
    stopLoop,
    goNext,
    goPrev,
    togglePause,
    toggleMuted,
  };
}

function ProductStoriesBlock({ productTypeData, prefix }) {
  const storyItems = useMemo(
    () => buildStoryItems(productTypeData, prefix),
    [productTypeData, prefix],
  );

  const [isOpen, setIsOpen] = useState(false);

  const {
    activeIndex,
    setActiveIndex,
    progressPct,
    setProgressPct,
    isPaused,
    setIsPaused,
    isMuted,
    setIsMuted,
    setVideoError,
    videoRef,
    stopLoop,
    goNext,
    goPrev,
    togglePause,
  } = useStoriesLightboxState(storyItems, isOpen);

  const teaser = storyItems[0] ?? null;
  const activeItem =
    isOpen && activeIndex >= 0 && activeIndex < storyItems.length
      ? storyItems[activeIndex]
      : null;

      

  const openLightbox = () => {
    if (!storyItems.length) return;
    setActiveIndex(0);
    setIsPaused(false);
    setProgressPct(0);
    setVideoError(false);
    setIsMuted(true);
    setIsOpen(true);
  };

  const closeLightbox = useCallback(() => {
    stopLoop();
    setIsOpen(false);
    setProgressPct(0);
    setIsPaused(false);
  }, [stopLoop]);

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
  }, [isOpen, closeLightbox, goNext, goPrev]);

  if (!teaser) return null;

  const mediaClassName =
    "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer";

  return (
    <>
      <div
        className="group relative h-[320px] w-[180px] shrink-0 overflow-hidden max-[480px]:mx-auto max-[480px]:h-[200px] max-[480px]:w-[120px]"
        style={{ borderColor: INK_20 }}
        onClick={openLightbox}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox();
          }
        }}
      >
        <StoryTeaserMedia item={teaser} className={mediaClassName} />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[#00112240] transition-opacity duration-300"
          aria-hidden="true"
        />
        <p className="absolute bottom-0 left-0 right-0 z-[2] p-2.5 text-left text-xs font-normal leading-snug text-white transition-transform duration-300 group-hover:translate-y-[-2px] min-[1024px]:text-sm min-[1024px]:leading-[1.428]">
          {teaser.profileTitle}
        </p>
      </div>

      <StoriesLightbox
        isOpen={isOpen}
        activeItem={activeItem}
        storyItems={storyItems}
        activeIndex={activeIndex}
        progressPct={progressPct}
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
        profileAvatar={teaser.profileImage || ""}
        profileTitle={teaser.profileTitle || "Story"}
      />
    </>
  );
}

export function ProductTypeImage({ productTypeData, productType }) {
  const prefix = productType === "Stones" ? "stories" : "secondStories";
  return (
    <ProductStoriesBlock productTypeData={productTypeData} prefix={prefix} />
  );
}
