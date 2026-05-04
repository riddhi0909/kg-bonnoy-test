/**
 * Locales for static routing. Map to WordPress language codes.
 * @typedef {{ code: string; wpLocale: string; label: string }} LocaleDef
 */

/** @type {readonly LocaleDef[]} */
export const locales = Object.freeze([
  { code: "fr", wpLocale: "fr_FR", label: "Français" },
  { code: "de", wpLocale: "de_DE", label: "Deutsch" },
  { code: "en", wpLocale: "en_US", label: "English" },
  { code: "es", wpLocale: "es_ES", label: "Español" },
  { code: "it", wpLocale: "it_IT", label: "Italiano" },
  { code: "pt-br", wpLocale: "pt_BR", label: "Português (Brasil)" },
  { code: "zh-cn", wpLocale: "zh_CN", label: "简体中文" },
]);

export const defaultLocale = "fr";

/** @type {readonly string[]} */
export const localeCodes = Object.freeze(locales.map((l) => l.code));

/**
 * @param {string} code
 * @returns {LocaleDef | undefined}
 */
export function getLocaleDef(code) {
  return locales.find((l) => l.code === code);
}

/**
 * @param {string} pathname
 * @returns {string | null} locale segment if present
 */
export function pickLocaleFromPathname(pathname) {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg && localeCodes.includes(seg)) return seg;
  return null;
}
