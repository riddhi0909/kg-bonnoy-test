"use client";

import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  ScrollTrigger.config({ ignoreMobileResize: true });
}

function subscribeReducedMotion(callback) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Pins the Maison section while mapping vertical scroll to horizontal translation of `trackRef`.
 * When `prefers-reduced-motion: reduce`, skips GSAP (caller should use native overflow-x scroll).
 */
export function useMaisonHorizontalScrub() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const preferNativeScroll = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  useLayoutEffect(() => {
    if (preferNativeScroll) return;

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

    // Re-read scrollWidth only on refresh — live reads jitter as layout/subpixels shift while scrolling.
    let lockedScrollDist = 0;
    const syncLockedDistance = () => {
      lockedScrollDist = Math.max(0, track.scrollWidth - viewport.clientWidth);
    };
    syncLockedDistance();

    let cancelled = false;
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let refreshDebounce;

    const scheduleRefresh = () => {
      clearTimeout(refreshDebounce);
      refreshDebounce = setTimeout(() => {
        if (!cancelled) {
          syncLockedDistance();
          ScrollTrigger.refresh();
        }
      }, 280);
    };

    track.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", scheduleRefresh, { once: true });
    });

    const ctx = gsap.context(() => {
      gsap.set(track, { x: 0 });

      gsap.to(track, {
        x: () => -lockedScrollDist,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: () => `top top+=${headerHeight}`,
          end: () => `+=${Math.max(lockedScrollDist, 8)}`,
          pin: true,
          pinSpacing: true,
        //   pinType: "transform",
          zIndex: 40,
          // Short lag smooths trackpad/wheel steps; lockedScrollDist avoids range “dancing”.
          scrub: 0.45,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          refreshPriority: 0,
          onRefresh: () => {
            syncLockedDistance();
          },
        },
      });
    }, section);

    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!cancelled) {
          syncLockedDistance();
          ScrollTrigger.refresh();
        }
      }, 200);
    };
    window.addEventListener("resize", onResize);

    /** @type {number | null} */
    let innerRaf = null;
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(() => {
        innerRaf = null;
        if (!cancelled) {
          syncLockedDistance();
          ScrollTrigger.refresh();
        }
      });
    });

    const fonts = document.fonts;
    let fontsDone = false;
    const onFonts = () => {
      if (cancelled || fontsDone) return;
      fontsDone = true;
      scheduleRefresh();
    };
    if (fonts?.ready) {
      fonts.ready.then(onFonts).catch(onFonts);
    }

    const onWinLoad = () => {
      if (!cancelled) scheduleRefresh();
    };
    if (document.readyState === "complete") {
      requestAnimationFrame(onWinLoad);
    } else {
      window.addEventListener("load", onWinLoad, { once: true });
    }

    return () => {
      cancelled = true;
      clearTimeout(refreshDebounce);
      window.removeEventListener("load", onWinLoad);
      cancelAnimationFrame(outerRaf);
      if (innerRaf != null) cancelAnimationFrame(innerRaf);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [preferNativeScroll]);

  return { sectionRef, viewportRef, trackRef, preferNativeScroll };
}
