/**
 * @typedef {Object} PublicEnv
 * @property {string} siteUrl
 * @property {string} wpGraphqlUrl Public endpoint when not using proxy (dev only)
 * @property {boolean} useGraphqlProxy Prefer /api/graphql in browser
 */

/** @returns {PublicEnv} */
export function getPublicEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    wpGraphqlUrl:
      process.env.NEXT_PUBLIC_WPGRAPHQL_URL || "http://localhost/graphql",
    useGraphqlProxy:
      (process.env.NEXT_PUBLIC_USE_GRAPHQL_PROXY || "true") === "true",
  };
}

/**
 * Server-only WPGraphQL URL (direct to WordPress).
 * @returns {string}
 */
export function getServerWpGraphqlUrl() {
  return (
    process.env.WPGRAPHQL_URL ||
    process.env.NEXT_PUBLIC_WPGRAPHQL_URL ||
    "http://localhost/graphql"
  );
}

/**
 * WordPress front-end origin (for rewriting menu URLs to Next locale paths).
 * @returns {string} e.g. https://bonotnew.getkgkrunch.com
 */
export function getWpOrigin() {
  const explicit = process.env.NEXT_PUBLIC_WP_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const gql = getServerWpGraphqlUrl();
  try {
    return new URL(gql).origin;
  } catch {
    return "";
  }
}
