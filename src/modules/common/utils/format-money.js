/**
 * @param {number} amount
 * @param {string} currency ISO 4217
 * @param {string} [locale]
 * @param {Intl.NumberFormatOptions} [intlOptions] merged into defaults (e.g. `{ minimumFractionDigits: 0 }` for whole units)
 */
export function formatMoney(amount, currency, locale = "en-US", intlOptions = {}) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...intlOptions,
  }).format(amount);
}

/**
 * Currency symbol immediately before the amount (e.g. €3 006 vs 3 006 € for fr-FR).
 * @param {Intl.NumberFormatOptions} [intlOptions]
 */
export function formatMoneySymbolFirst(amount, currency, locale = "en-US", intlOptions = {}) {
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...intlOptions,
  }).formatToParts(amount);
  let symbol = "";
  const rest = [];
  for (const p of parts) {
    if (p.type === "currency") symbol = p.value.trim();
    else rest.push(p.value);
  }
  const numStr = rest.join("").trim();
  if (!symbol) return numStr;
  return `${symbol}${numStr}`;
}
