/**
 * PLP facets mapped to WooCommerce global attributes (WP Admin → Produits → Attributs).
 * `nameHints` match GraphQL `attributes.nodes[].name` / `.label` (slug or label, FR/EN).
 * @see https://woocommerce.com/document/managing-product-taxonomies/
 */

/** @type {{ key: string; label: string; nameHints: string[]; fallbackOptions?: string[] }[]} */
export const PLP_ATTRIBUTE_FACETS = [
  {
    key: "forme",
    label: "Forme",
    nameHints: ["forme", "shape", "coupe", "taille", "pa_forme", "pa_shape", "gemshape"],
    fallbackOptions: ["Oval", "Round", "Rectangle", "Cushion", "Pear", "Square"],
  },
  {
    key: "clarte",
    label: "Clarté",
    nameHints: ["clarte", "clarity", "purete", "pa_clarte", "pa_clarity", "grade", "inclusion"],
    fallbackOptions: ["Eye Clean", "Slightly Included", "Minor Oil"],
  },
  {
    key: "traitement",
    label: "Traitement",
    nameHints: ["traitement", "treatment", "pa_traitement", "pa_treatment", "heat", "chauffe"],
    fallbackOptions: ["No Heat", "Heated"],
  },
  {
    key: "origine",
    label: "Origine",
    nameHints: ["origine", "origin", "provenance", "pays", "pa_origine", "pa_origin", "country"],
    fallbackOptions: ["Madagascar", "Sri Lanka", "Tanzania", "Zambia", "Colombia"],
  },
];

/** @param {unknown} s */
function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_-]/g, "");
}

/** @param {unknown} s */
function normOpt(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Exported for store count keys (matches product option strings case-insensitively). */
export function normalizePlpFacetOptionKey(s) {
  return normOpt(s);
}

/**
 * @param {Record<string, unknown> | null | undefined} node
 * @param {string[]} hints
 */
function nodeMatchesHints(node, hints) {
  const nn = norm(node?.name);
  const nl = norm(node?.label);
  for (const raw of hints) {
    const hn = norm(raw);
    if (!hn) continue;
    if (nn === hn || nl === hn) return true;
    if (hn.length >= 3 && (nn.includes(hn) || nl.includes(hn))) return true;
  }
  return false;
}

/** @param {Record<string, unknown> | null | undefined} product */
function textBlobFallback(product) {
  const parts = [product?.name, product?.shortDescription];
  const attrs = product?.attributes?.nodes ?? [];
  for (const a of attrs) {
    if (a?.label) parts.push(a.label);
    if (a?.name) parts.push(a.name);
    const opts = a?.options;
    if (Array.isArray(opts)) parts.push(...opts);
  }
  return parts.filter(Boolean).join(" ").toLowerCase();
}

/**
 * @param {Record<string, unknown> | null | undefined} product
 * @param {string} facetKey
 * @returns {Record<string, unknown> | null}
 */
/**
 * Match a `productAttributes` node (GraphQL) to a PLP facet key.
 * @param {Record<string, unknown> | null | undefined} attrNode
 * @returns {string | null}
 */
export function matchFacetKeyForGraphqlAttribute(attrNode) {
  for (const f of PLP_ATTRIBUTE_FACETS) {
    if (nodeMatchesHints(attrNode, f.nameHints)) return f.key;
  }
  return null;
}

export function findAttributeNodeForFacet(product, facetKey) {
  const cfg = PLP_ATTRIBUTE_FACETS.find((f) => f.key === facetKey);
  if (!cfg) return null;
  const nodes = product?.attributes?.nodes ?? [];
  for (const node of nodes) {
    if (node && nodeMatchesHints(node, cfg.nameHints)) return node;
  }
  return null;
}

/**
 * Unique option labels for a facet, sorted (fr), from the given product list.
 * @param {Record<string, unknown>[]} products
 * @param {string} facetKey
 */
export function collectFacetOptionValues(products, facetKey) {
  const seen = new Map();
  for (const p of products) {
    const node = findAttributeNodeForFacet(p, facetKey);
    if (!node) continue;
    const opts = node.options;
    if (!Array.isArray(opts)) continue;
    for (const raw of opts) {
      const t = String(raw).trim();
      if (!t) continue;
      const k = normOpt(t);
      if (!seen.has(k)) seen.set(k, t);
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
}

/**
 * Whether `product` matches selected facet value (exact term on the mapped attribute, or title fallback).
 * @param {Record<string, unknown> | null | undefined} product
 * @param {string} facetKey
 * @param {string | null | undefined} selectedValue
 */
export function matchesAttributeFacet(product, facetKey, selectedValue) {
  if (!selectedValue) return true;
  const node = findAttributeNodeForFacet(product, facetKey);
  const want = normOpt(selectedValue);
  if (!want) return true;
  if (node && Array.isArray(node.options)) {
    const hit = node.options.some((o) => normOpt(o) === want);
    if (hit) return true;
  }
  return textBlobFallback(product).includes(String(selectedValue).trim().toLowerCase());
}

/**
 * Maps `productAttributes { nodes { terms { nodes { name slug count }}}}` to facet maps.
 * Counts match WooCommerce admin “Total” (all products), not the current PLP slice.
 * @param {{ nodes?: unknown[] } | null | undefined} productAttributesConnection
 * @returns {{ countsByFacet: Record<string, Record<string, number>>; termRowsByFacet: Record<string, { name: string; slug: string; count: number }[]> } | null}
 */
export function mapProductAttributesToPlpStoreData(productAttributesConnection) {
  const nodes = productAttributesConnection?.nodes;
  if (!Array.isArray(nodes)) return null;

  /** @type {Record<string, Record<string, number>>} */
  const countsByFacet = {};
  /** @type {Record<string, { name: string; slug: string; count: number }[]>} */
  const termRowsByFacet = {};
  for (const f of PLP_ATTRIBUTE_FACETS) {
    countsByFacet[f.key] = {};
    termRowsByFacet[f.key] = [];
  }

  for (const attr of nodes) {
    const facetKey = matchFacetKeyForGraphqlAttribute(attr);
    if (!facetKey) continue;
    const tnodes = attr?.terms?.nodes;
    if (!Array.isArray(tnodes)) continue;
    for (const t of tnodes) {
      const rawCount = t?.count;
      const count = typeof rawCount === "number" && Number.isFinite(rawCount) ? rawCount : Number(rawCount) || 0;
      const name = String(t?.name ?? "").trim();
      const slug = String(t?.slug ?? "").trim();
      if (name) countsByFacet[facetKey][normOpt(name)] = count;
      if (slug) countsByFacet[facetKey][normOpt(slug)] = count;
      termRowsByFacet[facetKey].push({
        name: name || slug,
        slug: slug || normOpt(name),
        count,
      });
    }
  }

  for (const f of PLP_ATTRIBUTE_FACETS) {
    termRowsByFacet[f.key].sort((a, b) =>
      a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
    );
  }

  return { countsByFacet, termRowsByFacet };
}

/** @returns {{ countsByFacet: Record<string, Record<string, number>>; termRowsByFacet: Record<string, { name: string; slug: string; count: number }[]> }} */
export function createEmptyPlpAttributeStore() {
  /** @type {Record<string, Record<string, number>>} */
  const countsByFacet = {};
  /** @type {Record<string, { name: string; slug: string; count: number }[]>} */
  const termRowsByFacet = {};
  for (const f of PLP_ATTRIBUTE_FACETS) {
    countsByFacet[f.key] = {};
    termRowsByFacet[f.key] = [];
  }
  return { countsByFacet, termRowsByFacet };
}

/**
 * Fill one facet from WPGraphQL `terms { nodes { name slug count } }` (taxonomy `pa_*`).
 * @param {{ countsByFacet: Record<string, Record<string, number>>; termRowsByFacet: Record<string, { name: string; slug: string; count: number }[]> }} store
 * @param {string} facetKey
 * @param {unknown[] | null | undefined} nodes
 */
export function ingestTermsNodesForFacet(store, facetKey, nodes) {
  if (!store?.countsByFacet?.[facetKey]) return;
  if (!Array.isArray(nodes) || nodes.length === 0) return;
  store.countsByFacet[facetKey] = {};
  store.termRowsByFacet[facetKey] = [];
  for (const t of nodes) {
    const rawCount = t?.count;
    const count = typeof rawCount === "number" && Number.isFinite(rawCount) ? rawCount : Number(rawCount) || 0;
    const name = String(t?.name ?? "").trim();
    const slug = String(t?.slug ?? "").trim();
    if (name) store.countsByFacet[facetKey][normalizePlpFacetOptionKey(name)] = count;
    if (slug) store.countsByFacet[facetKey][normalizePlpFacetOptionKey(slug)] = count;
    store.termRowsByFacet[facetKey].push({
      name: name || slug,
      slug: slug || name,
      count,
    });
  }
  store.termRowsByFacet[facetKey].sort((a, b) =>
    a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
  );
}

/**
 * Approximate store counts from a product list (max `first` products). Use when `terms` / `productAttributes` are unavailable.
 * @param {Record<string, unknown>[]} products
 */
export function aggregateAttributeCountsFromProducts(products) {
  const store = createEmptyPlpAttributeStore();
  /** @type {Record<string, Map<string, { display: string; n: number }>>} */
  const acc = {};
  for (const f of PLP_ATTRIBUTE_FACETS) {
    acc[f.key] = new Map();
  }
  for (const p of products) {
    for (const f of PLP_ATTRIBUTE_FACETS) {
      const node = findAttributeNodeForFacet(p, f.key);
      if (!node || !Array.isArray(node.options)) continue;
      const seen = new Set();
      for (const raw of node.options) {
        const t = String(raw).trim();
        if (!t) continue;
        const k = normalizePlpFacetOptionKey(t);
        if (seen.has(k)) continue;
        seen.add(k);
        const cur = acc[f.key].get(k) ?? { display: t, n: 0 };
        cur.n += 1;
        if (!cur.display) cur.display = t;
        acc[f.key].set(k, cur);
      }
    }
  }
  for (const f of PLP_ATTRIBUTE_FACETS) {
    for (const [k, { display, n }] of acc[f.key]) {
      store.countsByFacet[f.key][k] = n;
      store.termRowsByFacet[f.key].push({ name: display, slug: k, count: n });
    }
    store.termRowsByFacet[f.key].sort((a, b) =>
      a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
    );
  }
  return store;
}
