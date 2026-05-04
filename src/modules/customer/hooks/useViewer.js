"use client";

import { useQuery } from "@apollo/client/react";
import { VIEWER } from "@/modules/customer/api/queries";

export function useViewer() {
  return useQuery(VIEWER, { fetchPolicy: "cache-and-network" });
}
