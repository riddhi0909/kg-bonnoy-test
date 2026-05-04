"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "@/modules/product/api/queries";

/**
 * @param {{ first?: number; after?: string | null }} variables
 */
export function useProducts(variables = {}) {
  return useQuery(GET_PRODUCTS, {
    variables: {
      first: variables.first ?? 12,
      after: variables.after ?? null,
    },
    notifyOnNetworkStatusChange: true,
  });
}
