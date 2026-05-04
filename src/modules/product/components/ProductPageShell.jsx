"use client";

import { useState } from "react";
import { ProductDetail } from "@/modules/product/components/ProductDetail";
import { useCart } from "@/modules/cart/hooks/useCart";
import { parsePrice } from "@/modules/product/utils/parse-price";
import { resolveProductPriceRaw } from "@/modules/common/utils/price";
import {
  effectiveMaxStock,
  isAddToCartStockBlocked,
  stockBlockedReason,
} from "@/modules/cart/utils/product-stock";

function readVariationMeta(variation, key) {
  const meta = Array.isArray(variation?.metaData) ? variation.metaData : [];
  const norm = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/^_+/, "");
  const keyNorm = norm(key);
  const hit = meta.find((item) => norm(item?.key) === keyNorm);
  return hit?.value;
}

function isVariationOutOfStock(variation) {
  if (!variation || typeof variation !== "object") return false;
  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  const statusFromMeta =
    readVariationMeta(variation, "_stock_status") ??
    readVariationMeta(variation, "stock_status");
  const statusValue = statusFromMeta ?? variation?.stockStatus;
  const status = normalize(statusValue);
  const statusSaysAvailable = status === "instock" || status === "onbackorder";
  const statusSaysUnavailable = status === "outofstock" || (status && !statusSaysAvailable);
  if (statusSaysUnavailable) return true;
  const managesStock =
    variation?.manageStock === true ||
    ["1", "yes", "true"].includes(
      normalize(readVariationMeta(variation, "_manage_stock")),
    );
  const qtyRaw =
    variation?.stockQuantity ?? readVariationMeta(variation, "_stock");
  const qty = Number(qtyRaw);
  const qtySaysAvailable = managesStock && Number.isFinite(qty) && qty > 0;
  const qtySaysUnavailable =
    managesStock && (!Number.isFinite(qty) || (Number.isFinite(qty) && qty <= 0));
  if (qtySaysUnavailable) return true;
  if (!statusSaysAvailable && !qtySaysAvailable) return true;
  return false;
}

/**
@param {{ product: object; locale: string; relatedProducts?: object[]; popupProducts?: object[]; accordionItems?: object[]; productDescriptionLinks?: object[]; founderSection?: object | null; icaSection?: object | null ; storiesSectionData = null, secondStoriesSectionData = null}} props
 */
export function ProductPageShell({
  product,
  locale,
  relatedProducts = [],
  popupProducts = [],
  shapeFilters = [],
  accordionItems = [],
  productDescriptionLinks = [],
  storiesSectionData = null,
  secondStoriesSectionData = null,
  founderSection = null,
  icaSection = null,
}) {
  const { addToCart, lines } = useCart();
  const [addToCartSubmitting, setAddToCartSubmitting] = useState(false);
  const getVariationCartQuantity = (item, selectedVariation) => {
    const variationDatabaseId = Number(selectedVariation?.databaseId);
    if (!Number.isInteger(variationDatabaseId) || variationDatabaseId <= 0) return 0;
    const key = `${item?.id}::${variationDatabaseId}`;
    return lines.reduce((sum, entry) => {
      const entryVariationId = Number(entry?.variationId);
      const matchesByVariationId =
        Number.isInteger(entryVariationId) &&
        entryVariationId > 0 &&
        entryVariationId === variationDatabaseId;
      const matchesByLegacyKey = String(entry?.id) === key;
      if (!matchesByVariationId && !matchesByLegacyKey) return sum;
      const qty = Number(entry?.qty);
      return sum + (Number.isFinite(qty) && qty > 0 ? qty : 0);
    }, 0);
  };
  const isVariationQuantityBlocked = (item, selectedVariation, addQty = 1) => {
    if (!item || !selectedVariation) return false;
    const managesStock = selectedVariation?.manageStock === true;
    const stockQty = Number(selectedVariation?.stockQuantity);
    if (Number.isFinite(stockQty)) {
      const inCart = getVariationCartQuantity(item, selectedVariation);
      return inCart + addQty > stockQty;
    }
    if (!managesStock) return false;
    return true;
  };

  const addProductToCart = async (item, selectionPayload) => {
    if (!item) return;
    const selectedVariation = selectionPayload?.variation ?? null;
    const selectedVariationOutOfStock = isVariationOutOfStock(selectedVariation);
    if (selectedVariationOutOfStock) return;
    if (selectedVariation) {
      if (isVariationQuantityBlocked(item, selectedVariation, 1)) return;
    } else {
      const blocked = stockBlockedReason(item, lines, 1);
      if (blocked) {
        window.alert(blocked);
        return;
      }
    }
    const raw = selectedVariation
      ? resolveProductPriceRaw(selectedVariation, {
          locale,
          fallbackCountry: "fr",
          overrideRawPrice: selectedVariation?.priceRaw,
        })
      : resolveProductPriceRaw(item, { locale, fallbackCountry: "fr" });
    const unit = parsePrice(raw);
    const variationDatabaseId = Number(selectedVariation?.databaseId);
    const hasVariation = Number.isInteger(variationDatabaseId) && variationDatabaseId > 0;
    const selectedVariationAttributes = Array.isArray(selectedVariation?.attributes?.nodes)
      ? selectedVariation.attributes.nodes
      : Array.isArray(selectedVariation?.attributes)
        ? selectedVariation.attributes
        : [];
    const variationAttributes = Array.isArray(selectedVariationAttributes)
      ? selectedVariationAttributes
          .map((attr) => ({
            attributeName: String(
              attr?.name ?? attr?.attributeName ?? attr?.label ?? "",
            ).trim(),
            attributeValue: String(
              attr?.value ?? attr?.option ?? attr?.attributeValue ?? "",
            ).trim(),
          }))
          .filter((attr) => attr.attributeName && attr.attributeValue)
      : [];
    setAddToCartSubmitting(true);
    try {
      await addToCart({
        id: hasVariation ? `${item.id}::${variationDatabaseId}` : item.id,
        databaseId: item.databaseId,
        slug: item.slug,
        name:
          hasVariation && variationAttributes.length > 0
            ? `${item.name} (${variationAttributes
                .map((attr) => attr.attributeValue)
                .join(" / ")})`
            : item.name,
        unitPriceBase: unit,
        imageUrl:
          selectedVariation?.imageUrl ||
          selectedVariation?.image?.sourceUrl ||
          selectedVariation?.featuredImage?.node?.sourceUrl ||
          item.featuredImage?.node?.sourceUrl ||
          item.image?.sourceUrl,
        qty: 1,
        maxStock: effectiveMaxStock(item),
        syncRemote: true,
        variationId: hasVariation ? variationDatabaseId : undefined,
        variation: variationAttributes,
      });
    } finally {
      setAddToCartSubmitting(false);
    }
  };

  const getAddToCartDisabled = (item, selectionPayload) => {
    if (addToCartSubmitting) return true;
    const selectedVariation = selectionPayload?.variation ?? null;
    if (selectedVariation) {
      if (isVariationOutOfStock(selectedVariation)) return true;
      if (isVariationQuantityBlocked(item, selectedVariation, 1)) return true;
      return false;
    }
    return isAddToCartStockBlocked(item, lines, 1);
  };
  return (
    <ProductDetail
      product={product}
      locale={locale}
      relatedProducts={relatedProducts}
      popupProducts={popupProducts}
      shapeFilters={shapeFilters}
      accordionItems={accordionItems}
      productDescriptionLinks={productDescriptionLinks}
      founderSection={founderSection}
      icaSection={icaSection}
      addToCartSubmitting={addToCartSubmitting}
      getAddToCartDisabled={getAddToCartDisabled}
      onAddToCart={(selectionPayload) => addProductToCart(product, selectionPayload)}
      onAddRelatedToCart={(item, selectionPayload) => addProductToCart(item, selectionPayload)}
      storiesSectionData={storiesSectionData}
      secondStoriesSectionData={secondStoriesSectionData}
    />
  );
}
