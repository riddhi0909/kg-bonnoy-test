"use client";

import { useEffect,useMemo, useState } from "react";
import Link from "next/link";
import { categoryPath, homePath } from "@/constants/routes";
import { CategoryGemScroller } from "@/modules/category/components/CategoryGemScroller";
import { CategoryFilterPanel, CategoryToolbar } from "@/modules/category/components/CategoryToolbar";
import { CategoryPlpGrid } from "@/modules/category/components/CategoryPlpGrid";
import {
  applyCategoryPlpFilters,
  filterProductsByNameQuery,
} from "@/modules/category/utils/category-plp-apply-filters";

const INITIAL_PRODUCT_PAGE = 12;
const LOAD_MORE_INCREMENT = 16;
/**
 * Client section for PLP controls + grid view state + progressive "Voir plus".
 * @param {{
 *   locale: string;
 *   categories: object[];
 *   currentSlug: string;
 *   mainCategorySlug?: string;
 *   mainCategoryName?: string;
 *   currentCategoryName?: string;
 *   displayCount: number;
 *   products: object[];
 *   featurePosts?: Array<object | null | undefined>;
 * }} props
 */
export function CategoryPlpSection({
  locale,
  categories,
  currentSlug,
  mainCategorySlug,
  mainCategoryName,
  currentCategoryName,
  products,
  featurePosts,
  plpAttributeStore = null,
}) {
  const [view, setView] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCT_PAGE);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(null);

  useEffect(() => {
    if (!filterOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filterOpen]);

  useEffect(() => {
    setVisibleCount(INITIAL_PRODUCT_PAGE);
  }, [searchQuery, appliedFilters, products]);

  const filteredSorted = useMemo(() => {
    const searched = filterProductsByNameQuery(products, searchQuery);
    return applyCategoryPlpFilters(searched, appliedFilters);
  }, [products, searchQuery, appliedFilters]);

  const visibleProducts = useMemo(
    () => filteredSorted.slice(0, visibleCount),
    [filteredSorted, visibleCount],
  );

  const resultCount = filteredSorted.length;
  const hasMore = visibleCount < filteredSorted.length && filteredSorted.length > INITIAL_PRODUCT_PAGE;
  const mainLabel = String(mainCategoryName || "").trim() || "Catégorie";
  const currentLabel = String(currentCategoryName || "").trim() || "Catégorie";
  const mainHref = mainCategorySlug ? categoryPath(locale, mainCategorySlug) : undefined;
  const isParentCategoryPage =
    String(mainCategorySlug || "").trim() === String(currentSlug || "").trim();

  return (
    <div className="space-y-[30px] px-4 pb-[60px] max-[768px]:pb-[30px] pt-3 min-[1440px]:px-[60px]">

      <div>
        <nav
          aria-label="Fil d'ariane produit"
          className="min-w-0 text-[14px] leading-[2] text-[#00112280] max-[768px]:text-center flex items-center gap-[10px]"
        >
          <Link href={homePath(locale)} className="hover:text-[#001122]">
            Accueil
          </Link>
          <span className="px-2 text-[17px]">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7.5 4L13.5 10L7.5 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {!isParentCategoryPage && mainHref ? (
            <>
              <Link href={mainHref} className="hover:text-[#001122]">
                {mainLabel}
              </Link>
              <span className="px-2 text-[17px]">›</span>
            </>
          ) : null}
          <span className="text-[#001122]">{currentLabel}</span>
        </nav>
      </div>

      <CategoryGemScroller locale={locale} categories={categories} currentSlug={currentSlug} />

      <CategoryToolbar
        view={view}
        onViewChange={setView}
        isFilterOpen={filterOpen}
        onFilterClick={() => setFilterOpen((open) => !open)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-col gap-6 min-[1024px]:flex-row min-[1024px]:items-start min-[1024px]:gap-8">
        {filterOpen ? (
          <div className="w-full shrink-0 min-[1024px]:sticky min-[1024px]:top-28 min-[1024px]:z-[1] min-[1024px]:w-[min(100%,400px)] min-[1024px]:max-w-[420px] min-[1024px]:self-start">
            <CategoryFilterPanel
              variant="inline"
              catalogProducts={products}
              searchQuery={searchQuery}
              plpAttributeStore={plpAttributeStore}
              appliedFilters={appliedFilters}
              onClose={() => setFilterOpen(false)}
              onFiltersChange={(payload) => {
                setAppliedFilters(payload == null ? null : payload);
                setVisibleCount(INITIAL_PRODUCT_PAGE);
              }}
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-[30px]">
          <p className="font-serif text-[21px] font-normal leading-[1.19] text-[#001122]">{resultCount} pierres trouvées</p>

          {visibleProducts.length ? (
            <CategoryPlpGrid products={visibleProducts} locale={locale} view={view} featurePosts={featurePosts} />
          ) : (
            <div className="rounded-sm border border-[rgba(0,17,34,0.2)] bg-white p-6 text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">
              Aucun produit ne correspond à votre recherche.
            </div>
          )}

          {hasMore ? (
            <div className="flex justify-start min-[1024px]:justify-end">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + LOAD_MORE_INCREMENT)}
                className="group cursor-pointer inline-flex h-10 min-w-[160px] items-center justify-center gap-[15px] border border-[rgba(0,17,34,0.2)] bg-[#f5eee5] px-6 py-2 text-sm font-medium leading-[1.2] text-[#001122] transition-colors hover:border-[#001122] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] hover:bg-[#001122] hover:text-white"
              >
                Voir plus
                <span aria-hidden="true">
                  <svg className="transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10" />
                  </svg>
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

