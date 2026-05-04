import Link from "next/link";
import { productsPath } from "@/constants/routes";

function toText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeWpUrl(raw) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return raw;
  }
}

/**
 * @param {any} acf
 */
function hasAcfData(acf) {
  if (!acf || typeof acf !== "object") return false;
  const list = Array.isArray(acf.list) ? acf.list : [];
  return Boolean(
    toText(acf.heading) ||
      toText(acf.bannerDescription) ||
      toText(acf.icaTitle) ||
      toText(acf.icaDescription) ||
      list.some((item) => toText(item?.title)) ||
      acf.bannerImage?.node?.sourceUrl ||
      acf.icaImage?.node?.sourceUrl,
  );
}

/**
 * Shared ACF section renderer for CMS pages.
 * @param {{ acf: any; locale: string; fallbackTitle?: string; fallbackBannerCta?: { label: string; href: string } }} props
 */
export function PageAcfSections({ acf, locale, fallbackTitle, fallbackBannerCta }) {
  if (!hasAcfData(acf)) return null;

  const title = toText(acf?.heading || fallbackTitle || "");
  const heroImage = acf?.bannerImage?.node || null;
  const heroDescription = acf?.bannerDescription || "";
  const highlights = Array.isArray(acf?.list)
    ? acf.list.map((item) => toText(item?.title)).filter(Boolean)
    : [];
  const firstCtaLabel = toText(acf?.firstBannerButtonTitle);
  const firstCtaLink = normalizeWpUrl(acf?.firstBannerButtonLink);
  const secondCtaLabel = toText(acf?.secondBannerButtonTitle);
  const secondCtaLink = normalizeWpUrl(acf?.secondBannerButtonLink);
  const icaTitle = toText(acf?.icaTitle);
  const icaDescription = acf?.icaDescription || "";
  const icaButtonLabel = toText(acf?.icaButtonTitle);
  const icaButtonLink = normalizeWpUrl(acf?.icaButtonLink);
  const icaImage = acf?.icaImage?.node || null;
  const showBanner = acf?.showBannerSection !== false;
  const showIca = acf?.showIcaSection !== false;
  const fallbackCta = fallbackBannerCta || { label: "Voir les produits", href: productsPath(locale) };

  return (
    <div className="space-y-10">
      {showBanner ? (
        <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800">
          {heroImage?.sourceUrl ? (
            <img
              src={heroImage.sourceUrl}
              alt={heroImage.altText || title || "Banner image"}
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 p-8 lg:p-12">
            <div className="space-y-5">
              {title ? (
                <h2 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
                  {title}
                </h2>
              ) : null}
              {heroDescription ? (
                <div
                  className="max-w-2xl text-sm text-zinc-100/95 md:text-base"
                  dangerouslySetInnerHTML={{ __html: heroDescription }}
                />
              ) : null}
              {highlights.length ? (
                <ul className="space-y-2 text-sm text-zinc-100/95 md:text-base">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex flex-wrap gap-3 pt-2">
                {firstCtaLabel && firstCtaLink ? (
                  <Link
                    href={firstCtaLink}
                    className="inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-900"
                  >
                    {firstCtaLabel}
                  </Link>
                ) : null}
                {secondCtaLabel && secondCtaLink ? (
                  <Link
                    href={secondCtaLink}
                    className="inline-flex rounded-lg border border-white/70 bg-transparent px-5 py-2.5 text-sm font-medium text-white"
                  >
                    {secondCtaLabel}
                  </Link>
                ) : (
                  <Link
                    href={fallbackCta.href}
                    className="inline-flex rounded-lg border border-white/70 bg-transparent px-5 py-2.5 text-sm font-medium text-white"
                  >
                    {fallbackCta.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showIca && (icaTitle || icaDescription || icaImage?.sourceUrl) ? (
        <section className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:grid-cols-[0.9fr_1.1fr]">
          {icaImage?.sourceUrl ? (
            <div className="overflow-hidden rounded-xl bg-zinc-100">
              <img
                src={icaImage.sourceUrl}
                alt={icaImage.altText || icaTitle || "Section image"}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="space-y-4">
            {icaTitle ? (
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{icaTitle}</h3>
            ) : null}
            {icaDescription ? (
              <div
                className="prose prose-zinc max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: icaDescription }}
              />
            ) : null}
            {icaButtonLabel && icaButtonLink ? (
              <Link
                href={icaButtonLink}
                className="inline-flex rounded-lg bg-zinc-900 px-5 py-2.5 text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                {icaButtonLabel}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
