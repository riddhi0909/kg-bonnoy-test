"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  countMatchingWithFacetOverride,
  filterProductsByNameQuery,
} from "@/modules/category/utils/category-plp-apply-filters";
import {
  PLP_ATTRIBUTE_FACETS,
  collectFacetOptionValues,
  normalizePlpFacetOptionKey,
} from "@/modules/category/utils/category-plp-attribute-facets";
function FilterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M0 8H4M4 6V10M12 0V4M8 12V16M0 2H10M12 2H16M16 8H6M16 14H8M0 14H6" stroke="#001122" strokeOpacity="0.75" strokeMiterlimit="10" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="cursor-pointer"
    aria-hidden
  >
    <path d="M15.5 15.5L11.5 11.5M13.5 7C13.5 10.5899 10.5899 13.5 7 13.5C3.41015 13.5 0.5 10.5899 0.5 7C0.5 3.41015 3.41015 0.5 7 0.5C10.5899 0.5 13.5 3.41015 13.5 7Z" stroke="#001122" strokeOpacity="0.75" strokeMiterlimit="10" />
    </svg>
  );
}
const PLP_SEGMENTED_SECTIONS = [
  {
    key: "prix",
    label: "Prix",
    columns: 6,
    options: [
      { value: "<1", label: "< 1 K€" },
      { value: "<2", label: "< 2 K€" },
      { value: "<5", label: "< 5 K€" },
      { value: "<10", label: "< 10 K€" },
      { value: "<20", label: "< 20 K€" },
      { value: "+20", label: "+ 20 K€" },
    ],
  },
  {
    key: "poids",
    label: "Poids (ct)",
    columns: 5,
    options: [
      { value: "<1", label: "< 1 ct" },
      { value: "<2", label: "< 2 ct" },
      { value: "<5", label: "< 5 ct" },
      { value: "<10", label: "< 10 ct" },
      { value: "+10", label: "+ 10 ct" },
    ],
  },
];


/** Figma-style toolbar with list/grid view toggle. */
export function CategoryToolbar({
  view = "grid",
  onViewChange,
  isFilterOpen = false,
  onFilterClick,
  searchQuery = "",
  onSearchChange,
}) {
  const searchInputRef = useRef(null);
  const btn =
    "inline-flex items-center gap-[8px] border-0 bg-transparent p-0 text-[14px] font-semibold leading-[1.428] text-[rgba(0, 17, 34, 0.75)] transition hover:opacity-70 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] cursor-pointer";
  return (  
    <div className="flex items-center justify-between border-t border-[rgba(0,17,34,0.2)] pt-[25px] pb-[0px]">
      <button
        type="button"
        className={btn}
        aria-label="Filtrer"
        aria-expanded={isFilterOpen}
        aria-controls="category-filter-panel"
        onClick={() => onFilterClick?.()}
      >
        <FilterIcon />
        Filtrer
      </button>
      <div className="ml-4 inline-flex items-center gap-[30px] text-[#001122] ">
        <div className="flex items-center gap-[8px]">
        <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Rechercher"
            className="w-[100px] cursor-pointer border-0 bg-transparent p-0 text-[14px] font-semibold leading-[1.428] text-[rgba(0,17,34,0.75)] placeholder:text-[rgba(0,17,34,0.75)] outline-none [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
            aria-label="Rechercher"
          />
          <button
            type="button"
            className="inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#001122] hover:opacity-70"
            aria-label="Rechercher"
            onClick={() => searchInputRef.current?.focus()}
          >
            <SearchIcon />
          </button>
        </div>
        <div className="flex items-center gap-[8px] max-[767px]:hidden">
          <button
            type="button"
            className={btn}
            aria-label="Liste"
            aria-pressed={view === "list"}
            onClick={() => onViewChange?.("list")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15.5 0.5V15.5H0.5V0.5H15.5Z" stroke="#001122" strokeOpacity={view === "list" ? "1" : "0.5"} />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Grille"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange?.("grid")}
            className="flex h-[18px] w-[18px] items-center justify-center text-[#001122] hover:opacity-70 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15.5 9.5V15.5H9.5V9.5H15.5ZM6.5 9.5V15.5H0.5V9.5H6.5ZM15.5 0.5V6.5H9.5V0.5H15.5ZM6.5 0.5V6.5H0.5V0.5H6.5Z" stroke="#001122" strokeOpacity={view === "grid" ? "1" : "0.5"} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function CategoryFilterPanel({
  onClose,
  onFiltersChange,
  variant = "overlay",
  catalogProducts = [],
  searchQuery = "",
  plpAttributeStore = null,
  appliedFilters = null,
}) {
  const DEFAULT_OPEN = {
    prix: true,
    forme: true,
    poids: true,
    clarte: false,
    traitement: false,
    origine: false,
  };
  const [openSections, setOpenSections] = useState(DEFAULT_OPEN);
  const [sortBy, setSortBy] = useState("best");
  const [singleValues, setSingleValues] = useState({ prix: null, poids: null });
  const [multiValues, setMultiValues] = useState({
    forme: "",
    clarte: "",
    traitement: "",
    origine: "",
  });

  useEffect(() => {
    setSortBy(appliedFilters?.sortBy ?? "best");
    setSingleValues({
      prix: appliedFilters?.prix ?? null,
      poids: appliedFilters?.poids ?? null,
    });
    setMultiValues({
      forme: appliedFilters?.forme ?? "",
      clarte: appliedFilters?.clarte ?? "",
      traitement: appliedFilters?.traitement ?? "",
      origine: appliedFilters?.origine ?? "",
    });
  }, [appliedFilters]);

  const sortOptions = [
    { value: "best", label: "Best sellers" },
    { value: "new", label: "Nouveautés" },
    { value: "asc", label: "Prix croissant" },
    { value: "desc", label: "Prix décroissant" },
  ];

  const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const setSegmentValue = (key, value) => setSingleValues((prev) => ({ ...prev, [key]: value }));
  const resetAll = () => {
    setSortBy("best");
    setSingleValues({ prix: null, poids: null });
    setMultiValues({ forme: "", clarte: "", traitement: "", origine: "" });
    setOpenSections(DEFAULT_OPEN);
    onFiltersChange?.(null);
  };

  const emitFilters = () => {
    onFiltersChange?.({
      sortBy,
      prix: singleValues.prix,
      poids: singleValues.poids,
      ...multiValues,
    });
  };

  const baseProducts = useMemo(
    () => filterProductsByNameQuery(catalogProducts, searchQuery),
    [catalogProducts, searchQuery],
  );

  const attributeFacets = useMemo(
    () =>
      PLP_ATTRIBUTE_FACETS.map((f) => {
        const rows = plpAttributeStore?.termRowsByFacet?.[f.key];
        const dynamicOptions =
          rows && rows.length > 0
            ? rows.map((r) => r.name).filter(Boolean)
            : collectFacetOptionValues(baseProducts, f.key);
        const options = dynamicOptions.length > 0 ? dynamicOptions : (f.fallbackOptions ?? []);
        return { ...f, options };
      }),
    [baseProducts, plpAttributeStore],
  );

  const draftFilters = useMemo(
    () => ({
      sortBy,
      prix: singleValues.prix,
      poids: singleValues.poids,
      ...multiValues,
    }),
    [sortBy, singleValues, multiValues],
  );

  const facetCounts = useMemo(() => {
    const termRows = plpAttributeStore?.termRowsByFacet;
    const storeCounts = plpAttributeStore?.countsByFacet;
    const hasStoreTerms =
      termRows &&
      storeCounts &&
      PLP_ATTRIBUTE_FACETS.some((f) => (termRows[f.key] ?? []).length > 0);
    if (hasStoreTerms) {
      const out = {};
      for (const facet of attributeFacets) {
        out[facet.key] = {};
        for (const opt of facet.options) {
          const k = normalizePlpFacetOptionKey(opt);
          out[facet.key][opt] = storeCounts[facet.key]?.[k] ?? 0;
        }
      }
      return out;
    }
    const out = {};
    for (const facet of attributeFacets) {
      const m = {};
      for (const opt of facet.options) {
        m[opt] = countMatchingWithFacetOverride(baseProducts, draftFilters, facet.key, { [facet.key]: opt });
      }
      out[facet.key] = m;
    }
    return out;
  }, [plpAttributeStore, attributeFacets, baseProducts, draftFilters]);

  const pillBtn =
    "inline-flex h-[24px] w-full min-w-0 items-center justify-center rounded-full px-1 text-[12px] leading-[1] whitespace-nowrap cursor-pointer [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]";
  const fieldLabel =
    "text-[14px] font-normal leading-[1.43] text-[rgba(0,17,34,0.8)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]";

  const isInline = variant === "inline";
  const asideClass = isInline
    ? "flex min-h-0 w-full max-h-[min(85vh,920px)] flex-col border border-[rgba(0,17,34,0.2)] bg-[#FFFAF5] shadow-[0_2px_20px_rgba(0,17,34,0.06)]"
    : "h-full min-h-[640px] w-full border border-[rgba(0,17,34,0.2)] bg-[#FFFAF5]";
  const scrollBar =
    "[scrollbar-width:thin] [scrollbar-color:rgba(0,17,34,0.22)_transparent] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(0,17,34,0.28)]";
  const scrollClass = isInline
    ? `min-h-0 flex-1 overflow-y-auto ${scrollBar}`
    : `h-[calc(100%-108px)] overflow-y-auto ${scrollBar}`;

    return (
      <aside id="category-filter-panel" className={asideClass}>
      <div className="flex shrink-0 items-center justify-between border-b border-[rgba(0,17,34,0.18)] px-6 py-5">
        <p className="text-[14px] font-semibold leading-[1.43] text-[#001122] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
          Filtres
        </p>
        <button type="button" aria-label="Fermer" className="cursor-pointer text-[30px] font-light leading-none text-[rgba(0,17,34,0.72)]" onClick={onClose}>          
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.355469 0.353516L15.3555 15.3535M15.3555 0.353516L0.355469 15.3535" stroke="#001122"/>
          </svg>
        </button>
      </div>

      <div className={scrollClass}>
        <section className="border-b border-[rgba(0,17,34,0.18)] px-6 py-4">
          <p className="mb-4 text-[14px] leading-[1.43] text-[rgba(0,17,34,0.5)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
            Trier par :
          </p>
          <div className="grid grid-cols-2 gap-y-2">
            {sortOptions.map((option) => (
              <label key={option.value} className="inline-flex cursor-pointer items-center gap-3 text-[14px] font-normal leading-[1.43] text-[rgba(0,17,34,0.8)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                <input type="radio" name="sortBy" checked={sortBy === option.value} onChange={() => setSortBy(option.value)} className="h-4 w-4 cursor-pointer accent-[#001122]" />
                {option.label}
              </label>
            ))}
          </div>
        </section>

        <section className="border-b border-[rgba(0,17,34,0.18)] px-6 py-4">
          <button type="button" onClick={() => toggleSection("prix")} className="flex w-full cursor-pointer items-center justify-between">
            <span className={fieldLabel}>Prix</span>
            <span className="text-[22px] text-[rgba(0,17,34,0.7)]">
              {openSections.prix ? (
                <svg width="10" height="1" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0.5H0" stroke="#001122" strokeMiterlimit="10" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 0V10M10 5H0" stroke="#001122" strokeMiterlimit="10" />
                </svg>
              )}
            </span>
          </button>
          {openSections.prix ? (
            <div className="mt-4">
              <div className="grid grid-cols-6 gap-0 overflow-hidden rounded-full bg-[#cccdcf] p-[1px]">
                {PLP_SEGMENTED_SECTIONS[0].options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    translate="no"
                    onClick={() => setSegmentValue("prix", option.value)}
                    className={`${pillBtn} ${singleValues.prix === option.value ? "border border-[#001122] bg-white text-[#001122]" : "text-[rgba(0,17,34,0.45)]"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {attributeFacets[0] ? (
          <section className="border-b border-[rgba(0,17,34,0.18)] px-6 py-4">
            <button
              type="button"
              onClick={() => toggleSection(attributeFacets[0].key)}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <span className={fieldLabel}>{attributeFacets[0].label}</span>
              <span className="text-[22px] text-[rgba(0,17,34,0.7)]">
                {openSections[attributeFacets[0].key] ? "−" : "+"}
              </span>
            </button>
            {openSections[attributeFacets[0].key] ? (
              <div className="mt-4 grid grid-cols-2 gap-y-2">
                {attributeFacets[0].options.filter((option) => (facetCounts[attributeFacets[0].key]?.[option] ?? 0) > 0).length === 0 ? (
                  <p className="col-span-2 text-[13px] leading-[1.4] text-[rgba(0,17,34,0.45)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                    Aucune valeur pour cette recherche.
                  </p>
                ) : (
                  attributeFacets[0].options
                    .filter((option) => (facetCounts[attributeFacets[0].key]?.[option] ?? 0) > 0)
                    .map((option) => {
                    const fk = attributeFacets[0].key;
                    const c = facetCounts[fk]?.[option] ?? 0;
                    return (
                      <label
                        key={option}
                        className="inline-flex min-w-0 cursor-pointer items-start gap-3 text-[14px] font-normal leading-[1.43] text-[rgba(0,17,34,0.8)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
                      >
                        <input
                          type="radio"
                          name={fk}
                          checked={multiValues[fk] === option}
                          onChange={() => setMultiValues((prev) => ({ ...prev, [fk]: option }))}
                          className="mt-[2px] h-4 w-4 shrink-0 cursor-pointer accent-[#001122]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="break-words">{option}</span>
                          <span className="ml-1 whitespace-nowrap text-[rgba(0,17,34,0.45)]">({c})</span>
                        </span>
                      </label>
                    );
                    })
                )}
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="border-b border-[rgba(0,17,34,0.18)] px-6 py-4">
          <button type="button" onClick={() => toggleSection("poids")} className="flex w-full cursor-pointer items-center justify-between">
            <span className={fieldLabel}>Poids (ct)</span>
            <span className="text-[22px] text-[rgba(0,17,34,0.7)]">{openSections.poids ? "−" : "+"}</span>
          </button>
          {openSections.poids ? (
            <div className="mt-4">
              <div className="grid grid-cols-5 gap-0 overflow-hidden rounded-full bg-[#cccdcf] p-[1px]">
                {PLP_SEGMENTED_SECTIONS[1].options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSegmentValue("poids", option.value)}
                    className={`${pillBtn} ${singleValues.poids === option.value ? "border border-[#001122] bg-white text-[#001122]" : "text-[rgba(0,17,34,0.45)]"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {attributeFacets.slice(1).map(({ key, label, options }) => (
          <section key={key} className="border-b border-[rgba(0,17,34,0.18)] px-6 py-4">
            <button type="button" onClick={() => toggleSection(key)} className="flex w-full cursor-pointer items-center justify-between">
              <span className={fieldLabel}>{label}</span>
              <span className="text-[22px] text-[rgba(0,17,34,0.7)]">{openSections[key] ? "−" : "+"}</span>
            </button>
            {openSections[key] ? (
              <div className="mt-4 grid grid-cols-2 gap-y-2">
                {options.filter((option) => (facetCounts[key]?.[option] ?? 0) > 0).length === 0 ? (
                  <p className="col-span-2 text-[13px] leading-[1.4] text-[rgba(0,17,34,0.45)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                    Aucune valeur pour cette recherche.
                  </p>
                ) : (
                  options
                    .filter((option) => (facetCounts[key]?.[option] ?? 0) > 0)
                    .map((option) => {
                    const countMap = facetCounts[key] ?? {};
                    const c = countMap[option] ?? 0;
                    return (
                      <label
                        key={option}
                        className="inline-flex min-w-0 cursor-pointer items-start gap-3 text-[14px] font-normal leading-[1.43] text-[rgba(0,17,34,0.8)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
                      >
                        <input
                          type="radio"
                          name={key}
                          checked={multiValues[key] === option}
                          onChange={() => setMultiValues((prev) => ({ ...prev, [key]: option }))}
                          className="mt-[2px] h-4 w-4 shrink-0 cursor-pointer accent-[#001122]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="break-words">{option}</span>
                          <span className="ml-1 whitespace-nowrap text-[rgba(0,17,34,0.45)]">({c})</span>
                        </span>
                      </label>
                    );
                    })
                )}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-[rgba(0,17,34,0.18)] px-6 py-4">
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex h-[40px] cursor-pointer items-center justify-center border border-[rgba(0,17,34,0.2)] bg-transparent text-[14px] font-semibold text-[rgba(0,17,34,0.76)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
        >
          Réinitialiser
        </button>
        <button
          type="button"
          onClick={emitFilters}
          className="inline-flex h-[40px] cursor-pointer items-center justify-center gap-2 bg-[#001122] text-[14px] font-semibold text-white [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
        >
          Valider
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10" />
            </svg>
          </span>
        </button>
      </div>
    </aside>
  );
}