function sameCartLine(line, item) {
  if (!item) return false;
  if (line.id === item.id) return true;
  if (item.databaseId == null || line.databaseId == null) return false;
  return Number(line.databaseId) === Number(item.databaseId);
}

/**
 * @param {{ id: string; databaseId?: number; qty: number }[]} lines
 * @param {{ id?: string; databaseId?: number } | null | undefined} item
 */
export function qtyInCartForItem(lines, item) {
  if (!item) return 0;
  const line = lines.find((l) => sameCartLine(l, item));
  return line?.qty ?? 0;
}

/**
 * Positive stock cap from GraphQL when the API exposes a real quantity (> 0).
 * Variable parents often send 0 while variations hold stock — ignore max in that case.
 * @param {object | null | undefined} item
 * @returns {number | undefined}
 */
export function effectiveMaxStock(item) {
  if (!item || item.stockQuantity == null) return undefined;
  const max = Number(item.stockQuantity);
  if (!Number.isFinite(max) || max <= 0) return undefined;
  return max;
}

/**
 * @returns {string | null} User-facing reason when add should be blocked, else null.
 */
export function stockBlockedReason(item, lines, addQty = 1) {
  if (!item) return "Produit indisponible.";
  if (item.stockStatus === "OUT_OF_STOCK") {
    return "Ce produit n'est plus en stock.";
  }
  const inCart = qtyInCartForItem(lines, item);
  const max = effectiveMaxStock(item);
  if (max != null && inCart + addQty > max) {
    return `Stock insuffisant : ${max} disponible(s), ${inCart} déjà dans votre panier.`;
  }
  return null;
}

/**
 * @returns {boolean}
 */
export function isAddToCartStockBlocked(item, lines, addQty = 1) {
  return stockBlockedReason(item, lines, addQty) != null;
}
