import Image from "next/image";
import { unstable_cache } from "next/cache";
import { preload } from "react-dom";
import { notFound } from "next/navigation";
import { getClient } from "@/apollo/register-client";
import { categoryPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import {
  fetchCategoryWithProducts,
  fetchProductCategories,
  fetchGlobalAcfFields,
  fetchPlpProductAttributeTerms,
  mapCategoryFaqForSection,
  mapThemeSourcingForFaqSection,
} from "@/modules/category/services/category-service";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { FaqSection } from "@/modules/common/components/FaqSection";
import { CategoryPlpSection } from "@/modules/category/components/CategoryPlpSection";
import { CategoryContactButton } from "@/modules/category/components/CategoryContactButton";


const CATEGORY_PAGE_REVALIDATE_SECONDS = 3600;

const getCachedCategoryWithProducts = unstable_cache(async (slug, first = 24) => {
  const client = getClient();
  return fetchCategoryWithProducts(client, slug, { first });
}, ["category-page-category-v2"], {
  revalidate: CATEGORY_PAGE_REVALIDATE_SECONDS,
  tags: ["category-page"],
});

const getCachedProductCategories = unstable_cache(async () => {
  const client = getClient();
  return fetchProductCategories(client, { first: 40 });
}, ["category-page-product-categories-v2"], {
  revalidate: CATEGORY_PAGE_REVALIDATE_SECONDS,
  tags: ["category-page"],
});

const getCachedGlobalAcfFields = unstable_cache(async () => {
  const client = getClient();
  return fetchGlobalAcfFields(client);
}, ["category-page-global-acf-fields-v2"], {
  revalidate: CATEGORY_PAGE_REVALIDATE_SECONDS,
  tags: ["category-page"],
});

const getCachedPlpAttributeStore = unstable_cache(async () => {
  const client = getClient();
  return fetchPlpProductAttributeTerms(client);
}, ["category-page-plp-attribute-store-v2"], {
  revalidate: CATEGORY_PAGE_REVALIDATE_SECONDS,
  tags: ["category-page"],
});

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  let title = `Category: ${slug}`;
  let description = "Catégorie";
  try {
    const cat = await getCachedCategoryWithProducts(slug, 1);
    if (cat?.name) {
      title = cat.name;
      description = `Découvrez ${cat.name} — pierres et créations Bonnot Paris.`;
    }
  } catch {
    /* ignore */
  }
  return buildPageMetadata({
    title,
    description,
    path: categoryPath(locale, slug),
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export default async function CategoryPage({ params }) {
  const { locale, slug } = await params;
  const categoryPromise = getCachedCategoryWithProducts(slug, 40).catch(() => null);
  const categoriesPromise = getCachedProductCategories().catch(() => []);
  const globalAcfFieldsPromise = getCachedGlobalAcfFields().catch(() => null);
  const plpAttributeStorePromise = getCachedPlpAttributeStore().catch(() => null);

  const category = await categoryPromise;
  if (!category) notFound();

  const [categories, globalAcfFields, plpAttributeStore] = await Promise.all([
    categoriesPromise,
    globalAcfFieldsPromise,
    plpAttributeStorePromise,
  ]);

  const currentCategoryDbId = Number(category?.databaseId ?? 0);
  const childrenByParent = new Map();
  for (const c of categories) {
    const parentId = Number(c?.parentDatabaseId ?? 0);
    if (!Number.isFinite(parentId) || parentId <= 0) continue;
    const list = childrenByParent.get(parentId) ?? [];
    list.push(c);
    childrenByParent.set(parentId, list);
  }

  const descendantIds = new Set();
  const queue = [currentCategoryDbId];
  while (queue.length > 0) {
    const current = queue.shift();
    const children = childrenByParent.get(current) ?? [];
    for (const child of children) {
      const childId = Number(child?.databaseId ?? 0);
      if (!Number.isFinite(childId) || childId <= 0 || descendantIds.has(childId)) continue;
      descendantIds.add(childId);
      queue.push(childId);
    }
  }

  const descendantCategories = categories.filter((c) =>
    descendantIds.has(Number(c?.databaseId ?? 0)),
  );
  const orderedDescendantCategories = [...descendantCategories].sort(
    (a, b) => Number(b?.databaseId ?? 0) - Number(a?.databaseId ?? 0),
  );
  const categoriesById = new Map(
    categories
      .map((c) => [Number(c?.databaseId ?? 0), c])
      .filter(([id]) => Number.isFinite(id) && id > 0),
  );
  let mainCategory = category;
  let mainCategoryId = Number(category?.databaseId ?? 0);
  while (mainCategoryId > 0) {
    const node = categoriesById.get(mainCategoryId);
    const parentId = Number(node?.parentDatabaseId ?? 0);
    if (!Number.isFinite(parentId) || parentId <= 0) break;
    const parentNode = categoriesById.get(parentId);
    if (!parentNode) break;
    
    mainCategory = parentNode;
    mainCategoryId = parentId;
  }

  
  const categoriesForGemScroller =
    orderedDescendantCategories.length > 0
      ? [category, ...orderedDescendantCategories].filter(
          (c, i, arr) =>
            arr.findIndex((x) => String(x?.id || x?.slug) === String(c?.id || c?.slug)) === i,
        )
      : [category];

  const products = category.products?.nodes ?? [];
  const displayCount = category.count ?? products.length;
  const categoryDescriptionHtml = String(category?.description || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .trim();
  const categoryDescriptionText = String(category?.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const dynamicFeaturePosts = Array.isArray(globalAcfFields?.categoryPostBlock)
    ? globalAcfFields.categoryPostBlock.slice(0, 4).map((row) => ({
        imageUrl:
          row?.categoryPostImage?.node?.sourceUrl ??
          row?.categoryPostImage?.sourceUrl ??
          (typeof row?.categoryPostImage === "string" ? row.categoryPostImage : "") ??
          "",
        videoUrl:
          row?.categoryPostVideo?.node?.mediaItemUrl ??
          row?.categoryPostVideo?.mediaItemUrl ??
          (typeof row?.categoryPostVideo === "string" ? row.categoryPostVideo.trim() : "") ??
          "",
        imageAlt:
          row?.categoryPostImage?.node?.altText ??
          row?.categoryPostImage?.altText ??
          "",
        title: row?.categoryPostTitle ?? "",
        eyebrow: row?.categoryPostSubTitle ?? "",
        ctaLabel: row?.categoryPostButtonTitle ?? "",
        href: row?.categoryPostButtonLink ?? "#",
      }))
    : [];
  const { faqTitle, faqItems } = mapCategoryFaqForSection(category);
  const sourcingSection = mapThemeSourcingForFaqSection(globalAcfFields);

  const heroImages = [
    "/figma/category-hero-1.png",
    "/figma/category-hero-2.png",
  ];

  for (const src of heroImages) {
    preload(src, {
      as: "image",
      fetchPriority: "high",
    });
  }

  return (
    <div className="w-full bg-[#fffaf5]">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Hero — dual 720 × 480 desktop (Figma PLP) */}
        <div className="grid grid-cols-1 min-[767px]:grid-cols-2">
          {heroImages.map((src, i) => (
            <div
              key={src}
              className="h-[220px] overflow-hidden min-[768px]:h-[360px] min-[1440px]:h-[480px]"
            >
              <Image
                src={src}
                alt=""
                width={720}
                height={480}
                sizes="(max-width: 767px) 100vw, 50vw"
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            </div>
          ))}
        </div>

        <section className="px-[15px] pt-[30px] pb-[30px] min-[767px]:p-0">
          <div className="grid grid-cols-1 min-[767px]:grid-cols-2 gap-[20px]">
            <div className="pl-0 min-[767px]:pl-[15px] min-[767px]:pt-[60px] min-[767px]:pb-[40px] min-[1440px]:pl-[60px]">
              <h2 className="font-serif text-[28px] font-normal uppercase leading-[1.12] text-[#001122] max-[767px]:text-[21px]">
                LES {category.name}
              </h2>
            </div>
            <div className="flex flex-col justify-start gap-[30px] pr-[15px] min-[767px]:pt-[60px] min-[767px]:pb-[40px] min-[1440px]:pr-[60px] min-[1440px]:justify-start">
              {categoryDescriptionHtml ? (
                <div className="text-sm leading-[1.428] text-[rgba(0,17,34,1)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] [&_a]:text-[#f63]">
                  <div dangerouslySetInnerHTML={{ __html: categoryDescriptionHtml }} />
                </div>
              ) : null} 
                          <CategoryContactButton />


            </div>
          </div>
        </section>

        <CategoryPlpSection
          locale={locale}
          categories={categoriesForGemScroller}
          currentSlug={slug}
          mainCategorySlug={String(mainCategory?.slug || "")}
          mainCategoryName={String(mainCategory?.name || "")}
          currentCategoryName={String(category?.name || "")}
          displayCount={displayCount}
          products={products}
          featurePosts={dynamicFeaturePosts}
          plpAttributeStore={plpAttributeStore}
        />
        <FaqSection
          faqTitle={faqTitle ?? undefined}
          faqItems={faqItems.length > 0 ? faqItems : undefined}
          sourcingSection={sourcingSection}
        />

        <TestimonialsSection pt={0} pb={0} />
        <BeforeFooterSection />

      </div>
    </div>
  );
}
