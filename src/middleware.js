import { NextResponse } from "next/server";
import {
  defaultLocale,
  localeCodes,
  pickLocaleFromPathname,
} from "@/config/i18n";

const STATIC_PREFIXES = [
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/images",
  "/next.svg",
  "/vercel.svg",
  "/file.svg",
  "/globe.svg",
  "/window.svg",
];

function pathnameNeedsLocale(pathname) {
  if (pathname.startsWith("/api")) return false;
  if (STATIC_PREFIXES.some((p) => pathname.startsWith(p))) return false;
  if (/\.[a-zA-Z0-9]+$/.test(pathname.split("/").pop() || "")) return false;
  return !pickLocaleFromPathname(pathname);
}

/**
 * @param {import('next/server').NextRequest} request
 */
function preferredLocale(request) {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && localeCodes.includes(cookie)) return cookie;
  return defaultLocale;
}

/**
 * @param {import('next/server').NextRequest} request
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const incomingLocale = pickLocaleFromPathname(pathname);

  // Map legacy WP category URLs to storefront category pages.
  // /product-category/sourcing -> /category/sourcing
  // /product-category/parent/sourcing -> /category/sourcing (leaf slug matches Woo term)
  // /en/product-category/sourcing -> /en/category/sourcing
  {
    const parts = pathname.split("/").filter(Boolean);
    let locale = null;
    let i = 0;
    if (parts[0] && localeCodes.includes(parts[0])) {
      locale = parts[0];
      i = 1;
    }
    if (parts[i] === "product-category") {
      const after = parts.slice(i + 1);
      if (after.length > 0) {
        const slug = after[after.length - 1];
        const url = request.nextUrl.clone();
        const base =
          (locale && locale !== defaultLocale ? `/${locale}` : "") +
          `/category/${encodeURIComponent(slug)}`;
        url.pathname = base;
        url.search = "";
        return NextResponse.redirect(url);
      }
    }
  }

  
  // Keep default locale clean: /fr/... -> /...
  if (incomingLocale === defaultLocale) {
    const url = request.nextUrl.clone();
    const nextPath = pathname.replace(new RegExp(`^/${defaultLocale}`), "") || "/";
    url.pathname = nextPath;
    return NextResponse.redirect(url);
  }

  if (!pathnameNeedsLocale(pathname)) return NextResponse.next();

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  // Default locale uses clean URLs (no /fr prefix).
  if (locale === defaultLocale) {
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
