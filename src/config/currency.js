/**
 * Base store currency from WooCommerce (adjust to your catalog currency).
 * Rates are multipliers from base → target (example static table; swap for API).
 */

export const BASE_CURRENCY = "EUR";

/** @type {readonly string[]} */
export const supportedCurrencies = Object.freeze([
  "EUR",
  "USD",
]);

/**
 * Multiplier: 1 BASE_CURRENCY = rate * TARGET
 * @type {Record<string, number>}
 */
export const staticRatesFromBase = Object.freeze({
  EUR: 1,
  USD: 1.08,
});

/**
 * @param {string} code
 * @returns {boolean}
 */
export function isSupportedCurrency(code) {
  return supportedCurrencies.includes(code);
}
