/**
 * Parse WooCommerce price strings like "19.99", "1 999,00 €", or "".
 * @param {string | number | null | undefined} raw
 * @returns {number}
 */
export function parsePrice(raw) {
  if (raw == null || raw === "") return 0;
  const only = String(raw).replace(/[^0-9,.-]/g, "");
  const normalized =
    only.includes(",") && only.includes(".")
      ? only.replace(/,/g, "")
      : only.replace(",", ".");
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

function normalizeMetaKey(raw) {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/^_+/, "");
}

function getLocaleMetaKeyCandidates(locale, fallbackCountry = "fr") {
  const lc = String(locale ?? "").trim().toLowerCase();
  const clean = lc.replace("_", "-");
  const [language = "", region = ""] = clean.split("-");
  const candidates = [];
  if (region) candidates.push(`price_ttc_${region}`);
  if (language) candidates.push(`price_ttc_${language}`);
  if (fallbackCountry) candidates.push(`price_ttc_${String(fallbackCountry).toLowerCase()}`);
  candidates.push("price_ttc");
  return Array.from(new Set(candidates));
}

/**
 * Resolve locale/country specific VAT-inclusive meta price.
 * Current priority keeps France as default, while allowing future country keys.
 * @param {object} product
 * @param {{ locale?: string; fallbackCountry?: string }} [options]
 * @returns {string}
 */
export function getProductTtcMetaPriceRaw(product, options = {}) {
  const meta = Array.isArray(product?.metaData) ? product.metaData : [];
  if (meta.length === 0) return "";
  const keys = getLocaleMetaKeyCandidates(options.locale, options.fallbackCountry ?? "fr");

  for (const key of keys) {
    const keyNorm = normalizeMetaKey(key);
    const hit = meta.find((item) => normalizeMetaKey(item?.key) === keyNorm);
    const value = String(hit?.value ?? "").trim();
    if (value !== "") return value;
  }
  return "";
}

/**
 * Resolve product raw price with TTC-meta priority and safe fallbacks.
 * @param {object} product
 * @param {{ locale?: string; fallbackCountry?: string; overrideRawPrice?: string | null | undefined }} [options]
 * @returns {string}
 */
export function resolveProductPriceRaw(product, options = {}) {
  const overrideRaw = String(options.overrideRawPrice ?? "").trim();
  if (overrideRaw) return overrideRaw;

  const ttcRaw = getProductTtcMetaPriceRaw(product, options);
  if (ttcRaw) return ttcRaw;

  const saleRaw = String(product?.salePrice ?? "").trim();
  if (saleRaw) return saleRaw;
  const priceRaw = String(product?.price ?? "").trim();
  if (priceRaw) return priceRaw;
  const regularRaw = String(product?.regularPrice ?? "").trim();
  if (regularRaw) return regularRaw;
  return "0";
}

/**
 * Resolve displayable numeric price with TTC-meta priority.
 * @param {object} product
 * @param {{ locale?: string; fallbackCountry?: string; overrideRawPrice?: string | null | undefined }} [options]
 * @returns {number}
 */
export function resolveProductPriceNumber(product, options = {}) {
  return parsePrice(resolveProductPriceRaw(product, options));
}
