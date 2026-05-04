import { getClient } from "@/apollo/register-client";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { productsPath } from "@/constants/routes";
import {
  fetchCategoryWithProducts,
  fetchProductCategories,
} from "@/modules/category/services/category-service";
import { CategoryPills } from "@/modules/category/components/CategoryPills";
import { fetchProducts } from "@/modules/product/services/product-service";
import { ProductGrid } from "@/modules/product/components/ProductGrid";
import { fetchProductSearch } from "@/modules/search/services/search-service";

/** @param {{ params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; category?: string }> }} props */
export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const { q, category } = await searchParams;
  const suffix = [];
  if (q) suffix.push(`q=${encodeURIComponent(q)}`);
  if (category) suffix.push(`category=${encodeURIComponent(category)}`);
  const path = `${productsPath(locale)}${suffix.length ? `?${suffix.join("&")}` : ""}`;
  return buildPageMetadata({
    title: q ? `Recherche : ${q}` : category ? `Catégorie : ${category}` : "Produits",
    description: "Catalogue produits",
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; category?: string }> }} props */
export default async function ProductsPage({ params, searchParams }) {
  const { locale } = await params;
  const { q, category } = await searchParams;
  const client = getClient();
  let nodes = [];
  let heading = q ? `Résultats pour "${q}"` : "Produits";

  try {
    if (q) {
      nodes = await fetchProductSearch(client, String(q));
    } else if (category) {
      const cat = await fetchCategoryWithProducts(client, String(category), {
        first: 24,
      });
      heading = cat?.name ? cat.name : `Catégorie : ${category}`;
      nodes = cat?.products?.nodes ?? [];
    } else {
      const conn = await fetchProducts(client, { first: 12 });
      nodes = conn.nodes ?? [];
    }
  } catch {
    nodes = [];
  }

  /** @type {object[]} */
  let categories = [];
  try {
    categories = await fetchProductCategories(client, { first: 40 });
  } catch {
    categories = [];
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{heading}</h1>
      {categories.length > 0 ? (
        <CategoryPills
          categories={categories}
          activeSlug={category || null}
          basePath={productsPath(locale)}
        />
      ) : null}
      <ProductGrid products={nodes} locale={locale} />
    </div>
  );
}
