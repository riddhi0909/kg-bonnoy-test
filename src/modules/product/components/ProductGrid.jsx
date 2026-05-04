"use client";

import { ProductCard } from "@/modules/product/components/ProductCard";
import { productPath } from "@/modules/product/routes/paths";

/**
 * PLP grid: 315px-wide cards; at 1440 content width 1320 → 4×315 + 3×20px gaps (Figma).
 * @param {{ products: object[]; locale: string }} props
 */
export function ProductGrid({ products, locale }) {
  if (!products?.length) {
    return (
      <p className="text-center text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">
        Aucun produit dans cette catégorie.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-y-[30px] sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-5 min-[1440px]:grid-cols-4 min-[1440px]:gap-x-5">
      {products.map((p) => (
        <li key={p.id} className="min-w-0">
          <ProductCard
            product={p}
            locale={locale}
            href={productPath(locale, p.slug)}
            className="h-full w-full"
            variant="strip"
          />
        </li>
      ))}
    </ul>
  );
}
