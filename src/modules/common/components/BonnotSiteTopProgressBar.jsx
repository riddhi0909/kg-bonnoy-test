"use client";

/**
 * Same fixed top indeterminate bar + animation as {@link NavigationRouteProgress}
 * (`bonnot-nav-route-progress` in globals.css). Use for route `loading.js` and anywhere
 * inline “scroll” feedback is needed without full-page skeletons.
 */
export function BonnotSiteTopProgressBar({
  ariaLabel = "Chargement…",
  /** `z-[200]` matches nav route progress; raise if it sits under a modal. */
  className = "",
}) {
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-[200] ${className}`.trim()}
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{ariaLabel}</span>
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
