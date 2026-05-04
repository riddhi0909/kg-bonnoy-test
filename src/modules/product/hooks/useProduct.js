"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_BY_SLUG } from "@/modules/product/api/queries";

/**
 * @param {string | undefined} slug
 */
export function useProduct(slug) {
  return useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { id: slug ?? "" },
    skip: !slug,
  });
}
