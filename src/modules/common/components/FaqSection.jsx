"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { cn } from "@/modules/common/utils/cn";

function PlusIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path d="M6 0V12M12 6H0" stroke="#001122" strokeMiterlimit="10" />
    </svg>
  );
}

const FAQ_ITEMS = [
  {
    title: "Expertise en joaillerie française",
    body: "Notre équipe maîtrise la sélection de pierres et la conception sur mesure, avec un accompagnement personnalisé à chaque étape.",
  },
  {
    title: "Gemmes rares et exclusives",
    body: "Nous sourçons des pierres d'exception grâce à notre réseau de négociants certifiés, pour des pièces souvent introuvables ailleurs.",
  },
  {
    title: "Bijoux sur mesure",
    body: "De l'esquisse à la livraison, nous créons des bijoux uniques adaptés à votre pierre et à votre style.",
  },
];

function decodeHtmlEntities(value) {
  if (typeof window === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function normalizeRichTextHtml(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (raw.includes("<")) {
    // Some CMS pipelines convert a single paragraph with <br><br>
    // into multiple <p> blocks. Merge back to one paragraph for this FAQ UI.
    const paragraphMatches = raw.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi);
    const onlyParagraphs =
      Array.isArray(paragraphMatches) &&
      paragraphMatches.length > 1 &&
      raw.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, "").trim() === "";

    if (onlyParagraphs) {
      const mergedBody = paragraphMatches
        .map((chunk) => chunk.replace(/^<p\b[^>]*>/i, "").replace(/<\/p>$/i, "").trim())
        .filter(Boolean)
        .join("<br><br>");
      return mergedBody ? `<p>${mergedBody}</p>` : "";
    }

    return raw;
  }
  if (raw.includes("&lt;") || raw.includes("&#60;")) {
    return decodeHtmlEntities(raw);
  }
  return raw;
}

/** @param {{ items: Array<{ title: string; body: string; imageUrl?: string; imageAlt?: string; buttonLabel?: string; buttonHref?: string; buttonTarget?: string }> }} props */
function CategoryFaqAccordion({ items }) {
  const [openKey, setOpenKey] = useState("");

  const toggle = useCallback((key) => {
    setOpenKey((prev) => (prev === key ? "" : key));
  }, []);

  return (
    <div className="border-[#00112233] max-[767px]:border-t-0 md:border-t">
      {items.map((item, index) => {
        const rowKey = `${index}-${item.title}`;
        const isOpen = openKey === rowKey;
        return (
          <div key={rowKey} className="border-b border-[#00112233]">
            <button
              type="button"
              onClick={() => toggle(rowKey)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 py-[30px] text-left transition-colors cursor-pointer"
            >
              <span className="font-serif text-[21px] font-normal leading-[1.19] text-[#001122] max-[767px]:text-[17px]">
                {item.title}
              </span>
              <PlusIcon
                className={cn(
                  "transition-transform duration-200 ease-out",
                  isOpen && "rotate-45",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pb-[30px] pr-4 min-[1440px]:pr-8">
                  <div
                    className="text-sm font-normal leading-[1.6] text-[rgba(0,17,34,0.75)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-[#001122] [&_a]:underline [&_a:hover]:text-[#FF6633]"
                    dangerouslySetInnerHTML={{ __html: normalizeRichTextHtml(item?.body) }}
                  />

                  {item?.buttonHref && item?.buttonLabel ? (
                    <div className="mt-8 w-max">
                      <Link
                        href={item.buttonHref}
                        target={item?.buttonTarget === "_blank" ? "_blank" : undefined}
                        rel={item?.buttonTarget === "_blank" ? "noopener noreferrer" : undefined}
                        className="group flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#001122] px-[15px] py-2 border border-[rgba(0,17,34,0.2)] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122]"
                      >
                        {item.buttonLabel}
                        <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path
                            d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                            stroke="currentColor"
                            strokeOpacity="0.85"
                            strokeMiterlimit="10"
                          />
                        </svg>
                      </Link>
                    </div>
                  ) : null}

                  {item?.imageUrl ? (
                    <div className="mt-12 flex h-full w-full items-center justify-center bg-[#ece5da] p-12 max-[768px]:p-6 max-[768px]:mt-6">
                      <Image
                        width={850}
                        height={850}
                        loading="lazy"
                        src={item.imageUrl}
                        alt={item.imageAlt || item.title || ""}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * @param {{
 *   faqTitle?: string | null;
 *   faqItems?: Array<{ title: string; body: string; imageUrl?: string; imageAlt?: string; buttonLabel?: string; buttonHref?: string; buttonTarget?: string }> | null;
 *   faqDetails?: Array<{ faqTitle?: string; faqDescription?: string; faqDetailsImage?: string; faqDetailsImageAlt?: string; faqButtonLinkTitle?: string; faqButtonLink?: string | { title?: string; url?: string; target?: string }; faqButtonLinkTarget?: string }> | null;
 *   sourcingSection?: {
 *     visible?: boolean;
 *     eyebrow?: string | null;
 *     title?: string | null;
 *     descriptionHtml?: string | null;
 *     buttonLabel?: string | null;
 *     buttonHref?: string | null;
 *     imageUrl?: string | null;
 *     imageAlt?: string | null;
 *     showIconWithTextSection?: boolean;
 *     iconWithText?: Array<{ icon?: { node?: { sourceUrl?: string; altText?: string } }; title?: string; description?: string }> | null;
 *   } | null;
 * }} props
 * Sourcing block renders only when `sourcingSection.visible` is true (CMS: showImageWithTextSection).
 * Sourcing copy and media come from theme global ACF only — no built-in fallbacks.
 * Icon-with-text rows use theme `iconWithText` only (no URL-string / raw icon fallbacks).
 * When `faqItems` is non-empty, accordion uses CMS rows; otherwise the built-in defaults.
 */
export function FaqSection({ faqTitle, faqItems, faqDetails, sourcingSection } = {}) {
  const mappedFaqItemsFromDetails = Array.isArray(faqDetails)
    ? faqDetails.map((item) => {
        const faqButtonLinkObject =
          item?.faqButtonLink && typeof item.faqButtonLink === "object" ? item.faqButtonLink : null;
        const faqButtonLinkString =
          typeof item?.faqButtonLink === "string" ? item.faqButtonLink : "";
        return {
          title: String(item?.faqTitle ?? "").trim(),
          body: String(item?.faqDescription ?? "").trim(),
          imageUrl: String(item?.faqDetailsImage ?? "").trim(),
          imageAlt: String(item?.faqDetailsImageAlt ?? "").trim(),
          buttonLabel: String(item?.faqButtonLinkTitle ?? faqButtonLinkObject?.title ?? "").trim(),
          buttonHref: String(faqButtonLinkString || faqButtonLinkObject?.url || "").trim(),
          buttonTarget: String(item?.faqButtonLinkTarget ?? faqButtonLinkObject?.target ?? "").trim(),
        };
      })
    : [];

  const accordionItems =
    Array.isArray(faqItems) && faqItems.length > 0
      ? faqItems
      : mappedFaqItemsFromDetails.length > 0
        ? mappedFaqItemsFromDetails
        : FAQ_ITEMS;
  const heading =
    typeof faqTitle === "string" && faqTitle.trim() ? faqTitle.trim() : "FAQ";

  const showSourcingBlock = Boolean(sourcingSection?.visible);

  const sourcingEyebrow =
    typeof sourcingSection?.eyebrow === "string" ? sourcingSection.eyebrow.trim() : "";
  const sourcingTitle =
    typeof sourcingSection?.title === "string" ? sourcingSection.title.trim() : "";
  const sourcingDescriptionHtml =
    typeof sourcingSection?.descriptionHtml === "string" && sourcingSection.descriptionHtml.trim()
      ? sourcingSection.descriptionHtml.trim()
      : "";
  const sourcingCtaLabel =
    typeof sourcingSection?.buttonLabel === "string" ? sourcingSection.buttonLabel.trim() : "";
  const sourcingCtaHref =
    typeof sourcingSection?.buttonHref === "string" ? sourcingSection.buttonHref.trim() : "";
  const sourcingImgSrc =
    typeof sourcingSection?.imageUrl === "string" ? sourcingSection.imageUrl.trim() : "";
  const sourcingImgAlt =
    typeof sourcingSection?.imageAlt === "string" ? sourcingSection.imageAlt.trim() : "";
  const showIconWithTextSection = Boolean(sourcingSection?.showIconWithTextSection);
  const iconWithTextRows = Array.isArray(sourcingSection?.iconWithText)
    ? sourcingSection.iconWithText
        .map((item, index) => {
          const node = item?.icon?.node;
          const iconUrl =
            typeof node?.sourceUrl === "string" ? node.sourceUrl.trim() : "";
          const iconAlt =
            typeof node?.altText === "string" ? node.altText.trim() : "";
          const title = typeof item?.title === "string" ? item.title.trim() : "";
          const description =
            typeof item?.description === "string" && item.description.trim()
              ? item.description.trim()
              : "";
          return { iconUrl, iconAlt, title, description, index };
        })
        .filter((row) => row.iconUrl || row.title || row.description)
    : [];

  return (
    <>
    {showIconWithTextSection && iconWithTextRows.length > 0 ? (
      <section className="mx-auto w-full max-w-[1440px] px-[15px] pt-[30px] pb-[60px] md:pt-[60px] md:pb-[120px] min-[1440px]:px-[60px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-[30px]">
          {iconWithTextRows.map((row) => {
            const rowKey = row.title ? `${row.index}-${row.title}` : `icon-text-${row.index}`;

            return (
                <article
                  key={rowKey}
                  className="border-t border-[#00112233] pt-[20px] px-0 md:border-t-0 md:border-l md:pt-0 md:pl-[15px] md:pr-4 transition-colors"
                >
                  <div className="space-y-[30px]">
                    {row.iconUrl ? (
                      <Image
                        src={row.iconUrl}
                        alt={row.iconAlt}
                        width={48}
                        height={48}
                        sizes="(max-width: 767px) 30px, 48px"
                        className="w-[48px] h-[48px] max-[767px]:w-[30px] max-[767px]:h-[30px] object-contain"
                        loading="lazy"
                      />
                    ) : null}
                    {row.title ? (
                      <h2 className="font-serif text-[21px] max-[767px]:text-[17px] font-normal uppercase leading-[1.19] text-[#001122]">
                        {row.title}
                      </h2>
                    ) : null}
                    {row.description ? (
                      <div
                        className="w-full min-[1200px]:w-[320px] text-sm leading-[1.428] text-[rgba(0,17,34,0.75)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-[#001122] [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: row.description }}
                      />
                    ) : null}
                  </div>
                </article>
            );
          })}
        </div>
      </section>
    ) : null}

      {showSourcingBlock ? (
        <section
          className={cn(
            "grid grid-cols-1 bg-[#001122]",
            sourcingImgSrc && "md:grid-cols-[1fr_2fr]",
          )}
        >
          <div className="order-2 md:order-1 mx-auto w-full max-w-[1440px] flex flex-col justify-center gap-[30px] px-[15px] py-[60px] min-[1440px]:p-[60px]">
            {sourcingEyebrow ? (
              <p className="text-sm font-semibold leading-[1.428] text-[#ff6633] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                {sourcingEyebrow}
              </p>
            ) : null}
            {sourcingTitle ? (
              <h3 className="font-serif text-[21px] md:text-[28px] font-normal leading-[1.25] text-white">
                {sourcingTitle}
              </h3>
            ) : null}
            {sourcingDescriptionHtml ? (
              <div
                className="text-sm leading-[1.428] text-white/75 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] [&_a]:text-white [&_a]:underline [&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sourcingDescriptionHtml }}
              />
            ) : null}
            {sourcingCtaHref && sourcingCtaLabel ? (
              <a
                href={sourcingCtaHref}
                className="inline-flex items-center gap-3 text-sm font-semibold leading-[1.428] text-white transition-colors hover:text-white [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
              >
                {sourcingCtaLabel}{" "}
                <span aria-hidden="true">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                  >
                    <path
                      d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                      stroke="white"
                      strokeMiterlimit="10"
                    />
                  </svg>
                </span>
              </a>
            ) : null}
          </div>
          {sourcingImgSrc ? (
            <div className="relative order-1 md:order-2 h-[320px] md:h-[620px]">
              <Image
                src={sourcingImgSrc}
                alt={sourcingImgAlt || sourcingTitle || ""}
                fill
                sizes="(max-width: 767px) 100vw, 66vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="mx-auto w-full px-4 max-w-[1440px] max-[767px]:pt-[30px] max-[767px]:pb-[60px] md:py-[120px] min-[1440px]:px-[60px]">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[315px_1fr] md:gap-5">
          <div className="">
            <h3 className="font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122]">
              {heading}
            </h3>
          </div>
          <CategoryFaqAccordion items={accordionItems} />
        </div>
      </section>
    </>
  );
}
