"use client";

import { useQuery } from "@apollo/client/react";
import { GET_CUSTOMER_ORDERS } from "@/modules/order/api/queries";

/**
 * @param {string | number | null} customerDbId
 */
export function useOrders(customerDbId, first = 20) {
  return useQuery(GET_CUSTOMER_ORDERS, {
    variables: {
      customerId: customerDbId != null ? String(customerDbId) : "",
      first,
    },
    skip: customerDbId == null,
  });
}
