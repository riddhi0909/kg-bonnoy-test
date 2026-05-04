import { getPublicEnv } from "@/config/env";

/**
 * @param {object} p
 * @param {string} p.title
 * @param {string} [p.description]
 * @param {string} [p.path] pathname including locale
 * @param {string} [p.imageUrl]
 * @param {string} [p.locale]
 */
export function buildPageMetadata({ title, description, path = "", imageUrl, locale = "en" }) {
  const { siteUrl } = getPublicEnv();
  const base = siteUrl.replace(/\/$/, "");
  const canonical = `${base}${path}`;

  return {
    title,
    description: description || title,
    openGraph: {
      title,
      description: description || title,
      url: canonical,
      locale,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || title,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: { canonical },
  };
}
