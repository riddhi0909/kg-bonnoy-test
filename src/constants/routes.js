import {
    defaultLocale
} from "@/config/i18n";

/**
 * Route path builders (locale-prefixed paths only, without domain).
 * @param {string} locale
 */

/**
 * Default locale has no prefix; non-default locales use /{locale}.
 * @param {string} locale
 * @param {string} path Path starting with "/"
 */
export function localizedPath(locale, path) {
    const clean = path.startsWith("/") ? path : `/${path}`;
    if (locale === defaultLocale) return clean;
    if (clean === "/") return `/${locale}`;
    return `/${locale}${clean}`;
}

export function homePath(locale) {
    return localizedPath(locale, "/");
}

export function productsPath(locale) {
    return localizedPath(locale, "/products");
}

export function categoriesIndexPath(locale) {
    return localizedPath(locale, "/category");
}

export function categoriesSubCategoryPath(locale, slug) {
    return localizedPath(locale, `/subcategory/${encodeURIComponent(slug)}`);
}

export function categoryPath(locale, slug) {
    return localizedPath(locale, `/category/${encodeURIComponent(slug)}`);
}


export function productPath(locale, slug) {
    return localizedPath(locale, `/products/${encodeURIComponent(slug)}`);
}

export function cartPath(locale) {
    return localizedPath(locale, "/cart");
}

export function checkoutPath(locale) {
    return localizedPath(locale, "/checkout");
}

export function loginPath(locale) {
    return localizedPath(locale, "/login");
}

export function registerPath(locale) {
    return localizedPath(locale, "/register");
}

export function accountPath(locale) {
    return localizedPath(locale, "/account");
}

export function blogPath(locale) {
    return localizedPath(locale, "/blog");
}

export function blogPostPath(locale, slug) {
    return localizedPath(locale, `/blog/${encodeURIComponent(slug)}`);
}
export function maisonBonnotPath(locale) {
    return localizedPath(locale, "/maison-bonnot");
}

export function surMesurePath(locale) {
    return localizedPath(locale, "/sur-mesure");
}

export function realisationsPath(locale) {
    return localizedPath(locale, "/realisations");
}

export function realisationsPostPath(locale, slug) {
    return localizedPath(locale, `/realisations/${encodeURIComponent(slug)}`);
}

/** @param {string | undefined} uri WordPress achievements post URI, e.g. /achievements-post/slug/ */
export function achievementSlugFromUri(uri) {
    const s = String(uri || "");
    const m = s.match(/achievements-post\/([^/?#]+)/i);
    return m ? decodeURIComponent(m[1]) : "";
}

export function bagueSurMesurePath(locale) {
    return localizedPath(locale, "/bague-sur-mesure");
}

export function investirPath(locale) {
    return localizedPath(locale, "/investir");
}

export function joaillierAngersPath(locale) {
    return localizedPath(locale, "/joaillier-angers");
}

export function generalTermsPath(locale) {  
    return localizedPath(locale, `/general-terms`);
}
export function termsOfUsePath(locale) {  
    return localizedPath(locale, `/terms-of-use`);
}
export function pressPath(locale) {  
    return localizedPath(locale, `/presse`);
}
export function joaillierParisPath(locale) {
    return localizedPath(locale, "/joaillier-paris");
}

export function journalPath(locale) {
    return localizedPath(locale, "/journal");
}

export function journalPostPath(locale, slug) {
    return localizedPath(locale, `/journal/${encodeURIComponent(slug)}`);
}


export function contactParisPath(locale) {
    return localizedPath(locale, "/contact-paris");
}
export function contactDistancePath(locale) {
    return localizedPath(locale, "/contact-distance");
}
export function contactInternationalPath(locale) {
    return localizedPath(locale, "/contact-international");
}
export function thankYouPath(locale) {
    return localizedPath(locale, "/thankyou");
}
