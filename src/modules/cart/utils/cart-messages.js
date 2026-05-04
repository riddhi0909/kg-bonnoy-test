/**
 * WooCommerce / GraphQL cart errors sometimes include HTML (links, entities).
 * @param {string} raw
 */
export function stripCartMessage(raw) {
  if (!raw) return "";
  let s = String(raw);
  s = s.replace(/<[^>]+>/g, " ");
  s = s
    .replace(/&mdash;/gi, "—")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
  return s.replace(/\s+/g, " ").trim();
}

/**
 * @param {unknown} err
 */
export function errorToCartMessage(err) {
  if (!err) return "Impossible d'ajouter au panier.";
  const g = err.graphQLErrors?.[0];
  if (g?.message) return stripCartMessage(g.message);
  if (typeof err.message === "string" && err.message) return stripCartMessage(err.message);
  return "Impossible d'ajouter au panier.";
}
