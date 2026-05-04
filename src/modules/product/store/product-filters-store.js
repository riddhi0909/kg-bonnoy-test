"use client";

import { create } from "zustand";

/**
 * Local UI filters for product listing (category slug, search, sort).
 * @typedef {{ categorySlug: string | null; search: string; sort: string }} ProductFilters
 */

export const useProductFiltersStore = create((set) => ({
  categorySlug: null,
  search: "",
  sort: "DATE",
  setCategorySlug: (categorySlug) => set({ categorySlug }),
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
  reset: () =>
    set({ categorySlug: null, search: "", sort: "DATE" }),
}));
