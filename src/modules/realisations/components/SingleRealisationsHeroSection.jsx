"use client";

import Link from "next/link";
import { useAppointmentModal } from "@/modules/menu/providers/appointment-modal-context";
import {
  homePath,
  realisationsPath,
  realisationsPostPath,
} from "@/constants/routes";


function stripTags(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Strip a single outer &lt;p&gt;…&lt;/p&gt; wrapper; keep &lt;a&gt; and other inner HTML. */
function unwrapOuterParagraph(html) {
  const s = String(html || "").trim();
  const m = s.match(/^<p\b[^>]*>([\s\S]*?)<\/p>\s*$/i);
  if (!m) return s;
  return m[1].trim();
}

/** @param {string} locale */
function achievementSpecRows(locale) {
  const L = locale === "en";
  return [  
    { key: "clarity", label: L ? "Clarity" : "Pureté", field: "clarity" },
    { key: "measurement", label: L ? "Measurement" : "Mesure", field: "measurement" },
    { key: "origin", label: L ? "Origin" : "Origine", field: "origin" },
    { key: "treatment", label: L ? "Treatment" : "Traitement", field: "treatment" },
  ];
}

/**
 * @param {object} props
 * @param {string} props.locale
 * @param {string} props.slug WordPress slug for this réalisation (URL segment)
 * @param {string} props.titleHtml
 * @param {string[]} props.imageUrls
 * @param {string} props.imageAltBase
 * @param {string} props.subTitle
 * @param {string} props.shortDescription plain fallback when post body is empty
 * @param {string} props.descriptionHtml WordPress post content (HTML)
 * @param {{ clarity?: string, measurement?: string, origin?: string, treatment?: string }} [props.achievementSpecs]
 * @param {string} props.contactLabel
 * @param {string} props.contactHint
 */
export function SingleRealisationsHeroSection({
  locale,
  slug,
  titleHtml,
  imageUrls = [],
  imageAltBase,
  subTitle = "",
  shortDescription = "",
  descriptionHtml = "",
  achievementSpecs = {},
  contactLabel,
  contactHint,
}) {
  const { open: openAppointmentModal } = useAppointmentModal();
  const titlePlain = stripTags(titleHtml) || imageAltBase || "";
  const bodyHtmlRaw = String(descriptionHtml || "").trim();
  const hasBody = Boolean(bodyHtmlRaw);
  const hasShort = Boolean(String(shortDescription || "").trim());
  const bodyHtmlDisplay = hasBody ? unwrapOuterParagraph(bodyHtmlRaw) : "";
  const specRows = achievementSpecRows(locale)
    .map((row) => ({
      ...row,
      value: String(achievementSpecs?.[row.field] ?? "").trim(),
    }))
    .filter((row) => row.value);
  const crumbs = (
    <nav className="flex flex-wrap items-center gap-[17px] text-[14px] font-medium tracking-normal text-[#000d29]">
      <Link href={homePath(locale)} className="text-[#000d29] no-underline hover:text-[#ff6633]">
        {locale === "en" ? "Home" : "Accueil"}
      </Link>
      <span className="inline-flex items-center justify-center text-[#001122]" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7.5 4L13.5 10L7.5 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      <Link href={realisationsPath(locale)} className="text-[#000d29] no-underline hover:text-[#ff6633]">
        {locale === "en" ? "Realisations" : "Réalisations"}
      </Link>
      <span className="inline-flex items-center justify-center text-[#001122]" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M7.5 4L13.5 10L7.5 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {slug ? (
        <Link
          href={realisationsPostPath(locale, slug)}
          className="text-[#000d29] no-underline hover:text-[#ff6633]"
          aria-current="page"
        >
          <span className="underline underline-offset-[6px]">{titlePlain}</span>
        </Link>
      ) : (
        <span className="underline underline-offset-[6px] text-[#000d29]">{titlePlain}</span>
      )}
    </nav>
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="grid min-h-screen grid-cols-2 items-stretch gap-0 max-[768px]:grid-cols-1">
        <div className="w-full pt-0 max-[768px]:order-[9999] max-[768px]:pt-8">
          <div>
            {imageUrls.map((url) => (
              <div
                key={url}
                className="relative z-0 h-auto min-h-screen w-full object-cover object-center max-[768px]:mb-6 max-[768px]:min-h-0"
              >
                <img
                  src={url}
                  className="absolute inset-y-0 right-0 h-full w-[50vw] max-w-none object-cover max-[768px]:static max-[768px]:aspect-[1/1.28] max-[768px]:h-auto max-[768px]:w-full"
                  alt={imageAltBase || titlePlain || "Réalisation"}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 flex min-h-screen flex-col items-start justify-start gap-4 self-start pb-8 pl-[88px] pt-20 max-[991px]:pl-10 max-[768px]:static max-[768px]:min-h-0 max-[768px]:pl-0 max-[768px]:pt-8">
          {crumbs}

          <h1
            className="m-0 font-serif text-[48px] font-medium leading-[1.1] tracking-normal text-[#000d29]"
            dangerouslySetInnerHTML={{ __html: titleHtml || titlePlain }}
          />

          {(subTitle || hasBody || hasShort) && (
            <div className="flex flex-col gap-4">
              {hasBody ? (
                <div
                  className="m-0 font-jakarta text-[16px] font-medium leading-[1.5] tracking-normal text-[#7e7067] [&_p]:m-0 [&_p+_p]:mt-4 [&_a]:text-[#000d29] [&_a]:no-underline [&_a:hover]:text-[#ff6633]"
                  dangerouslySetInnerHTML={{ __html: bodyHtmlDisplay }}
                />
              ) : hasShort ? (
                <p className="m-0 font-jakarta text-[16px] font-medium leading-[1.5] tracking-normal text-[#7e7067]">
                  {shortDescription}
                </p>
              ) : null}
            </div>
          )}

          {specRows.length > 0 ? (
            <div>
              {specRows.map((row) => (
                <div key={row.key} className="mb-3 flex items-center justify-start gap-2 text-[14px]">
                  <span className="inline-flex items-center justify-center text-[#ff6633]">
                    <svg
                      id="Layer_1"
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 6 6"
                      className="h-3 w-auto shrink-0"
                      aria-hidden="true"
                    >
                      <rect
                        fill="currentColor"
                        x="1.79"
                        y="0.88"
                        width="4.24"
                        height="4.24"
                        transform="translate(-1.89 3.65) rotate(-45)"
                      ></rect>
                    </svg>
                  </span>
                  <span className="font-jakarta text-[14px] font-medium leading-[1.5] tracking-normal text-[#000d29]">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {contactHint ? (
            <div className="mb-[15px] font-jakarta text-[16px] font-medium leading-[1.5] tracking-normal text-[#000d29]/60">
              <p>{contactHint}</p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => openAppointmentModal()}
            className="group flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#001122] px-[15px] py-2 border border-[rgba(0,17,34,0.2)] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122] cursor-pointer"
          >
            {contactLabel}
            <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path
                d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                stroke="currentColor"
                strokeOpacity="0.85"
                strokeMiterlimit="10"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
