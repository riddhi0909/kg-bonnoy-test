import { notFound } from "next/navigation";
import { getClient } from "@/apollo/register-client";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import {
  categoriesIndexPath,
  categoriesSubCategoryPath,
  productsPath,
} from "@/constants/routes";
import {
  fetchGlobalAcfFields,
  fetchProductCategories,
} from "@/modules/category/services/category-service";
// import { fetchProductCategories } from "@/modules/category/services/category-service";
import { CategoryBreadcrumbs } from "@/modules/category/components/CategoryBreadcrumbs";
import { CategoryPageStrip } from "@/modules/category/components/CategoryPageStrip";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";

function normalizeSlug(value) {
  return decodeURIComponent(String(value || "")).trim().toLowerCase();
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const decodedSlug = normalizeSlug(slug).replace(/-/g, " ");
  const prettySlug = decodedSlug
    ? decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)
    : "Sous-catégories";
  const title = `Sous-catégories - ${prettySlug}`;

  return buildPageMetadata({
    title,
    description: "Parcourez les sous-catégories de cette catégorie.",
    path: categoriesSubCategoryPath(locale, slug),
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export default async function SubCategoryPage({ params }) {
  const { locale, slug } = await params;
  const client = getClient();

  const [categoriesResult , globalResult] = await Promise.allSettled([
    fetchProductCategories(client, { all: true, hideEmpty: false }),
    fetchGlobalAcfFields(client),
  ]);

  const allCategories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const globalAcfFields =
    globalResult.status === "fulfilled" ? globalResult.value : null;

  const wantedSlug = normalizeSlug(slug);
  const parentCategory =
    allCategories.find((c) => normalizeSlug(c?.slug) === wantedSlug) || null;
  if (!parentCategory) notFound();

  const parentDbId = Number(parentCategory?.databaseId ?? 0);

  // Include all descendant subcategories (children, grandchildren, etc.)
  const byParent = new Map();
  for (const c of allCategories) {
    const pId = Number(c?.parentDatabaseId ?? 0);
    if (!Number.isFinite(pId) || pId <= 0) continue;
    const list = byParent.get(pId) ?? [];
    list.push(c);
    byParent.set(pId, list);
  }

  const keepIds = new Set();
  const queue = [parentDbId];
  while (queue.length) {
    const current = queue.shift();
    const children = byParent.get(current) ?? [];
    for (const child of children) {
      const childId = Number(child?.databaseId ?? 0);
      if (!Number.isFinite(childId) || childId <= 0 || keepIds.has(childId)) continue;
      keepIds.add(childId);
      queue.push(childId);
    }
  }

  const subCategories = allCategories.filter((c) =>
    keepIds.has(Number(c?.databaseId ?? 0)),
  );
  const categoriesForStrip = [{ ...parentCategory, isMainCategory: true }, ...subCategories].filter(
    (c, i, arr) => arr.findIndex((x) => String(x?.id || x?.slug) === String(c?.id || c?.slug)) === i,
  );

  const subcategoryTitleBase =
    String(globalAcfFields?.subcategoryTitle ?? "").trim() || "SOUS-CATÉGORIES";
  const subcategoryStripTitle = parentCategory?.name
    ? `${subcategoryTitleBase} - ${parentCategory.name}`
    : subcategoryTitleBase;
  /** From `productCategories.nodes.description` (GET_PRODUCT_CATEGORIES). */
  const subcategoryStripDescription = String(
    parentCategory?.description ?? "",
  ).trim();

  

  return (
    <div className="w-full bg-[#F9F7F2]">
      <CategoryBreadcrumbs
        locale={locale}
        parentCrumb={{
          label: "Toutes les catégories",
          href: categoriesIndexPath(locale),
        }}
        currentLabel={parentCategory?.name ?? ""}
      />
      <div className="mx-auto w-full max-w-[1440px] px-[15px] pt-[30px] min-[767px]:px-[60px] min-[767px]:pt-[60px]">
        <CategoryPageStrip
          locale={locale}
          categories={categoriesForStrip}
          linkTarget="category"
          title={subcategoryStripTitle}
          description={subcategoryStripDescription}
           viewAllLabel="Toutes les pierres"
          viewAllHref={productsPath(locale)}
        />
      </div>

      <BeforeFooterSection />
    </div>
  );
}
