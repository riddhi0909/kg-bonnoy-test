import { notFound } from "next/navigation";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getClient } from "@/apollo/register-client";
import { getPublicEnv } from "@/config/env";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { productJsonLd } from "@/lib/seo/json-ld";
import { GET_CATEGORY_PRODUCTS_BY_WHERE } from "@/modules/category/api/queries";

import {
  fetchProductBySlug,
  fetchProducts,
  fetchProductPageThemeAndStories,
  fetchShapeAttributeTerms,
} from "@/modules/product/services/product-service";
import { ProductPageShell } from "@/modules/product/components/ProductPageShell";
import { productPath } from "@/constants/routes";
import { resolveProductPriceNumber } from "@/modules/common/utils/price";

function pickByPrefixes(source, prefixes) {
  if (!source || typeof source !== "object") return {};
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      out[key] = value;
    }
  }
  return out;
}

/** ISR-style cache for catalog GraphQL; purge via tag `product-page` (see /api/cache/purge). */
const PRODUCT_PAGE_REVALIDATE_SECONDS = 300;

const getCachedProductBySlugInner = unstable_cache(
  async (slug) => fetchProductBySlug(getClient(), slug),
  ["product-page-detail-by-slug-v1"],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS, tags: ["product-page"] },
);

/** Same request: generateMetadata + page share one product fetch (no duplicate GraphQL). */
const loadProductBySlug = cache((slug) => getCachedProductBySlugInner(slug));

const getCachedCategoryProductsBySlug = unstable_cache(
  async (catSlug) => {
    const { data } = await getClient().query({
      query: GET_CATEGORY_PRODUCTS_BY_WHERE,
      variables: { slug: catSlug, first: 12 },
      fetchPolicy: "no-cache",
    });
    return data?.products?.nodes ?? [];
  },
  ["product-page-category-products-by-slug-v1"],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS, tags: ["product-page"] },
);

const getCachedFallbackProducts = unstable_cache(
  async () => {
    const res = await fetchProducts(getClient(), { first: 8 });
    return res?.nodes ?? [];
  },
  ["product-page-fallback-products-v1"],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS, tags: ["product-page"] },
);

const getCachedShapeFilters = unstable_cache(
  async () => fetchShapeAttributeTerms(getClient()),
  ["product-page-shape-attribute-terms-v1"],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS, tags: ["product-page"] },
);

/** One query: theme global ACF + homepage stories (replaces separate global + full home options). */
const getCachedProductPageThemeAndStories = unstable_cache(
  async () => fetchProductPageThemeAndStories(getClient()),
  ["product-page-theme-and-stories-v1"],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS, tags: ["product-page"] },
);

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  let product = null;
  try {
    product = await loadProductBySlug(slug);
  } catch {
    product = null;
  }
  if (!product) {
    return buildPageMetadata({
      title: "Product",
      path: productPath(locale, slug),
      locale,
    });
  }

  const { siteUrl } = getPublicEnv();
  const img = product.featuredImage?.node?.sourceUrl;

  const stripHtml = (html) =>
    typeof html === "string" ? html.replace(/<[^>]+>/g, "").trim() : "";

  const seo = product.seo;
  const metaTitle = stripHtml(seo?.title) || product.name;
  const metaDescription =
    stripHtml(seo?.metaDesc) ||
    stripHtml(seo?.opengraphDescription) ||
    stripHtml(product.shortDescription)?.slice(0, 160) ||
    undefined;

  return buildPageMetadata({
    title: metaTitle,
    description: metaDescription,
    path: productPath(locale, slug),
    imageUrl: img,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export default async function ProductSlugPage({ params, initialProduct = null }) {
  const { locale, slug } = await params;

  const { product, shapeFiltersResult, themeStoriesResult } = await (async () => {
    if (!initialProduct) {
      const batch = await Promise.allSettled([
        loadProductBySlug(slug),
        getCachedShapeFilters(),
        getCachedProductPageThemeAndStories(),
      ]);
      const productResult = batch[0];
      const loaded =
        productResult.status === "fulfilled" && productResult.value ? productResult.value : null;
      return {
        product: loaded,
        shapeFiltersResult: batch[1],
        themeStoriesResult: batch[2],
      };
    }
    const aux = await Promise.allSettled([
      getCachedShapeFilters(),
      getCachedProductPageThemeAndStories(),
    ]);
    return {
      product: initialProduct,
      shapeFiltersResult: aux[0],
      themeStoriesResult: aux[1],
    };
  })();

  if (!product) notFound();

  /** @type {object[]} */
  let relatedProducts = [];
  /** @type {object[]} */
  let popupProducts = [];
  /** @type {object[]} */
  let accordionItems = [];
  let productDescriptionLinks = [];
  /** @type {{ key: string; label: string }[]} */
  let shapeFilters = [];

  /** @type {object | null} */
  let founderSection = null;
  /** @type {object | null} */
  let icaSection = null;

  let storiesSectionData = [];
  let secondStoriesSectionData = [];

  const relatedPack = await (async () => {
    let rel = [];
    let pop = [];
    try {
      const catSlug = product.productCategories?.nodes?.[0]?.slug;
      if (catSlug) {
        const nodes = await getCachedCategoryProductsBySlug(catSlug);
        pop = nodes;
        rel = nodes.filter((p) => p.slug !== product.slug).slice(0, 8);
      }
      if (!rel.length) {
        const nodes = await getCachedFallbackProducts();
        rel = nodes.filter((p) => p.slug !== product.slug).slice(0, 10);
      }
      if (!pop.length) {
        pop = [product, ...rel].filter(
          (p, i, arr) => arr.findIndex((x) => String(x?.slug || "") === String(p?.slug || "")) === i,
        );
      }
    } catch {
      rel = [];
      pop = [product];
    }
    return { relatedProducts: rel, popupProducts: pop };
  })();

  relatedProducts = relatedPack.relatedProducts;
  popupProducts = relatedPack.popupProducts;

  if (shapeFiltersResult.status === "fulfilled") {
    shapeFilters = shapeFiltersResult.value;
  } else {
    shapeFilters = [];
  }

  if (themeStoriesResult.status === "fulfilled") {
    const { globalSettings, homeHomepageAcfFields } = themeStoriesResult.value;
    const homeOptions = homeHomepageAcfFields;
    storiesSectionData = homeOptions
      ? [pickByPrefixes(homeOptions, ["showStoriesSection", "stories"])]
      : [];
    secondStoriesSectionData = homeOptions
      ? [pickByPrefixes(homeOptions, ["showSecondStoriesSection", "secondStories"])]
      : [];
    accordionItems = globalSettings.accordionItems;
    productDescriptionLinks = globalSettings.productDescriptionLinks;
    founderSection = globalSettings.founderSection;
    icaSection = globalSettings.icaSection;
  } else {
    storiesSectionData = [];
    secondStoriesSectionData = [];
    accordionItems = [];
    productDescriptionLinks = [];
    founderSection = null;
    icaSection = null;
    // eslint-disable-next-line no-console
    console.error("Failed to load product theme / stories settings");
  }

  const { siteUrl } = getPublicEnv();
  const url = `${siteUrl.replace(/\/$/, "")}${productPath(locale, slug)}`;
  const img = product.featuredImage?.node?.sourceUrl;
  const resolvedPrice = resolveProductPriceNumber(product, { locale, fallbackCountry: "fr" });

  const structured = productJsonLd({
    product: {
      name: product.name,
      description: product.description,
      slug: product.slug,
      price: String(resolvedPrice),
    },
    url,
    imageUrl: img,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
      />
      <ProductPageShell
        product={product}
        locale={locale}
        relatedProducts={relatedProducts}
        popupProducts={popupProducts}
        shapeFilters={shapeFilters}
        accordionItems={accordionItems}
        productDescriptionLinks={productDescriptionLinks}
        founderSection={founderSection}
        icaSection={icaSection}
        storiesSectionData={storiesSectionData}
        secondStoriesSectionData={secondStoriesSectionData}
      />
    </>
  );
}
