import {
  GET_PRODUCT_BY_SLUG,
  GET_PRODUCTS,
  GET_PRODUCTS_FOR_SHAPE_OPTIONS,
  GET_PRODUCT_GLOBAL_SETTINGS,
  GET_PRODUCT_PAGE_THEME_AND_STORIES,
  GET_SHAPE_ATTRIBUTE_TERMS,
} from "@/modules/product/api/queries";

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {{ first?: number; after?: string | null }} vars
 */
export async function fetchProducts(client, vars = {}) {
  const { data, errors } = await client.query({
    query: GET_PRODUCTS,
    variables: {
      first: vars.first ?? 12,
      after: vars.after ?? null,
    },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.products ?? { nodes: [], pageInfo: {} };
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} slug
 */
export async function fetchProductBySlug(client, slug) {
  const { data, errors } = await client.query({
    query: GET_PRODUCT_BY_SLUG,
    variables: { id: slug },
    fetchPolicy: "no-cache",
  });


  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.product ?? null;
}

/**
 * @param {object | null | undefined} globalFields
 * @returns {{ accordionItems: Array, productDescriptionLinks: Array, founderSection: object | null, icaSection: object | null }}
 */
function mapThemeGlobalAcfToProductSettings(globalFields) {
  const faqItems = globalFields?.faq ?? [];
  const showProfile = globalFields?.showProfileSection;
  const rawProductDescriptionLinks =
    globalFields?.productDescriptionLink ??
    globalFields?.product_description_link ??
    [];
  const productDescriptionLinks = Array.isArray(rawProductDescriptionLinks)
    ? rawProductDescriptionLinks
        .map((item) => {
          const rawLink =
            item?.productDescriptionTextLink ??
            item?.product_description_text_link ??
            "";
          const linkUrl =
            typeof rawLink === "string"
              ? rawLink
              : typeof rawLink?.url === "string"
                ? rawLink.url
                : "";
          const linkTarget =
            typeof rawLink === "object" && rawLink && typeof rawLink.target === "string"
              ? rawLink.target
              : "";

          return {
            productDescriptionTitle:
              item?.productDescriptionTitle ??
              item?.product_description_title ??
              "",
            productDescriptionTextLink: linkUrl,
            productDescriptionTextTarget: linkTarget,
          };
        })
        .filter(
          (item) =>
            typeof item.productDescriptionTitle === "string" &&
            item.productDescriptionTitle.trim().length > 0,
        )
    : [];
  return {
    accordionItems: faqItems.map((item) => ({
      title: item.question ?? "",
      body: item.answer ?? "",
    })),
    productDescriptionLinks,
    founderSection: showProfile
      ? {
          image: globalFields.profileImage?.node?.sourceUrl ?? null,
          imageAlt: globalFields.profileImage?.node?.altText ?? "",
          title: globalFields.profileTitle ?? "",
          description: globalFields.profileDescription ?? "",
          linkText: globalFields.profileButtonTitle ?? "",
          linkUrl: globalFields.profileButtonLink ?? "",
        }
      : null,
    icaSection: {
      image: globalFields?.icaImage?.node?.sourceUrl ?? null,
      title: globalFields?.icaTitle ?? "",
      description: globalFields?.icaDescription ?? "",
    },
  };
}

/**
 * Fetch product global settings from ACF Theme Settings
 * @param {import('@apollo/client').ApolloClient} client
 * * @returns {Promise<{ accordionItems: Array, productDescriptionLinks: Array, founderSection: object | null, icaSection: object | null }>}
 */
export async function fetchProductGlobalSettings(client) {
  const { data, errors } = await client.query({
    query: GET_PRODUCT_GLOBAL_SETTINGS,
    fetchPolicy: "no-cache",
  });

  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return mapThemeGlobalAcfToProductSettings(data?.themeSettings?.globalAcfFields);
}

/**
 * Single query: theme global ACF + homepage stories fields (replaces separate global + full GET_HOME_OPTIONS on PDP).
 * @param {import('@apollo/client').ApolloClient} client
 * @returns {Promise<{ globalSettings: object; homeHomepageAcfFields: object | null }>}
 */
export async function fetchProductPageThemeAndStories(client) {
  const { data, errors } = await client.query({
    query: GET_PRODUCT_PAGE_THEME_AND_STORIES,
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return {
    globalSettings: mapThemeGlobalAcfToProductSettings(data?.themeSettings?.globalAcfFields),
    homeHomepageAcfFields: data?.homeSettings?.homepageAcfFields ?? null,
  };
}

function normalizeShapeKey(raw) {
  const base = String(raw ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (base === "oval" || base === "ovale") return "ovale";
  if (base === "round" || base === "rond" || base === "brillant") return "rond";
  if (base === "cushion" || base === "coussin") return "coussin";
  if (base === "rectangle" || base === "rectangulaire") return "rectangle";
  if (base === "pear" || base === "poire") return "poire";
  return base;
}

function normalizeAttributeKey(raw) {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^pa_/, "")
    .replace(/[_\s-]+/g, "");
}

function isShapeAttribute(node) {
  const keys = [
    normalizeAttributeKey(node?.name),
    normalizeAttributeKey(node?.slug),
    normalizeAttributeKey(node?.label),
  ];
  return keys.some((key) => key === "shape" || key === "forme");
}

/**
 * Fetch all configured Shape terms from WooCommerce attributes, including empty terms.
 * Returns [] safely if schema/plugin does not expose this query.
 * @param {import('@apollo/client').ApolloClient} client
 */
export async function fetchShapeAttributeTerms(client) {
  const pushUnique = (target, seen, labelRaw) => {
    const label = String(labelRaw ?? "").trim();
    if (!label) return;
    const key = normalizeShapeKey(label);
    if (!key || seen.has(key)) return;
    seen.add(key);
    target.push({ key, label });
  };

  try {
    const { data, errors } = await client.query({
      query: GET_SHAPE_ATTRIBUTE_TERMS,
      fetchPolicy: "no-cache",
    });
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    const attrs = Array.isArray(data?.productAttributes?.nodes)
      ? data.productAttributes.nodes
      : [];
    const shapeAttr = attrs.find(isShapeAttribute);
    if (!shapeAttr) throw new Error("Shape attribute not found in productAttributes");
    const terms = Array.isArray(shapeAttr?.terms?.nodes) ? shapeAttr.terms.nodes : [];
    const out = [];
    const seen = new Set();
    for (const term of terms) {
      pushUnique(out, seen, term?.name);
    }
    if (out.length > 0) return out;
  } catch {}

  try {
    const { data, errors } = await client.query({
      query: GET_PRODUCTS_FOR_SHAPE_OPTIONS,
      variables: { first: 80 },
      fetchPolicy: "no-cache",
    });
    if (errors?.length) return [];
    const nodes = Array.isArray(data?.products?.nodes) ? data.products.nodes : [];
    const out = [];
    const seen = new Set();
    for (const product of nodes) {
      const attrs = Array.isArray(product?.attributes?.nodes) ? product.attributes.nodes : [];
      for (const attr of attrs) {
        const keyName = normalizeAttributeKey(attr?.name);
        const keyLabel = normalizeAttributeKey(attr?.label);
        if (keyName !== "shape" && keyName !== "forme" && keyLabel !== "shape" && keyLabel !== "forme") {
          continue;
        }
        const options = Array.isArray(attr?.options) ? attr.options : [];
        for (const option of options) pushUnique(out, seen, option);
      }
    }
    return out;
  } catch {
    return [];
  }
}
