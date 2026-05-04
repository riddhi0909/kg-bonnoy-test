"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function routeKey(pathname, searchParams) {
  const q = searchParams?.toString() ?? "";
  return q ? `${pathname}?${q}` : pathname;
}

/**
 * Soft navigations often keep the previous screen visible until the new RSC
 * payload is ready, so `loading.js` may not appear. This bar starts on
 * in-app link interaction and ends when the URL (path + query) updates.
 */
export function NavigationRouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = routeKey(pathname, searchParams);
  const prevKey = useRef(key);
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);
  const pendingAnchorRef = useRef(/** @type {HTMLAnchorElement | null} */ (null));
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const pointerMovedRef = useRef(false);

  useEffect(() => {
    if (prevKey.current === key) return;
    prevKey.current = key;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    queueMicrotask(() => {
      setActive(false);
    });
  }, [key]);

  useEffect(() => {
    const MOVE_THRESHOLD = 6;

    function clearTimer() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    function resetPointerIntent() {
      pendingAnchorRef.current = null;
      pointerMovedRef.current = false;
    }

    /** @param {PointerEvent} e */
    function onPointerDownCapture(e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      const anchor = t.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const hrefAttr = anchor.getAttribute("href");
      if (!hrefAttr || hrefAttr.startsWith("#")) return;

      let nextUrl;
      try {
        nextUrl = new URL(anchor.href);
      } catch {
        return;
      }
      if (nextUrl.origin !== window.location.origin) return;

      const cur = window.location;
      const sameURL =
        nextUrl.pathname === cur.pathname &&
        nextUrl.search === cur.search &&
        nextUrl.hash === cur.hash;
      if (sameURL) return;

      pendingAnchorRef.current = anchor;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      pointerMovedRef.current = false;
    }

    /** @param {PointerEvent} e */
    function onPointerMoveCapture(e) {
      if (!pendingAnchorRef.current) return;
      const dx = Math.abs(e.clientX - pointerStartRef.current.x);
      const dy = Math.abs(e.clientY - pointerStartRef.current.y);
      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        pointerMovedRef.current = true;
      }
    }

    /** @param {PointerEvent} e */
    function onPointerUpCapture(e) {
      if (!pendingAnchorRef.current) return;
      const clickedSameAnchor = e.target instanceof Element && e.target.closest("a[href]") === pendingAnchorRef.current;
      const shouldStart = clickedSameAnchor && !pointerMovedRef.current;
      resetPointerIntent();
      if (!shouldStart) return;

      setActive(true);
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        setActive(false);
        timerRef.current = null;
      }, 20000);
    }

    function onPointerCancelCapture() {
      resetPointerIntent();
    }

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    document.addEventListener("pointermove", onPointerMoveCapture, true);
    document.addEventListener("pointerup", onPointerUpCapture, true);
    document.addEventListener("pointercancel", onPointerCancelCapture, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
      document.removeEventListener("pointermove", onPointerMoveCapture, true);
      document.removeEventListener("pointerup", onPointerUpCapture, true);
      document.removeEventListener("pointercancel", onPointerCancelCapture, true);
      resetPointerIntent();
      clearTimer();
    };
  }, []);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200]"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Chargement de la page…</span>
      <div
        className="h-[2px] w-full overflow-hidden bg-[rgba(0,17,34,0.08)]"
        role="progressbar"
        aria-hidden
      >
        <div className="bonnot-nav-route-progress-bar h-full w-[28%] bg-[#001122]" />
      </div>
    </div>
  );
}
