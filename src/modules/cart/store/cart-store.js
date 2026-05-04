"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Offline-first cart lines until Woo session is wired via GraphQL `cart` mutations.
 * @typedef {{
 *   id: string;
 *   databaseId?: number;
 *   slug: string;
 *   name: string;
 *   qty: number;
 *   unitPriceBase: number;
 *   imageUrl?: string;
 *   variationId?: number;
 *   variation?: { attributeName: string; attributeValue: string }[];
 * }} CartLine
 */

export const useCartStore = create(
  persist(
    (set, get) => ({
      /** @type {CartLine[]} */
      lines: [],
      drawerOpen: false,
      /**
       * @param {Omit<CartLine, 'qty'> & { qty?: number }} line
       */
      addLine(line) {
        const qty = line.qty ?? 1;
        const lines = get().lines;
        const idx = lines.findIndex((l) => l.id === line.id);
        if (idx >= 0) {
          const next = [...lines];
          next[idx] = {
            ...next[idx],
            ...line,
            qty: next[idx].qty + qty,
            // Keep existing id and preserve old image if new one is missing.
            id: next[idx].id,
            imageUrl: line.imageUrl || next[idx].imageUrl,
          };
          set({ lines: next });
          return;
        }
        set({ lines: [...lines, { ...line, qty }] });
      },
      removeLine(id) {
        set({ lines: get().lines.filter((l) => l.id !== id) });
      },
      updateQty(id, qty) {
        if (!Number.isFinite(qty) || qty < 1) return;
        const next = get().lines.map((l) =>
          l.id === id ? { ...l, qty: Math.floor(qty) } : l,
        );
        set({ lines: next });
      },
      clear() {
        set({ lines: [] });
      },
      openDrawer() {
        set({ drawerOpen: true });
      },
      closeDrawer() {
        set({ drawerOpen: false });
      },
    }),
    { name: "headless-cart" },
  ),
);
