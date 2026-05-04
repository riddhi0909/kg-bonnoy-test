"use client";

import { ProductCard } from "@/modules/product/components/ProductCard";
import { productPath } from "@/modules/product/routes/paths";
import { PlpFeatureCard } from "@/modules/category/components/PlpFeatureCard";
import {
  PLP_FEATURE_GRID_INDICES,
} from "@/modules/category/components/category-plp-default-features";

/**
 * 4×4 PLP grid (≥1440): dynamic promo tiles from ACF + product slots.
 * @param {{
 *   products: object[];
 *   locale: string;
 *   featurePosts?: Array<{ title: string; imageUrl: string; videoUrl?: string; href: string; ctaLabel: string; imageAlt?: string; layout?: "top" | "bottom"; eyebrow?: string; eyebrowSubtext?: string } | null | undefined>;
 *   view?: "grid" | "list";
 * }} props
 */
export function CategoryPlpGrid({ products, locale, featurePosts, view = "grid" }) {
  const features = PLP_FEATURE_GRID_INDICES.map((_, i) => featurePosts?.[i] ?? null);

  const rowCount =
    products.length >= 10 ? 4 : products.length >= 7 ? 3 : products.length >= 4 ? 2 : products.length >= 1 ? 1 : 0;

  const allowedFeatureIndices = PLP_FEATURE_GRID_INDICES.filter((idx) => {
    if (idx === 0) return rowCount >= 1;
    if (idx === 7) return rowCount >= 2;
    if (idx === 8) return rowCount >= 3;
    if (idx === 15) return rowCount >= 4;
    return false;
  });

  const featureByGridIndex = new Map(
    allowedFeatureIndices.map((gridIndex) => [
      gridIndex,
      features[PLP_FEATURE_GRID_INDICES.indexOf(gridIndex)],
    ]),
  );

  const cells = [];
  let productIndex = 0;
  const firstBandLimit = rowCount * 4;
  for (let gridIndex = 0; gridIndex < firstBandLimit; gridIndex += 1) {
    const feature = featureByGridIndex.get(gridIndex);
    if (feature) {
      cells.push({ kind: "feature", key: `feature-${gridIndex}`, feature });
    } else {
      const p = products[productIndex];
      if (!p) break;
      productIndex += 1;
      cells.push({ kind: "product", key: `p-${gridIndex}-${p.id}`, product: p });
    }
  }

  /** “Voir plus”: append remaining products as plain 4-column rows (no extra promo tiles). */
  let extraIdx = firstBandLimit;
  while (productIndex < products.length) {
    const p = products[productIndex];
    productIndex += 1;
    cells.push({ kind: "product", key: `p-extra-${extraIdx}-${p.id}`, product: p });
    extraIdx += 1;
  }

  const hasAnyProduct = cells.some((c) => c.kind === "product" && c.product);
  const mobileCells = (() => {
    const featuresOnly = cells.filter((c) => c.kind === "feature");
    const productsOnly = cells.filter((c) => c.kind === "product" && c.product);
    const out = [];
    let fi = 0;
    let pi = 0;

    while (fi < featuresOnly.length || pi < productsOnly.length) {
      if (fi < featuresOnly.length) {
        out.push(featuresOnly[fi]);
        fi += 1;
      }
      for (let k = 0; k < 4 && pi < productsOnly.length; k += 1) {
        out.push(productsOnly[pi]);
        pi += 1;
      }
      if (fi >= featuresOnly.length && pi < productsOnly.length) {
        out.push(...productsOnly.slice(pi));
        break;
      }
    }
    return out;
  })();

  if (!hasAnyProduct) {
    return (
      <p className="text-center text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">
        Aucun produit dans cette catégorie.
      </p>
    );
  }

  if (view === "list") {
    return (
      <ul className="grid grid-cols-1 gap-y-[20px]">
        {cells.map((cell) => (
          <li key={cell.key} className="min-w-0 h-full">
            {cell.kind === "feature" ? (
              <PlpFeatureCard
                title={cell.feature.title}
                imageUrl={cell.feature.imageUrl}
                videoUrl={cell.feature.videoUrl}
                href={cell.feature.href}
                ctaLabel={cell.feature.ctaLabel}
                imageAlt={cell.feature.imageAlt}
                layout={cell.feature.layout}
                mobileLayout={cell.key === "feature-0" ? "top" : undefined}
                eyebrow={cell.feature.eyebrow}
                eyebrowSubtext={cell.feature.eyebrowSubtext}
              />
            ) : cell.product ? (
              <ProductCard
                product={cell.product}
                locale={locale}
                href={productPath(locale, cell.product.slug)}
                className="h-full w-full"
                variant="strip"
              />
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <ul className="grid auto-rows-auto grid-cols-2 gap-x-5 gap-y-[30px] min-[1024px]:hidden">
        {mobileCells.map((cell) => (
          <li
            key={`m-${cell.key}`}
            className={`min-w-0 h-full ${cell.kind === "feature" ? "col-span-2" : "col-span-1"}`}
          >
            {cell.kind === "feature" ? (
              <PlpFeatureCard
                title={cell.feature.title}
                imageUrl={cell.feature.imageUrl}
                videoUrl={cell.feature.videoUrl}
                href={cell.feature.href}
                ctaLabel={cell.feature.ctaLabel}
                imageAlt={cell.feature.imageAlt}
                layout={cell.feature.layout}
                eyebrow={cell.feature.eyebrow}
                eyebrowSubtext={cell.feature.eyebrowSubtext}
              />
            ) : cell.product ? (
              <ProductCard
                product={cell.product}
                locale={locale}
                href={productPath(locale, cell.product.slug)}
                className="h-full w-full"
                variant="strip"
              />
            ) : null}
          </li>
        ))}
      </ul>

      <ul className="hidden auto-rows-fr grid-cols-1 gap-y-[30px] min-[1024px]:grid min-[1024px]:grid-cols-4 min-[1024px]:gap-x-5 min-[1440px]:grid-cols-4 min-[1440px]:gap-x-5">
        {cells.map((cell) => (
          <li key={cell.key} className="min-w-0 h-full">
            {cell.kind === "feature" ? (
              <PlpFeatureCard
                title={cell.feature.title}
                imageUrl={cell.feature.imageUrl}
                videoUrl={cell.feature.videoUrl}
                href={cell.feature.href}
                ctaLabel={cell.feature.ctaLabel}
                imageAlt={cell.feature.imageAlt}
                layout={cell.feature.layout}
                eyebrow={cell.feature.eyebrow}
                eyebrowSubtext={cell.feature.eyebrowSubtext}
              />
            ) : cell.product ? (
              <ProductCard
                product={cell.product}
                locale={locale}
                href={productPath(locale, cell.product.slug)}
                className="h-full w-full"
                variant="strip"
              />
            ) : null}
          </li>
        ))}
      </ul>
      
    </>
  );
}
