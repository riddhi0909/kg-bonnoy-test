import { notFound } from "next/navigation";
import { cache } from "react";
import { getClient } from "@/apollo/register-client";
import { localizedPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import CategoryPage from "@/app/[locale]/category/[slug]/page";
import ProductSlugPage from "@/app/[locale]/products/[slug]/page";
import { fetchCategoryWithProducts } from "@/modules/category/services/category-service";
import { fetchProductBySlug } from "@/modules/product/services/product-service";
import { PageAcfSections } from "@/modules/cms/components/PageAcfSections";
import { fetchPageByUri } from "@/modules/cms/services/cms-page-service";
import {
  getPageTemplateName,
  isAcfFirstTemplate,
} from "@/modules/cms/templates/page-templates";

/**
 * @param {string[]} parts
 */
function toWpUri(parts) {
  const clean = parts.filter(Boolean).join("/");
  return `/${clean}/`;
}

console.log("generateMetadata = 1" );

/** @param {{ params: Promise<{ locale: string; slug: string[] }> }} props */
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const isSingleSegment = Array.isArray(slug) && slug.length === 1;
  const singleSlug = isSingleSegment ? String(slug[0] || "").trim() : "";

  console.log("generateMetadata = 2" );
  if (singleSlug) {
    try {
      const category = await fetchCategoryWithProducts(getClient(), singleSlug, {
        first: 1,
      });
      if (category) {
        return buildPageMetadata({
          title: String(category?.name || `Category: ${singleSlug}`),
          description:
            String(category?.name || "").trim() !== ""
              ? `Découvrez ${category.name} — pierres et créations Bonnot Paris.`
              : "Catégorie",
          path: localizedPath(locale, `/${singleSlug}`),
          locale,
        });
      }
    } catch {
      /* ignore and continue to CMS lookup */
    }
  }

  const uri = toWpUri(slug || []);
  let page = null;
  try {
    page = await fetchPageByUri(getClient(), uri);
  } catch {
    page = null;
  }

  const path = localizedPath(locale, `/${(slug || []).join("/")}`);
  if (!page) {
    return buildPageMetadata({
      title: "Page",
      path,
      locale,
    });
  }

  const descriptionRaw = page.excerpt || page.content || "";
  const description = String(descriptionRaw).replace(/<[^>]+>/g, " ").replace(/\\s+/g, " ").trim();

  return buildPageMetadata({
    title: String(page.title || "Page").replace(/<[^>]+>/g, "").trim() || "Page",
    description: description.slice(0, 160),
    path,
    imageUrl: page.featuredImage?.node?.sourceUrl,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string; slug: string[] }> }} props */
export default async function CmsCatchAllPage({ params }) {
  const { locale, slug } = await params;
  const isSingleSegment = Array.isArray(slug) && slug.length === 1;
  const singleSlug = isSingleSegment ? String(slug[0] || "").trim() : "";

  if (singleSlug) {
    try {
      const category = await fetchCategoryWithProducts(getClient(), singleSlug, {
        first: 1,
      });
      if (category) {
        return CategoryPage({
          params: Promise.resolve({
            locale,
            slug: singleSlug,
          }),
        });
      }
    } catch {
      /* ignore and continue to CMS lookup */
    }


    try {
      const product = await fetchProductBySlug(getClient(), singleSlug);
      if (product) {
        return ProductSlugPage({
          params: Promise.resolve({
            locale,
            slug: singleSlug,
          }),
          initialProduct: product,
        });
      }
    } catch {
      /* ignore and continue to CMS lookup */
    }
  }



  const uri = toWpUri(slug || []);
  let page = null;
  try {
    page = await fetchPageByUri(getClient(), uri);
  } catch {
    page = null;
  }
  if (!page) notFound();
  const templateName = getPageTemplateName(page);
  const renderAcfFirst = isAcfFirstTemplate(templateName);

  return (
    <div className="space-y-10">
      {renderAcfFirst ? <PageAcfSections acf={page?.acfFields} locale={locale} /> : null}
      <article className="prose prose-zinc max-w-none dark:prose-invert">
        <h1 dangerouslySetInnerHTML={{ __html: page.title || "" }} />
        <div dangerouslySetInnerHTML={{ __html: page.content || "" }} />
      </article>
      {!renderAcfFirst ? <PageAcfSections acf={page?.acfFields} locale={locale} /> : null}
    </div>
  );
}