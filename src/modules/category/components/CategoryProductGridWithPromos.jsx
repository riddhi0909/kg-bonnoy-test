"use client";

import { ProductCard } from "@/modules/product/components/ProductCard";
import { productPath } from "@/modules/product/routes/paths";
import { CategoryPromoCard } from "./CategoryPromoCard";
import { PROMO_CARDS } from "../constants/promo-cards";

/**
 * Chunk an array into groups of a specified size.
 * @param {T[]} array
 * @param {number} size
 * @returns {T[][]}
 * @template T
 */
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Product grid with interleaved promo cards.
 * Layout: 4 columns on desktop, where each row = 3 products + 1 promo card.
 * Maximum 4 promo cards are displayed.
 *
 * @param {{
 *   products: object[];
 *   locale: string;
 *   maxPromoCards?: number;
 *   productsPerRow?: number;
 * }} props
 */
export function CategoryProductGridWithPromos({
  products,
  locale,
  maxPromoCards = 4,
  productsPerRow = 3,
}) {
  if (!products?.length) {
    return (
      <p className="text-center text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">
        Aucun produit dans cette catégorie.
      </p>
    );
  }

  // Chunk products into groups (default: 3 products per row)
  const productChunks = chunkArray(products, productsPerRow);

  return (
    <div className="space-y-5">
      {productChunks.map((chunk, rowIndex) => {
        // Get promo card for this row (max 4)
        const promoCard =
          rowIndex < maxPromoCards ? PROMO_CARDS[rowIndex] : null;

        return (
          <div
            key={`row-${rowIndex}`}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 min-[1440px]:grid-cols-4"
          >
            {/* Product cards */}
            {chunk.map((product) => (
              <div key={product.id} className="min-w-0">
                <ProductCard
                  product={product}
                  locale={locale}
                  href={productPath(locale, product.slug)}
                  variant="strip"
                  className="h-full w-full"
                />
              </div>
            ))}

            {/* Fill empty product slots if chunk is incomplete (for proper alignment) */}
            {chunk.length < productsPerRow &&
              rowIndex < maxPromoCards &&
              Array.from({ length: productsPerRow - chunk.length }).map(
                (_, i) => (
                  <div
                    key={`empty-${rowIndex}-${i}`}
                    className="hidden min-[1440px]:block"
                  />
                )
              )}

            {/* Promo card at end of row */}
            {promoCard && (
              <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                <CategoryPromoCard
                  image={promoCard.image}
                  title={promoCard.title}
                  description={promoCard.description}
                  buttonText={promoCard.buttonText}
                  url={promoCard.url}
                  overlay={promoCard.overlay}
                  badge={promoCard.badge}
                  className="h-full w-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
