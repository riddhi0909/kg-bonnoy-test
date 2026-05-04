import { getWpOrigin } from "@/config/env";
import { categoryPath, homePath, localizedPath } from "@/constants/routes";

/**
 * @param {string} locale Next locale prefix (en, fr)
 * @param {string | null | undefined} url Full URL from WordPress
 * @param {string | null | undefined} path Relative path if schema exposes it
 * @returns {{ href: string; external: boolean }}
 */
export function resolveMenuLink(locale, url, path) {
  const origin = getWpOrigin();

  /**
   * Map WP product-category links to the Next category page.
   * @param {string} rawPath
   */
  // function mapWpPath(rawPath) {
  //   const p = rawPath.split("?")[0];
  //   const m = p.match(/^\/(?:product-category|categorie-produit)\/([^/]+)\/?$/i);
  //   if (m) return categoryPath(locale, m[1]);
  //   return null;
  // }

  function mapWpPath(rawPath) {
    const p = rawPath.split("?")[0].replace(/\/+$/, ""); // remove query + trailing slash
    const m = p.match(/^\/(?:product-category|categorie-produit)\/(.+)$/i);
    if (!m) return null;
  
    const parts = m[1].split("/").filter(Boolean);
    const lastSlug = parts[parts.length - 1];
    if (!lastSlug) return null;
  
    return categoryPath(locale, lastSlug);
  }

  if (path && typeof path === "string" && path.startsWith("/")) {
    const mapped = mapWpPath(path);
    if (mapped) return { href: mapped, external: false };
    const p = path === "/" ? "" : path;
    return { href: localizedPath(locale, p || "/"), external: false };
  }

  if (url && typeof url === "string") {
    try {
      const u = new URL(url);
      if (origin) {
        const wp = new URL(origin.startsWith("http") ? origin : `https://${origin}`);
        if (u.origin === wp.origin) {
          const mapped = mapWpPath(u.pathname);
          if (mapped) {
            return { href: mapped, external: false };
          }
          return {
            href: `${localizedPath(locale, u.pathname)}${u.search}`,
            external: false,
          };
        }
      }
      return { href: url, external: true };
    } catch {
      return { href: url, external: true };
    }
  }

  return { href: homePath(locale), external: false };
}
