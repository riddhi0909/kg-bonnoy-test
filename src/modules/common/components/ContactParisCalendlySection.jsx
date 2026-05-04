"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { defaultLocale } from "@/config/i18n";
import { homePath } from "@/constants/routes";

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function sanitizeHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .trim();
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&quot;/gi, "\"")
    .replace(/&#34;/gi, "\"")
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function extractIframeSrc(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const decoded = decodeHtmlEntities(raw);
  const cleaned = sanitizeHtml(decoded);
  const iframeTagMatch = cleaned.match(/<iframe\b[^>]*>/i);
  const searchTarget = iframeTagMatch ? iframeTagMatch[0] : cleaned;
  const srcMatch = searchTarget.match(/\bsrc\s*=\s*(['"])(.*?)\1/i);

  if (srcMatch?.[2]) return srcMatch[2].trim();
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return "";
}

/**
 * Paris contact — Calendly + copy (styles from legacy kg-remote-multi-form-section).
 */
export function ContactParisCalendlySection({
  prefix,
  title,
  description,
  iframe: iframeSrc,
  closeAriaLabel,
}) {
  const iframeRef = useRef(null);
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const homeHref = homePath(locale);
  const iframeUrl = extractIframeSrc(iframeSrc);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const utms = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    let base = iframe.getAttribute("src") || iframeUrl;
    const extras = [];
    for (const u of utms) {
      const v = params.get(u);
      if (v) extras.push(`${u}=${encodeURIComponent(v)}`);
    }
    if (extras.length > 0) {
      base += (base.includes("?") ? "&" : "?") + extras.join("&");
      iframe.setAttribute("src", base);
    }
  }, [iframeUrl]);

  return (
    <section className="overflow-visible bg-[#fffbf4]">
      <div className="fixed top-[112px] right-8 z-[9] hidden border border-[#fffbf4] md:flex">
        <Link
          href={homeHref}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-[#001122] text-[#fffbf4] outline-none focus-visible:ring-2 focus-visible:ring-[#fffbf4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffbf4]"
          aria-label={closeAriaLabel || "Close"}
        >
          <CloseIcon className="relative z-[1] h-[24px] w-[24px] shrink-0" />
        </Link>
      </div>

      <div className="grid min-h-screen grid-cols-1 gap-0 overflow-visible bg-[#fffbf4] min-[992px]:grid-cols-2">
        <div className="relative mx-[5vw] flex flex-col items-center justify-start pt-0 min-[992px]:justify-center min-[992px]:pb-0 min-[992px]:pt-[136px] max-[480px]:mx-4">
          <div className="relative top-0 flex w-full max-w-[560px] flex-col items-start justify-start gap-3 px-0 pb-12 pt-24 min-[992px]:-top-[68px] min-[992px]:px-[88px] min-[992px]:pb-0 min-[992px]:pt-0">
            <div className="flex items-center justify-start gap-1 bg-[#ffd0a9] p-2 text-xs font-medium uppercase leading-none tracking-normal text-[#f63] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
              <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 6 6"
                className="h-[6px] w-auto shrink-0"
                aria-hidden
              >
                <rect
                  fill="currentColor"
                  x="1.79"
                  y="0.88"
                  width="4.24"
                  height="4.24"
                  transform="translate(-1.89 3.65) rotate(-45)"
                />
              </svg>
              <div>{prefix || ""}</div>
            </div>
            <h1 className="text-[36px] font-medium leading-[1.2] tracking-normal text-[#001122] min-[768px]:text-[40px] font-serif">
              <strong>{title || ""}</strong>
            </h1>
            <p className="text-base font-medium leading-[1.5] tracking-normal text-[#001122] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
              {description || ""}
            </p>
          </div>
        </div>

        <div className="sticky top-0 flex h-auto items-center justify-center overflow-hidden bg-[#000d29] pb-4 pt-4 min-[992px]:h-screen min-[992px]:pb-12 min-[992px]:pt-[136px]">
          <div className="flex w-3/4 max-w-[900px] flex-[0_auto] items-center justify-center self-center overflow-y-hidden rounded-2xl bg-white">
            <div className="relative h-[500px] min-h-[500px] w-full min-w-[280px] sm:min-w-[320px]">
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                title={title || "Contact"}
                className="h-full mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
