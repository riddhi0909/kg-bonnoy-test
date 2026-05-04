"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categoriesSubCategoryPath, categoryPath, productsPath } from "@/constants/routes";
import GemstoneModal from "@/modules/home/components/GemstoneModal";
import CategoryCard from "@/modules/home/components/CategoryCard";



/** Shown only when WooCommerce category has no thumbnail (`image.sourceUrl` empty). */
const DEFAULT_CATEGORY_IMAGE_PLACEHOLDER = "/figma/gem-aigue-marine.png";

function plainText(v) {
  return String(v || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Two-line Figma title: first line italic, rest uppercase (split with `\n` in `title`). */
function renderStripTitle(title) {
  const raw = String(title || "").trim();
  if (!raw) return null;

  // Allow simple WYSIWYG markup from ACF title field.
  if (/[<][a-z/!]/i.test(raw)) {
    const safeHtml = raw
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "")
      .replace(/\sstyle="[^"]*"/gi, "")
      .replace(/\sstyle='[^']*'/gi, "");
    return <span dangerouslySetInnerHTML={{ __html: safeHtml }} />;
  }

  const parts = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  return (
    <>
      <span className="italic">{parts[0]}</span>{" "}
      <span className="uppercase text-[21px] not-italic max-[768px]:text-[17px]">{parts.slice(1).join(" ")}</span>
    </>
  );
}

const DEFAULT_STRIP_DESCRIPTION =
  "Des saphirs aux émeraudes en passant par les rubis, choisissez la pierre idéale pour votre bijou unique.";

function renderStripDescription(description) {
  const raw =
    description === undefined
      ? DEFAULT_STRIP_DESCRIPTION
      : String(description ?? "").trim();
  if (!raw) return null;

  const descClass =
    "text-sm font-normal leading-[1.428] text-[rgba(0,17,34,0.75)]";

  if (/[<][a-z/!]/i.test(raw)) {
    const safeHtml = raw
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "")
      .replace(/\sstyle="[^"]*"/gi, "")
      .replace(/\sstyle='[^']*'/gi, "");
    return <p className={descClass} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
  }

  return <p className={descClass}>{raw}</p>;
}

/**
 * Normalize WPGraphQL `productCategories.nodes` entry for the strip + modal (all from WP).
 * @param {object} c
 * @param {string} locale
 * @param {string} imagePlaceholder
 */
function mapCategoryToStripItem(c, locale, imagePlaceholder) {
  const slug = String(c.slug || "").trim();
  const title = String(c.name || "").trim();
  const wpUrl = c.image?.sourceUrl ? String(c.image.sourceUrl).trim() : "";
  const imageSrc = wpUrl || imagePlaceholder;
  const imageAlt = plainText(c.image?.altText) || title || "Catégorie";
  const description = plainText(c.description);
  return {
    id: c.id || slug,
    slug,
    href: categoryPath(locale, slug),
    title,
    label: title,
    count: Number(c.count ?? 0),
    description,
    summary: description,
    imageSrc,
    imageAlt,
    isMainCategory: Boolean(c?.isMainCategory),
  };
}

function resolveCategoryHref(locale, slug, linkTarget) {
  if (linkTarget === "subcategory") {
    return categoriesSubCategoryPath(locale, slug);
  }
  return categoryPath(locale, slug);
}

/**
 * Category page rail with the same scroll behavior/controls as product strips.
 * @param {{ categories?: Array<{ id?: string; slug?: string; name?: string; count?: number; description?: string; image?: { sourceUrl?: string; altText?: string } }>; locale: string; title: string; description?: string; viewAllLabel: string; viewAllHref?: string; explorerLabel?: string; categoryImagePlaceholder?: string }} props
 */
export function CategoryPageStrip({
  categories = [],
  locale,
  title,
  description,
  viewAllLabel,
  viewAllHref,
  linkTarget = "category",
  explorerLabel = "Explorer",
  categoryImagePlaceholder = DEFAULT_CATEGORY_IMAGE_PLACEHOLDER,
}) {
  const allCategoriesHref = viewAllHref ?? productsPath(locale);
  const items = useMemo(
    () =>
      categories
        .filter((c) => c?.slug && c?.name)
        .map((c) => ({
          ...mapCategoryToStripItem(c, locale, categoryImagePlaceholder),
          href: resolveCategoryHref(locale, String(c.slug || "").trim(), linkTarget),
        })),
    [categories, locale, categoryImagePlaceholder, linkTarget],
  );

  if (!items.length) return null;

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
    
  return (
    <div className="flex min-w-0 flex-col gap-[50px]">
      <div className="flex w-full flex-col gap-[15px] min-[768px]:justify-between min-[768px]:gap-3 max-[768px]:gap-[30px]">
        <h2 className="kg-title-h2 w-full text-left font-serif text-base font-normal leading-[1.19] uppercase tracking-[0.02em] text-[rgba(0, 17, 34, 1)] min-[768px]:w-auto text-[28px] max-[768px]:text-[21px]">
          {renderStripTitle(title)}
        </h2>
        {renderStripDescription(description)}

      </div>

      <div className="flex w-full min-w-0 flex-col gap-3">
        <div
          className="grid min-h-0 min-w-0 grid-cols-2 gap-[30px] max-[1024px]:gap-[20px] max-[768px]:gap-[10px] pb-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4 min-[1200px]:grid-cols-5"
          aria-label="Catégories de pierres"
        >
          {items.map((item, index) => (
             <div
             key={item.id}
             data-strip-card
             className={`
               group bg-[rgba(245,238,229,1)]
               transition-all duration-300
             `}
             onClick={() => {
               setSelectedIndex(index);
               setOpen(true);
             }}
           >
            <CategoryCard
              item={item}
              index={index}
              explorerLabel={explorerLabel}
              variant="category_list" 
              onOpen={(i) => {
                setSelectedIndex(i);
                setOpen(true);
              }}
            />
            </div>
          ))}
        </div>
        <GemstoneModal
          isOpen={open}
          onClose={() => setOpen(false)}
          initialIndex={selectedIndex}
          locale={locale}
          slides={items.map((item) => ({
            id: String(item.id),
            slug: item.slug,
            href: item.href,
            label: item.title,
            image: item.imageSrc,
            title: item.title,
            description: item.summary,
            count: item.count,
          }))}
        />

      </div>
    </div>
  );
}

export default CategoryPageStrip;
