import { localizedPath } from "@/constants/routes";

/** @param {string} locale */
export function ordersPath(locale) {
  return localizedPath(locale, "/account/orders");
}
