"use client";

import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_PRODUCTS } from "@/modules/search/api/queries";

/**
 * @param {number} [first]
 */
export function useProductSearch(first = 12) {
  const [run, result] = useLazyQuery(SEARCH_PRODUCTS);
  /**
   * @param {string} term
   */
  function search(term) {
    if (!term.trim()) return;
    return run({ variables: { search: term.trim(), first } });
  }
  return { search, ...result };
}
