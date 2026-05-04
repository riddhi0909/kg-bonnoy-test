"use client";

import { useMutation } from "@apollo/client/react";
import { ADD_TO_CART } from "@/modules/cart/api/mutations";
import { useCartStore } from "@/modules/cart/store/cart-store";
import { errorToCartMessage } from "@/modules/cart/utils/cart-messages";
import { qtyInCartForItem } from "@/modules/cart/utils/product-stock";

/**
 * Local cart + optional WooCommerce `addToCart` when `productDatabaseId` is set.
 * The line is added locally first, the drawer opens, then the server is synced.
 * Remote sync is best-effort: failures are logged in development only so headless/session issues do not spam users with alerts.
 */
export function useCart() {
  const lines = useCartStore((s) => s.lines);
  const drawerOpen = useCartStore((s) => s.drawerOpen);
  const addLine = useCartStore((s) => s.addLine);
  const removeLine = useCartStore((s) => s.removeLine);
  const updateQty = useCartStore((s) => s.updateQty);
  const clear = useCartStore((s) => s.clear);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const closeDrawer = useCartStore((s) => s.closeDrawer);

  const [mutate, result] = useMutation(ADD_TO_CART);

  /**
   * @param {object} p
   * @param {string} p.id
   * @param {number} [p.databaseId]
   * @param {string} p.slug
   * @param {string} p.name
   * @param {number} p.unitPriceBase
   * @param {number} [p.qty]
   * @param {boolean} [p.syncRemote]
   * @param {string} [p.imageUrl]
   * @param {number} [p.variationId]
   * @param {{ attributeName: string; attributeValue: string }[]} [p.variation]
   * @param {number} [p.maxStock] When set (>0), cannot add more than this total (with cart), e.g. from product.stockQuantity.
   */
  async function addToCart(p) {
    const qty = p.qty ?? 1;
    const max = p.maxStock;
    if (max != null && Number.isFinite(max) && max > 0) {
      const inCart = qtyInCartForItem(useCartStore.getState().lines, {
        id: p.id,
        databaseId: p.databaseId,
      });
      if (inCart + qty > max) {
        return;
      }
    }
    addLine({
      id: p.id,
      databaseId: p.databaseId,
      slug: p.slug,
      name: p.name,
      unitPriceBase: p.unitPriceBase,
      qty,
      imageUrl: p.imageUrl,
      variationId: p.variationId,
      variation: Array.isArray(p.variation) ? p.variation : undefined,
    });
    openDrawer();

    if (p.syncRemote && p.databaseId != null) {
      try {
        const result = await mutate({
          variables: {
            productId: Number(p.databaseId),
            quantity: qty,
            variationId:
              p.variationId != null ? Number(p.variationId) : undefined,
            variation:
              Array.isArray(p.variation) && p.variation.length > 0
                ? p.variation
                : undefined,
          },
        });
        if (result.errors?.length) {
          throw Object.assign(new Error(result.errors[0].message), {
            graphQLErrors: result.errors,
          });
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[cart] WooCommerce sync failed:", errorToCartMessage(e));
        }
      }
    }
  }

  return {
    lines,
    drawerOpen,
    addToCart,
    removeLine,
    updateQty,
    clear,
    openDrawer,
    closeDrawer,
    remote: result,
  };
}
