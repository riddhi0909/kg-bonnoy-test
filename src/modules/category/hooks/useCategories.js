"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_CATEGORIES } from "@/modules/category/api/queries";

export function useCategories(first = 50) {
  return useQuery(GET_PRODUCT_CATEGORIES, {
    variables: { first },
  });
}
