import {
  GET_PRODUCTS_BY_CATEGORY_ID,
  GET_CATEGORY_PRODUCTS_BY_WHERE,
  GET_CATEGORY_WITH_PRODUCTS,
  GET_PRODUCT_CATEGORIES,
  GET_GLOBAL_ACF_FIELDS,
  GET_PLP_TERMS_PA_CLARTE,
  GET_PLP_TERMS_PA_FORME,
  GET_PLP_TERMS_PA_ORIGINE,
  GET_PLP_TERMS_PA_TRAITEMENT,
  GET_PLP_PRODUCTS_ATTRIBUTE_AGGREGATE,
} from "@/modules/category/api/queries";
import {
  PLP_ATTRIBUTE_FACETS,
  aggregateAttributeCountsFromProducts,
  createEmptyPlpAttributeStore,
  ingestTermsNodesForFacet,
} from "@/modules/category/utils/category-plp-attribute-facets";
/**
 * WPGraphQL ACF: field group "Category ACF Fields" → `categoryAcfFields` when GraphQL Type Name is `CategoryAcfFields`.
 * Repeater `faq` subfields should match schema (defaults: question, answer — same as theme global FAQ).
 * @param {Record<string, unknown> | null | undefined} category
 * @returns {{ faqTitle: string | null; faqItems: Array<{ title: string; body: string; imageUrl?: string; imageAlt?: string; buttonLabel?: string; buttonHref?: string; buttonTarget?: string }> }}
 */
export function mapCategoryFaqForSection(category) {
  const acf = category?.categoryAcfFields ?? null;
  const rows = Array.isArray(acf?.faq) ? acf.faq : [];
  const faqItems = rows
    .map((row) => {
      const title = typeof row?.question === "string" ? row.question.trim() : "";
      let body = "";
      if (typeof row?.answer === "string") {
        body = row.answer.trim();
      }
      const imageUrl = String(row?.faqImage?.node?.sourceUrl ?? "").trim();
      const imageAlt = String(row?.faqImage?.node?.altText ?? "").trim();
      const buttonLabel = String(row?.faqButtonLink?.title ?? "").trim();
      const buttonHref = String(row?.faqButtonLink?.url ?? "").trim();
      const buttonTarget = String(row?.faqButtonLink?.target ?? "").trim();
      return { title, body, imageUrl, imageAlt, buttonLabel, buttonHref, buttonTarget };
    })
    .filter((row) => row.title || row.body);
  const faqTitle =
    typeof acf?.faqTitle === "string" && acf.faqTitle.trim() ? acf.faqTitle.trim() : null;
  return { faqTitle, faqItems };
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {{ first?: number; after?: string | null; all?: boolean; hideEmpty?: boolean }} vars
 * @param {boolean} [vars.all] If true, paginate until every category is loaded (homepage rail).
 */
export async function fetchProductCategories(client, vars = {}) {
  const pageSize = Math.min(100, Math.max(1, vars.first ?? 50));
  const hideEmpty = vars.hideEmpty ?? true;

  if (!vars.all) {
    const { data, errors } = await client.query({
      query: GET_PRODUCT_CATEGORIES,
      variables: { first: pageSize, after: vars.after ?? null, hideEmpty },
      fetchPolicy: "no-cache",
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    return data?.productCategories?.nodes ?? [];
  }

  const out = [];
  let after = null;
  let guard = 0;
  const maxPages = 50;
  while (guard < maxPages) {
    guard += 1;
    const { data, errors } = await client.query({
      query: GET_PRODUCT_CATEGORIES,
      variables: { first: pageSize, after, hideEmpty },
      fetchPolicy: "no-cache",
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    const conn = data?.productCategories;
    const batch = conn?.nodes ?? [];
    out.push(...batch);
    if (!conn?.pageInfo?.hasNextPage || !conn.pageInfo.endCursor) break;
    after = conn.pageInfo.endCursor;
  }
  return out;
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} slug
 * @param {{ first?: number }} [vars]
 */
export async function fetchCategoryWithProducts(client, slug, vars = {}) {
  const first = vars.first ?? 24;

  // 1) Resolve category node by slug.
  let category = null;
  try {
    const { data, errors } = await client.query({
      query: GET_CATEGORY_WITH_PRODUCTS,
      variables: {
        id: slug,
      },
      fetchPolicy: "no-cache",
    });

    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    category = data?.productCategory ?? null;
  } catch {
    category = null;
  }

  if (!category) return null;

  // 2) Strict product filtering by category database ID.
  try {
    const { data, errors } = await client.query({
      query: GET_PRODUCTS_BY_CATEGORY_ID,
      variables: {
        categoryId: Number(category.databaseId),
        first,
      },
      fetchPolicy: "no-cache",
    });

    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    return {
      ...category,
      products: {
        nodes: data?.products?.nodes ?? [],
      },
    };
  } catch {
    // 3) Fallback for schemas that only support where.category by slug.
    const { data, errors } = await client.query({
      query: GET_CATEGORY_PRODUCTS_BY_WHERE,
      variables: {
        slug,
        first,
      },
      fetchPolicy: "no-cache",
    });

    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    return {
      ...category,
      products: {
        nodes: data?.products?.nodes ?? [],
      },
    };
  }
}

const PLP_TERM_QUERIES = [
  { facetKey: "forme", query: GET_PLP_TERMS_PA_FORME },
  { facetKey: "clarte", query: GET_PLP_TERMS_PA_CLARTE },
  { facetKey: "traitement", query: GET_PLP_TERMS_PA_TRAITEMENT },
  { facetKey: "origine", query: GET_PLP_TERMS_PA_ORIGINE },
];

/**
 * WooCommerce attribute term counts for PLP filters.
 * 1) Tries `terms` per `pa_*` taxonomy (same totals as WP admin when `count` is exposed).
 * 2) Falls back to aggregating `products(first: …)` attributes (bounded, not full catalog).
 * @param {import('@apollo/client').ApolloClient} client
 */
export async function fetchPlpProductAttributeTerms(client) {
  const store = createEmptyPlpAttributeStore();
  let gotAnyTerms = false;
  for (const { facetKey, query } of PLP_TERM_QUERIES) {
    try {
      const { data, errors } = await client.query({
        query,
        fetchPolicy: "no-cache",
      });
      if (errors?.length) continue;
      const nodes = data?.terms?.nodes;
      if (Array.isArray(nodes) && nodes.length > 0) {
        ingestTermsNodesForFacet(store, facetKey, nodes);
        gotAnyTerms = true;
      }
    } catch {
      /* try next taxonomy */
    }
  }

  try {
    const { data, errors } = await client.query({
      query: GET_PLP_PRODUCTS_ATTRIBUTE_AGGREGATE,
      variables: { first: 400 },
      fetchPolicy: "no-cache",
    });
    if (errors?.length) {
      return gotAnyTerms ? store : null;
    }
    const aggregateStore = aggregateAttributeCountsFromProducts(data?.products?.nodes ?? []);
    if (!gotAnyTerms) return aggregateStore;

    // Keep exact taxonomy counts when available; backfill missing facets from aggregate fallback.
    for (const facet of PLP_ATTRIBUTE_FACETS) {
      const key = facet.key;
      const hasTerms = (store.termRowsByFacet[key] ?? []).length > 0;
      if (!hasTerms) {
        store.termRowsByFacet[key] = aggregateStore.termRowsByFacet[key] ?? [];
        store.countsByFacet[key] = aggregateStore.countsByFacet[key] ?? {};
      }
    }
    return store;
  } catch {
    return gotAnyTerms ? store : null;
  }
}
export async function fetchGlobalAcfFields(client) {
  const { data, errors } = await client.query({
    query: GET_GLOBAL_ACF_FIELDS,
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  const ts = data?.themeSettings;
  if (!ts) return null;
  const block = ts.categoryPostBlock;
  const global = ts.globalAcfFields;
  return {
    ...(global && typeof global === "object" ? global : {}),
    ...(block
      ? {
          showCategoryPostBlockSection: block.showCategoryPostBlockSection,
          categoryPostBlock: block.categoryPostBlock,
        }
      : {}),
  };
}

/** ACF radio/boolean: section only when explicitly enabled. */
function isAcfYes(value) {
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "yes" || v === "1" || v === "oui" || v === "true";
  }
  return false;
}

/**
 * Theme Settings (ACF): "Category Image With Text" / sourcing fields on globalAcfFields.
 * @param {Record<string, unknown> | null | undefined} mergedThemeFields — return value of fetchGlobalAcfFields
 */
export function mapThemeSourcingForFaqSection(mergedThemeFields) {
  const g = mergedThemeFields ?? {};

  const visible = isAcfYes(g.showImageWithTextSection);

  const imgNode = g.sourcingImage?.node;
  const imageUrl = typeof imgNode?.sourceUrl === "string" ? imgNode.sourceUrl : "";
  const imageAlt = typeof imgNode?.altText === "string" ? imgNode.altText : "";

  const eyebrow =
    typeof g.sourcingSubTitle === "string" && g.sourcingSubTitle.trim()
      ? g.sourcingSubTitle.trim()
      : null;
  const title =
    typeof g.sourcingTitle === "string" && g.sourcingTitle.trim()
      ? g.sourcingTitle.trim()
      : null;
  const descriptionHtml =
    typeof g.sourcingDescription === "string" && g.sourcingDescription.trim()
      ? g.sourcingDescription.trim()
      : null;
  const buttonLabel =
    typeof g.sourcingButtonTitle === "string" && g.sourcingButtonTitle.trim()
      ? g.sourcingButtonTitle.trim()
      : null;
  const buttonHref =
    typeof g.sourcingButtonUrl === "string" && g.sourcingButtonUrl.trim()
      ? g.sourcingButtonUrl.trim()
      : null;

  const showIconWithTextSection = isAcfYes(g.showIconWithTextSection);
  const rawIconRows = g.iconWithText;
  const iconWithText = Array.isArray(rawIconRows) ? rawIconRows : [];

  return {
    visible,
    eyebrow,
    title,
    descriptionHtml,
    buttonLabel,
    buttonHref,
    imageUrl: imageUrl || null,
    imageAlt: imageAlt || null,
    showIconWithTextSection,
    iconWithText,
  };
}