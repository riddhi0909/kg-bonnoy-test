import { getPublicEnv, getServerWpGraphqlUrl } from "@/config/env";
import { locales } from "@/config/i18n";
import { homePath, productPath, productsPath } from "@/constants/routes";

async function fetchProductSlugs() {
  const endpoint = getServerWpGraphqlUrl();
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ products(first: 100) { nodes { slug modified } } }`,
      }),
    });
    const json = await res.json();
    return json.data?.products?.nodes ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const { siteUrl } = getPublicEnv();
  const base = siteUrl.replace(/\/$/, "");
  const nodes = await fetchProductSlugs();

  /** @type {import('next').MetadataRoute.Sitemap} */
  const out = [];

  for (const loc of locales) {
    out.push({
      url: `${base}${homePath(loc.code)}`,
      lastModified: new Date(),
    });
    out.push({
      url: `${base}${productsPath(loc.code)}`,
      lastModified: new Date(),
    });
    for (const n of nodes) {
      if (!n?.slug) continue;
      out.push({
        url: `${base}${productPath(loc.code, n.slug)}`,
        lastModified: n.modified ? new Date(n.modified) : new Date(),
      });
    }
  }

  return out;
}
