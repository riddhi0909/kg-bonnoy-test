import { parsePrice } from "@/modules/product/utils/parse-price";
import { matchesAttributeFacet } from "@/modules/category/utils/category-plp-attribute-facets";

/** @param {Record<string, unknown> | null | undefined} product */
function priceEuro(product) {
  const n =
    parsePrice(product?.salePrice) ||
    parsePrice(product?.regularPrice) ||
    parsePrice(product?.price);
  return n;
}

/** @param {Record<string, unknown> | null | undefined} product */
function caratFromProduct(product) {
  const name = String(product?.name ?? "");
  const m = name.match(/(\d+[,.]?\d*)\s*ct/i);
  if (!m) return null;
  const v = Number.parseFloat(String(m[1]).replace(",", "."));
  return Number.isFinite(v) ? v : null;
}

/** @param {string | null | undefined} bucket */
function matchesPrix(product, bucket) {
  if (!bucket) return true;
  const euro = priceEuro(product);
  switch (bucket) {
    case "<1":
      return euro < 1000;
    case "<2":
      return euro < 2000;
    case "<5":
      return euro < 5000;
    case "<10":
      return euro < 10000;
    case "<20":
      return euro < 20000;
    case "+20":
      return euro >= 20000;
    default:
      return true;
  }
}

/** @param {string | null | undefined} bucket */
function matchesPoids(product, bucket) {
  if (!bucket) return true;
  const ct = caratFromProduct(product);
  if (ct == null) return false;
  switch (bucket) {
    case "<1":
      return ct < 1;
    case "<2":
      return ct < 2;
    case "<5":
      return ct < 5;
    case "<10":
      return ct < 10;
    case "+10":
      return ct >= 10;
    default:
      return true;
  }
}

/**
 * Client-side PLP filter + sort (until API-backed filters exist).
 * @param {Record<string, unknown>[]} products
 * @param {{ sortBy?: string; prix?: string | null; poids?: string | null; forme?: string; clarte?: string; traitement?: string; origine?: string } | null | undefined} filters
 * @returns {Record<string, unknown>[]}
 */
export function applyCategoryPlpFilters(products, filters) {
  if (!filters) return [...products];

  const orderIndex = new Map();
  products.forEach((p, i) => {
    const k = p.id ?? p.databaseId ?? `idx-${i}`;
    if (!orderIndex.has(k)) orderIndex.set(k, i);
  });

  let list = products.filter(
    (p) =>
      matchesPrix(p, filters.prix) &&
      matchesPoids(p, filters.poids) &&
      matchesAttributeFacet(p, "forme", filters.forme) &&
      matchesAttributeFacet(p, "clarte", filters.clarte) &&
      matchesAttributeFacet(p, "traitement", filters.traitement) &&
      matchesAttributeFacet(p, "origine", filters.origine),
  );

  const sortBy = filters.sortBy ?? "best";

  if (sortBy === "new") {
    list.sort((a, b) => Number(b?.databaseId ?? 0) - Number(a?.databaseId ?? 0));
  } else if (sortBy === "asc") {
    list.sort((a, b) => {
      const d = priceEuro(a) - priceEuro(b);
      if (d !== 0) return d;
      return Number(a?.databaseId ?? 0) - Number(b?.databaseId ?? 0);
    });
  } else if (sortBy === "desc") {
    list.sort((a, b) => {
      const d = priceEuro(b) - priceEuro(a);
      if (d !== 0) return d;
      return Number(a?.databaseId ?? 0) - Number(b?.databaseId ?? 0);
    });
  } else {
    list.sort((a, b) => {
      const ka = a.id ?? a.databaseId;
      const kb = b.id ?? b.databaseId;
      const ia = orderIndex.has(ka) ? orderIndex.get(ka) : 99999;
      const ib = orderIndex.has(kb) ? orderIndex.get(kb) : 99999;
      return ia - ib;
    });
  }

  return list;
}

/**
 * @param {Record<string, unknown>[]} products
 * @param {string} query
 */
export function filterProductsByNameQuery(products, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) return [...products];
  return products.filter((p) => String(p?.name ?? "").toLowerCase().includes(q));
}

/**
 * Full filter object with defaults (for faceted counts).
 * @param {Record<string, unknown> | null | undefined} f
 */
export function normalizeCategoryPlpFilters(f) {
  return {
    sortBy: f?.sortBy ?? "best",
    prix: f?.prix ?? null,
    poids: f?.poids ?? null,
    forme: f?.forme ?? "",
    clarte: f?.clarte ?? "",
    traitement: f?.traitement ?? "",
    origine: f?.origine ?? "",
  };
}

/**
 * How many products match `draftFilters` with one facet temporarily replaced
 * (omit that facet from draft, then apply `override`). Uses same rules as `applyCategoryPlpFilters`.
 * @param {Record<string, unknown>[]} baseProducts Already search-filtered catalog.
 * @param {Record<string, unknown> | null | undefined} draftFilters
 * @param {"prix"|"poids"|"forme"|"clarte"|"traitement"|"origine"} omitFacet
 * @param {Record<string, unknown>} override Partial filter fields to set for this count.
 */
export function countMatchingWithFacetOverride(baseProducts, draftFilters, omitFacet, override) {
  const norm = normalizeCategoryPlpFilters(draftFilters);
  if (omitFacet === "prix") norm.prix = null;
  if (omitFacet === "poids") norm.poids = null;
  if (omitFacet === "forme") norm.forme = "";
  if (omitFacet === "clarte") norm.clarte = "";
  if (omitFacet === "traitement") norm.traitement = "";
  if (omitFacet === "origine") norm.origine = "";
  return applyCategoryPlpFilters(baseProducts, { ...norm, ...override }).length;
}
