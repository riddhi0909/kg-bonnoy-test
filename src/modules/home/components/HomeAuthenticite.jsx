"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  DEFAULT_VALUES_SECTION_BG,
  INK,
  BODY_DEFAULT,
  DROP,
  PARALLAX_INTENSITIES,
  DEFAULT_VALUES_RING_SLOTS,
  MOBILE_VALUES_RING_SLOTS,
  AUTH_VALUES_ORBIT_RING_SRCS,
  AUTH_VALUES_CENTER_RING_SRC,
  defaultFigmaValuesRings,
} from "../hooks/homeAuthenticiteConstants";

// Re-export for backward compatibility
export {
  DEFAULT_VALUES_SECTION_BG,
  DEFAULT_VALUES_RING_SLOTS,
  MOBILE_VALUES_RING_SLOTS,
  AUTH_VALUES_ORBIT_RING_SRCS,
  AUTH_VALUES_CENTER_RING_SRC,
  defaultFigmaValuesRings,
};

/**
 * @param {{
 *   backgroundColor?: string;
 *   title1?: string;
 *   title3?: string;
 *   line2Plain?: string | null;
 *   excellenceBefore?: string;
 *   excellenceAfter?: string;
 *   excellenceRingSrc?: string | null;
 *   excellenceRingSrcMobile?: string | null;
 *   excellenceRingAlt?: string;
 *   excellenceRingDropShadow?: boolean;
 *   excellenceRingOverlayLeft?: string;
 *   excellenceRingOverlayTop?: string;
 *   body?: string | null;
 *   rings?: Array<Partial<{ src: string; alt: string; top: string; left: string; width: string; rotate: number; className: string; dropShadow: boolean }> | null | undefined>;
 *   className?: string;
 *   enableParallax?: boolean;
 * }} props
 */
export function HomeAuthenticite({
  backgroundColor = DEFAULT_VALUES_SECTION_BG,
  title1 = "AUTHENTICITÉ",
  title3 = "SINGULARITÉ",
  line2Plain = null,
  excellenceBefore = "EXCELL",
  excellenceAfter = "NCE",
  excellenceRingSrc = null,
  excellenceRingSrcMobile = null,
  excellenceRingAlt = "",
  excellenceRingDropShadow = false,
  excellenceRingOverlayLeft = "50%",
  excellenceRingOverlayTop = "65%",
  mobileExcellenceRingOverlayTop = "71%",
  body = BODY_DEFAULT,
  rings,
  className = "",
  enableParallax = true,
}) {
  const sectionRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current || !enableParallax) return;
    
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    rafRef.current = requestAnimationFrame(() => {
      const rect = sectionRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      setParallaxOffset({ x, y });
    });
  }, [enableParallax]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setParallaxOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const getParallaxTransform = useCallback((index, baseRotate = 0) => {
    const intensity = PARALLAX_INTENSITIES[index] ?? 0.025;
    const offsetX = Math.round(parallaxOffset.x * intensity * 100);
    const offsetY = Math.round(parallaxOffset.y * intensity * 100);
    return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), 0) rotate(${baseRotate}deg)`;
  }, [parallaxOffset]);

  const getCenterRingParallaxTransform = useCallback(() => {
    const intensity = 0.02;
    const offsetX = Math.round(parallaxOffset.x * intensity * 100);
    const offsetY = Math.round(parallaxOffset.y * intensity * 100);
    return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), 0)`;
  }, [parallaxOffset]);

  const line2 = line2Plain ? (
    line2Plain
  ) : excellenceRingSrc ? (
    <span className="relative inline-block max-w-full leading-none [letter-spacing:inherit]">
      <span className="relative z-[1] whitespace-nowrap">{`${excellenceBefore}E${excellenceAfter}`}</span>
      <img
        src={excellenceRingSrc}
        alt={excellenceRingAlt}
        aria-hidden={!excellenceRingAlt}
        className="pointer-events-none absolute z-[3] hidden h-auto w-auto max-w-[min(240px,240px)] object-contain object-center select-none min-[768px]:block min-[768px]:max-h-[140px] min-[1024px]:max-h-none"
        style={{
          left: excellenceRingOverlayLeft,
          top: excellenceRingOverlayTop,
          transform: enableParallax ? getCenterRingParallaxTransform() : "translate(-50%, -50%)",
          filter: excellenceRingDropShadow ? DROP : undefined,
          backfaceVisibility: "hidden",
        }}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <img
        src={excellenceRingSrcMobile ?? excellenceRingSrc}
        alt={excellenceRingAlt}
        aria-hidden={!excellenceRingAlt}
        className="pointer-events-none absolute z-[3] block w-auto max-w-[min(90px,35vw)] object-contain object-center select-none min-[768px]:hidden"
        style={{
          left: excellenceRingOverlayLeft,
          top: mobileExcellenceRingOverlayTop,
          transform: enableParallax ? getCenterRingParallaxTransform() : "translate(-50%, -50%)",
          filter: excellenceRingDropShadow ? DROP : undefined,
          backfaceVisibility: "hidden",
        }}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </span>
  ) : (
    `${excellenceBefore}E${excellenceAfter}`
  );

  const desktopSlots = DEFAULT_VALUES_RING_SLOTS.map((slot, i) => {
    const override = rings?.[i];
    if (override === null) return null;
    return { ...slot, ...override };
  }).filter(Boolean);

  const mobileSlots = MOBILE_VALUES_RING_SLOTS.map((slot, i) => {
    const override = rings?.[i];
    if (override === null) return null;
    return { ...slot, ...override };
  }).filter(Boolean);

  return (
    <section
      ref={sectionRef}
      id="authenticite"
      aria-label={
        title1 && title3
          ? `${title1}, ${line2Plain ?? `${excellenceBefore}E${excellenceAfter}`}, ${title3}`
          : "Valeurs Bonnot Paris"
      }
      className={`w-full ${className}`.trim()}
      style={{ backgroundColor }}
      onMouseMove={enableParallax ? handleMouseMove : undefined}
      onMouseLeave={enableParallax ? handleMouseLeave : undefined}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-[100px] pb-[60px] min-[1440px]:px-[60px] min-[1440px]:py-[100px]">
        <div className="relative mx-auto pt-[100px] w-full max-w-[1320px]">
          {desktopSlots.map((slot, i) => {
            const src = slot.src;
            if (!src) return null;
            const showDrop = slot.dropShadow === true;
            return (
              <img
                key={`desktop-${slot.top}-${slot.left}-${i}`}
                src={src}
                alt={slot.alt ?? ""}
                className={`pointer-events-none absolute z-[1] hidden max-w-none select-none min-[768px]:block ${slot.className ?? ""}`}
                style={{
                  top: slot.top,
                  left: slot.left,
                  transform: enableParallax
                    ? getParallaxTransform(i, slot.rotate ?? 0)
                    : `translate(-50%, -50%) rotate(${slot.rotate ?? 0}deg)`,
                  filter: showDrop ? DROP : undefined,
                  backfaceVisibility: "hidden",
                }}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            );
          })}
          {mobileSlots.map((slot, i) => {
            const src = slot.src;
            if (!src) return null;
            const showDrop = slot.dropShadow === true;
            return (
              <img
                key={`mobile-${slot.top}-${slot.left}-${i}`}
                src={src}
                alt={slot.alt ?? ""}
                className={`pointer-events-none absolute z-[1] block max-w-none select-none min-[768px]:hidden ${slot.className ?? ""}`}
                style={{
                  top: slot.top,
                  left: slot.left,
                  width: slot.width,
                  transform: enableParallax
                    ? getParallaxTransform(i, slot.rotate ?? 0)
                    : `translate(-50%, -50%) rotate(${slot.rotate ?? 0}deg)`,
                  filter: showDrop ? DROP : undefined,
                  backfaceVisibility: "hidden",
                }}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            );
          })}

          <div className="relative z-[2] flex h-auto min-h-0 flex-col items-center justify-center px-0 pt-[50px] text-center gap-[120px] min-[768px]:min-h-[min(670px,860px)] min-[768px]:gap-20 min-[768px]:pt-0">
            <h2 className="font-serif text-[42px] font-normal uppercase leading-[0.92] tracking-[0.04em] min-[768px]:text-[clamp(1.85rem,8.333vw,120px)] text-[#001122]">
              <span className="block">{title1}</span>
              <span className="mt-[0.06em] block">{line2}</span>
              <span className="mt-[0.06em] block">{title3}</span>
            </h2>
            {body ? (
              <p
                className="mt-10 w-full text-[14px] font-normal leading-[1.5] min-[768px]:mx-auto min-[768px]:max-w-[420px] min-[1440px]:mt-20 text-[#001122]/75"
                style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
              >
                {body}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
