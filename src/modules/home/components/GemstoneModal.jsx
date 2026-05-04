"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categoryPath } from "@/constants/routes";

const MODAL_ENTER_MS = 760;
const MODAL_EXIT_MS = 320;
const MODAL_ENTER_DELAY_MS = 90;

/**
 * @param {{ isOpen: boolean; onClose: () => void; initialIndex?: number; slides?: Array<{ id?: string; label?: string; image?: string; title?: string; description?: string; count?: number; slug?: string }>; locale?: string }} props
 */
export default function GemstoneModal({ isOpen, onClose, initialIndex = 0, slides: slidesProp, locale = "fr" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const slides = useMemo(() => (Array.isArray(slidesProp) ? slidesProp : []), [slidesProp]);
  const closeTimerRef = useRef(null);
  const activeSlide = slides[activeIndex];

  const descriptionText = String(activeSlide?.description ?? "").trim();

  const visibleDotIndices = (() => {
    const total = slides.length;
    if (total <= 3) return Array.from({ length: total }, (_, i) => i);

    const start = Math.max(0, Math.min(activeIndex - 1, total - 3));
    return [start, start + 1, start + 2];
  })();
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const safeIndex = Math.max(0, Math.min(initialIndex, slides.length - 1));
    setActiveIndex(safeIndex);
  }, [isOpen, initialIndex, slides.length]);

  useEffect(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (isOpen) {
      setIsMounted(true);
      const id = window.setTimeout(() => {
        window.requestAnimationFrame(() => setIsVisible(true));
      }, MODAL_ENTER_DELAY_MS);
      return () => window.clearTimeout(id);
    }

    setIsVisible(false);
    closeTimerRef.current = window.setTimeout(() => {
      setIsMounted(false);
    }, MODAL_EXIT_MS);

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  if (!isMounted || slides.length === 0) return null;

  return (
    <div
      className="kg-category-popup-wrapper fixed inset-0 z-50"
      onClick={onClose}
    >
      {/* Overlay */}
      <div
        className="absolute kg-category-popup inset-0  flex items-center justify-center"

      >
        <div
          className={`absolute inset-0 bg-[#001122]/50 backdrop-blur-[10px] transition-opacity ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transitionDuration: `${isVisible ? MODAL_ENTER_MS : MODAL_EXIT_MS}ms`,
            transitionTimingFunction: isVisible
              ? "cubic-bezier(0.16, 1, 0.3, 1)"
              : "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`relative z-10 w-[90%] max-w-md bg-white p-5 pt-10 transform-gpu will-change-transform transition-[opacity,transform] ${
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.95]"
          }`}
          style={{
            transitionDuration: `${isVisible ? MODAL_ENTER_MS : MODAL_EXIT_MS}ms`,
            transitionTimingFunction: isVisible
              ? "cubic-bezier(0.16, 1, 0.3, 1)"
              : "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
            {/* Close Button */}
            <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            className="absolute top-3 right-3 hover:text-black text-[rgba(0,17,34,1)]-500 cursor-pointer"
            aria-label="Fermer"
            >
            ✕
            </button>

            {/* Title */}
            <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-serif">{activeSlide.label ?? activeSlide.title}</h2>
            <span className="text-sm text-[rgba(0,17,34,1)]">
              {typeof activeSlide.count === "number" && activeSlide.count > 0
                ? `${activeSlide.count} produits`
                : "+100 pierres"}
            </span>
            </div>

            {/* Image */}
            <img
            src={activeSlide.image}
            alt={activeSlide.title || activeSlide.label || ""}
            className="w-full h-[220px] object-cover"
            />

            {/* Content */}
            <div className="text-center mt-4">
            <h3 className="font-serif text-[21px] font-normal leading-[25px] text-[rgba(0,17,34,1)] max-[768px]:text-[17px]  mb-2">
                {activeSlide.title ?? activeSlide.label}
            </h3>
            {descriptionText ? (
              <p
                className="text-[rgba(0,17,34,1)] font-normal text-[14px]"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
                }}
              >
                {descriptionText}
              </p>
            ) : null}
            </div>

            {/* Slider Dots */}
            <div className="flex items-center justify-center gap-4 pt-10 text-[rgba(0,17,34,0.5)]">
            {/* Prev arrow */}
            <button
                type="button"
                onClick={() =>
                setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
                }
                className="text-m hover:text-[rgba(0,17,34,0.85)] transition-colors cursor-pointer"
                aria-label="Précédent"
            >
                &#8249;
            </button>

            {/* Dots as small lines */}
            <div className="flex items-center gap-2">
                {visibleDotIndices.map((index) => {
                const slide = slides[index];
                return (
                    <button
                    key={`dot-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="h-[2px] w-6 rounded-full overflow-hidden"
                    aria-label={`Voir ${slide?.title ?? slide?.label ?? index}`}
                    >
                    <span
                        className={`block h-full rounded-full transition-colors ${
                        index === activeIndex
                            ? "bg-[rgba(0,17,34,0.85)]"
                            : "bg-[rgba(0,17,34,0.2)]"
                        }`}
                    />
                    </button>
                );
                })}
            </div>

            {/* Next arrow */}
            <button
                type="button"
                onClick={() =>
                setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
                }
                className="text-m hover:text-[rgba(0,17,34,0.85)] transition-colors cursor-pointer"
                aria-label="Suivant"
            >
                &#8250;
            </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-5">
            <button className="group flex-1 bg-black text-white py-2 px-2 text-sm flex gap-2 hover:bg-gray-800 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" className="transition-transform duration-300 group-hover:rotate-12">
                    <path d="M18.03 2.51C16.36 1.12 14.29 0.21 12 0V2.01C13.73 2.2 15.31 2.89 16.61 3.93L18.03 2.51Z" fill="white"></path>
                    <path d="M10.0007 2.01V0C7.7107 0.2 5.6407 1.12 3.9707 2.51L5.3907 3.93C6.6907 2.89 8.2707 2.2 10.0007 2.01Z" fill="white"></path>
                    <path d="M3.98078 5.34L2.56078 3.92C1.17078 5.59 0.260781 7.66 0.0507812 9.95H2.06078C2.25078 8.22 2.94078 6.64 3.98078 5.34Z" fill="white"></path>
                    <path d="M19.9395 9.95H21.9495C21.7395 7.66 20.8295 5.59 19.4395 3.92L18.0195 5.34C19.0595 6.64 19.7495 8.22 19.9395 9.95Z" fill="white"></path>
                    <path d="M6 10.95L9.44 12.51L11 15.95L12.56 12.51L16 10.95L12.56 9.39L11 5.95L9.44 9.39L6 10.95Z" fill="white"></path>
                    <path d="M11 19.95C7.89 19.95 5.15 18.36 3.54 15.95H6V13.95H0V19.95H2V17.25C3.99 20.09 7.27 21.95 11 21.95C15.87 21.95 20 18.78 21.44 14.39L19.48 13.94C18.25 17.43 14.92 19.95 11 19.95Z" fill="white"></path>
                </svg>
                Créer avec cette pierre
            </button>
            {activeSlide?.href || activeSlide?.slug ? (
              <Link
                href={activeSlide.href || categoryPath(locale, activeSlide.slug)}
                className="group flex items-center justify-center gap-2 flex-1 border py-2 px-2 text-sm text-center hover:bg-gray-100 cursor-pointer no-underline text-[#001122]"
                onClick={onClose}
              >
                Voir la collection 
                <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"></path>
                </svg>
              </Link>
            ) : (
              <button type="button" className="flex-1 border py-2 px-2 text-sm hover:bg-gray-100 cursor-pointer">
                Voir la collection 
                <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"></path>
                </svg>
              </button>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}