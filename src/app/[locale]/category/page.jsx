import { getClient } from "@/apollo/register-client";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import {
  categoriesIndexPath,
  productsPath,
} from "@/constants/routes";
import { fetchGlobalAcfFields, fetchProductCategories } from "@/modules/category/services/category-service";
import { CategoryBreadcrumbs } from "@/modules/category/components/CategoryBreadcrumbs";
import { CategoryPageStrip } from "@/modules/category/components/CategoryPageStrip";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    title: "Toutes les catégories",
    description:
      "Parcourez toutes nos catégories de pierres et créations Bonnot Paris.",
    path: categoriesIndexPath(locale),
    locale,
  });
}

/**
 * @param {{ params: Promise<{ locale: string }> }} props
 */
export default async function CategoriesIndexPage({ params }) {
  const { locale } = await params;
  const client = getClient();

  let categories = [];
  let globalAcfFields = null;
  const [catRes, globalRes] = await Promise.allSettled([
    fetchProductCategories(client, { all: true, hideEmpty: false }),
    fetchGlobalAcfFields(client),
  ]);
  if (catRes.status === "fulfilled") categories = catRes.value;
  if (globalRes.status === "fulfilled") globalAcfFields = globalRes.value;

  const categoryStripTitle =
    String(globalAcfFields?.categoryTitle ?? "").trim() ||
    "SÉLECTIONNEZ LE TYPE DE PIERRE PRÉCIEUSE";
  const categoryStripDescription = String(
    globalAcfFields?.categoryDescription ?? "",
  ).trim();


  const childrenByParent = new Map();
  for (const c of categories) {
    const parentId = Number(c?.parentDatabaseId ?? 0);
    if (!Number.isFinite(parentId) || parentId <= 0) continue;
    const list = childrenByParent.get(parentId) ?? [];
    list.push(c);
    childrenByParent.set(parentId, list);
  }

  function getDescendantCount(mainDbId) {
    const seen = new Set();
    const queue = [mainDbId];
    while (queue.length > 0) {
      const current = queue.shift();
      const children = childrenByParent.get(current) ?? [];
      for (const child of children) {
        const childId = Number(child?.databaseId ?? 0);
        if (!Number.isFinite(childId) || childId <= 0 || seen.has(childId)) continue;
        seen.add(childId);
        queue.push(childId);
      }
    }
    return seen.size;
  }

  const mainCategories = categories
    .filter((c) => Number(c?.parentDatabaseId ?? 0) <= 0)
    .map((main) => {
      const mainDbId = Number(main?.databaseId ?? 0);
      const subCategoryCount = getDescendantCount(mainDbId);
      return {
        ...main,
        count: subCategoryCount,
      };
    });
  

  return (
    <div className="w-full bg-[#F9F7F2]">

      <CategoryBreadcrumbs
        locale={locale}
        currentLabel="Toutes les catégories"
      />

      <div className="mx-auto w-full max-w-[1440px] px-[15px] pt-[30px] min-[767px]:px-[60px] min-[767px]:pt-[60px]">
        <CategoryPageStrip
          locale={locale}
          categories={mainCategories}
          title={categoryStripTitle}
          description={categoryStripDescription || undefined}
          viewAllLabel="Toutes les pierres"
          viewAllHref={productsPath(locale)}
          linkTarget="subcategory"
        />
      </div>

      <BeforeFooterSection />
    </div>
  );
}
