"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCurrency } from "@/modules/common/providers/currency-context";
import { formatMoneySymbolFirst } from "@/modules/common/utils/format-money";
import { parsePrice, resolveProductPriceNumber } from "@/modules/common/utils/price";
import { productsPath } from "@/constants/routes";
import { productPath } from "@/modules/product/routes/paths";
import { cn } from "@/modules/common/utils/cn";

const ACCENT_ORANGE = "#FF6633";
const INK_20 = "rgba(0, 17, 34, 0.2)";

/** Prev/next — same pattern as `HomeProductStrip` scroll controls (compact for card width). */
function RelatedThumbScrollNav({ dir, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center text-[#001122] transition-colors duration-300 hover:text-[#FF6633] disabled:cursor-not-allowed disabled:opacity-25"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {dir === "prev" ? (
          <path
            d="M12.5 4L6.5 10L12.5 16"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M7.5 4L13.5 10L7.5 16"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

/**
 * Horizontal thumb scroller + progress bar + prev/next (matches homepage strip UX).
 * @param {{ children: import("react").ReactNode; scrollClassName: string; syncKey?: string; listAriaLabel?: string }} props
 */
function RelatedThumbsScrollWithNav({ children, scrollClassName, syncKey = "", listAriaLabel = "Produits associés" }) {
  const scrollRef = useRef(null);
  const mountedRef = useRef(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const updateScrollUi = useCallback(() => {
    if (!mountedRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScroll(max > 2);
    if (el.scrollWidth <= el.clientWidth) {
      setScrollProgress(1);
      setAtStart(true);
      setAtEnd(true);
      return;
    }
    const ratio = (el.scrollLeft + el.clientWidth) / el.scrollWidth;
    setScrollProgress(Math.min(1, Math.max(0, ratio)));
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);



  useEffect(() => {
    mountedRef.current = true;
    const el = scrollRef.current;
    if (!el) return undefined;
    updateScrollUi();
    el.addEventListener("scroll", updateScrollUi, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateScrollUi) : null;
    ro?.observe(el);
    return () => {
      mountedRef.current = false;
      el.removeEventListener("scroll", updateScrollUi);
      ro?.disconnect();
    };
  }, [syncKey, updateScrollUi]);

  const scrollStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 52;
    const first = el.querySelector("[data-related-thumb]");
    const second = first?.nextElementSibling;
    if (first && "offsetWidth" in first) {
      let gap = 8;
      if (second && "offsetLeft" in second && "offsetLeft" in first) {
        gap = second.offsetLeft - first.offsetLeft - first.offsetWidth;
      }
      return first.offsetWidth + Math.max(0, gap);
    }
    return 52;
  }, []);

  const goPrev = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -scrollStep(), behavior: "smooth" });
  }, [scrollStep]);

  const goNext = useCallback(() => {
    scrollRef.current?.scrollBy({ left: scrollStep(), behavior: "smooth" });
  }, [scrollStep]);

  const trackFill = `${scrollProgress * 100}%`;

  return (
    <div className="flex min-w-0 w-full flex-col gap-0">
      <div
        ref={scrollRef}
        role="list"
        aria-label={listAriaLabel}
        className={cn(
          scrollClassName,
          "strip-hide-scrollbar min-h-0 min-w-0 max-w-full flex-nowrap overflow-x-auto overscroll-x-contain",
        )}
      >
        {children}
      </div>
      {canScroll ? (
        <div className="flex w-full min-w-0 items-center gap-2 px-1">
          <div
            className="relative h-[2px] min-h-[2px] min-w-0 flex-1 rounded-full"
            style={{ backgroundColor: INK_20 }}
            aria-hidden
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#001122] transition-[width] duration-150 ease-out"
              style={{ width: trackFill }}
            />
          </div>
          <div className="flex shrink-0 items-center">
            <RelatedThumbScrollNav
              dir="prev"
              label="Voir les produits associés précédents"
              onClick={goPrev}
              disabled={!canScroll || atStart}
            />
            <RelatedThumbScrollNav
              dir="next"
              label="Voir les produits associés suivants"
              onClick={goNext}
              disabled={!canScroll || atEnd}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Split strip meta into chips — only real API/WP data (no placeholder tags). */
function splitStripAttrLabels(meta) {
  return String(meta || "")
    .split(/\s*·\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeAttributeKey(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/^pa_/, "");
}

function getProductAttributeValue(product, targetKey) {
  const attrs = Array.isArray(product?.attributes?.nodes) ? product.attributes.nodes : [];
  const node = attrs.find((attr) => normalizeAttributeKey(attr?.name) === normalizeAttributeKey(targetKey));
  const options = Array.isArray(node?.options) ? node.options : [];
  const values = options.map((v) => String(v || "").trim()).filter(Boolean);
  return values.length > 0 ? values.join(", ") : "";
}

function toCapitalizedWords(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

/** Figma strip: “Eye Clean · Tanzanie · Non chauffé” from short description. */
function formatStripMeta(plain) {
  const t = String(plain || "").trim();
  if (!t) return "";
  return t.replace(/\s*[,;|]\s*/g, " · ").replace(/\s+·\s+·\s+/g, " · ");
}

/** Category names + short description for strip chips (listing + ACF related preview). */
function buildStripMetaFromProduct(p) {
  const shortMeta = formatStripMeta(stripHtml(p?.shortDescription || ""));
  const cats = (p?.productCategories?.nodes ?? [])
    .map((n) => String(n?.name || "").trim())
    .filter(Boolean);
  const categoryPart = cats.length ? cats.join(" · ") : "";
  if (categoryPart && shortMeta) return `${categoryPart} · ${shortMeta}`;
  return categoryPart || shortMeta;
}

/** Figma strip title: bold name + “ / carat”. */
function StripTitle({ title }) {
  const m = String(title || "").match(/^(.+?)\s*\/\s*(.+)$/);
  if (m) {
    return (
      <>
        <span className="font-bold">{m[1].trim()}</span>
        <span className="font-normal"> / {m[2].trim()}</span>
      </>
    );
  }
  return <span className="font-bold">{title}</span>;
}

/**
 * Optional per-gallery-slot copy & price for homepage strip cards.
 * Set each image’s alt in WP Media to:
 *   BNOT|Title / carat|Eye clean, Madagascar, Non chauffé|1404
 * (title, attributes, price; empty segments keep the product default for that field.)
 * Case-insensitive "BNOT|" prefix only.
 * @param {string | null | undefined} altText
 * @returns {{ slotTitle?: string; slotMeta?: string; slotPriceRaw?: string } | null}
 */
function parseBnotSlot(altText) {
  const s = String(altText || "").trim();
  if (!s.toUpperCase().startsWith("BNOT|")) return null;
  const raw = s.slice(5);
  const parts = raw.split("|");
  return {
    slotTitle: parts[0] != null ? parts[0].trim() : undefined,
    slotMeta: parts.length >= 2 && parts[1] != null ? String(parts[1]).trim() : undefined,
    slotPriceRaw: parts.length >= 3 && parts[2] != null ? String(parts[2]).trim() : undefined,
  };
}

/**
 * Merge featured, catalog image, and gallery URLs (deduped).
 * @param {object} product
 */
function collectProductImages(product) {
  const out = [];
  const seen = new Set();
  const push = (node) => {
    if (!node?.sourceUrl || seen.has(node.sourceUrl)) return;
    seen.add(node.sourceUrl);
    out.push({
      sourceUrl: node.sourceUrl,
      altText: node.altText || "",
      bnotSlot: parseBnotSlot(node.altText),
    });
  };
  push(product.featuredImage?.node);
  push(product.image);
  for (const n of product.galleryImages?.nodes ?? []) push(n);
  return out;
}

/** WPGraphQL + ACF for WooCommerce often exposes `productAcfFields`; legacy installs use `acfFields`. */
function getProductAcf(product) {
  return product?.productAcfFields ?? product?.acfFields ?? null;
}

/** ACF “Show Related Products” = Yes (supports common WPGraphQL / ACF return shapes). */
function truthyAcfShow(v) {
  return v === true || v === "yes" || v === "Yes" || v === 1 || v === "1";
}

function falsyAcfShow(v) {
  return v === false || v === "no" || v === "No" || v === 0 || v === "0";
}

/**
 * ACF relationship “Select Related Product”.
 * Supports `selectRelatedProduct: Product[]` or `{ nodes: Product[] }`.
 */
function normalizeRelatedList(acf) {
  if (!acf) return [];
  const raw =
    acf.select_related_product ??
    acf.select_related_products ??
    acf.selectRelatedProduct ??
    acf.selectRelatedProducts;
  if (raw == null) return [];
  if (Array.isArray(raw?.nodes)) return raw.nodes.filter(Boolean);
  if (Array.isArray(raw?.edges)) return raw.edges.map((e) => e?.node).filter(Boolean);
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return [];
}

function useRelatedProductThumbs(acf, variant) {
  if (variant !== "strip" && variant !== "grid") return false;
  if (!acf) return false;
  const list = normalizeRelatedList(acf);
  if (!list.length) return false;
  const showValue =
    acf.show_realated_products_section ??
    acf.showRealatedProductsSection ??
    acf.show_related_products_section ??
    acf.showRelatedProductsSection;
  if (showValue === undefined || showValue === null || String(showValue).trim() === "") return true;
  if (falsyAcfShow(showValue)) return false;
  return truthyAcfShow(showValue);
}

function firstImageUrlForProduct(p) {
  const g0 = p?.galleryImages?.nodes?.[0]?.sourceUrl;
  return p?.featuredImage?.node?.sourceUrl || p?.image?.sourceUrl || g0 || null;
}

/** Same WooCommerce product node (avoid showing main twice in related thumb row). */
function isSameCatalogProduct(a, b) {
  if (!a || !b) return false;
  if (a.id != null && b.id != null && a.id === b.id) return true;
  if (a.databaseId != null && b.databaseId != null && a.databaseId === b.databaseId) return true;
  const as = a.slug != null ? String(a.slug) : "";
  const bs = b.slug != null ? String(b.slug) : "";
  return as !== "" && as === bs;
}

/** Figma “360 / zoom” control — pure SVG (no foreignObject) so React never sees string `style` on DOM nodes. */
function ZoomBadge() {
  return (
    <span
      className="pointer-events-none absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#001122]/55 shadow-sm backdrop-blur-[2px] min-[1440px]:right-2.5 min-[1440px]:top-2.5 min-[1440px]:h-11 min-[1440px]:w-11"
      aria-hidden
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19.03 3.56C17.36 2.17 15.29 1.26 13 1.05V3.06C14.73 3.25 16.31 3.94 17.61 4.98L19.03 3.56Z" fill="white"/>
        <path d="M11 3.06V1.05C8.71 1.25 6.64 2.17 4.97 3.56L6.39 4.98C7.69 3.94 9.27 3.25 11 3.06Z" fill="white"/>
        <path d="M4.98 6.39L3.56 4.97C2.17 6.64 1.26 8.71 1.05 11H3.06C3.25 9.27 3.94 7.69 4.98 6.39Z" fill="white"/>
        <path d="M20.94 11H22.95C22.74 8.71 21.83 6.64 20.44 4.97L19.02 6.39C20.06 7.69 20.75 9.27 20.94 11Z" fill="white"/>
        <path d="M7 12L10.44 13.56L12 17L13.56 13.56L17 12L13.56 10.44L12 7L10.44 10.44L7 12Z" fill="white"/>
        <path d="M12 21C8.89 21 6.15 19.41 4.54 17H7V15H1V21H3V18.3C4.99 21.14 8.27 23 12 23C16.87 23 21 19.83 22.44 15.44L20.48 14.99C19.25 18.48 15.92 21 12 21Z" fill="white"/>
      </svg>
    </span>
  );
}

/**
 * @param {{ product: object; locale: string; href: string; className?: string; variant?: "grid" | "strip" }} props
 */
export function ProductCard({ product, locale, href, className, variant = "grid" }) {
  const { convertFromBase, currency, format } = useCurrency();
  const images = useMemo(() => collectProductImages(product), [product]);
  const acf = getProductAcf(product);
  /** Unfiltered ACF relationship list — do not gate the whole section on “has image” (API often omits image on narrow fragments). */
  const rawRelatedList = useMemo(() => normalizeRelatedList(getProductAcf(product)).filter(Boolean), [product]);
  const relatedOnlyList = useMemo(
    () => rawRelatedList.filter((rp) => !isSameCatalogProduct(rp, product)),
    [rawRelatedList, product],
  );
  /** Thumb strip: main product first, then related (no duplicate of main). */
  const thumbRowProducts = useMemo(() => [product, ...relatedOnlyList], [product, relatedOnlyList]);
  const relatedThumbMode = useRelatedProductThumbs(acf, variant) && rawRelatedList.length > 0;

  const [activeRelatedIndex, setActiveRelatedIndex] = useState(null);

  useEffect(() => {
    setActiveRelatedIndex(null);
  }, [product.id]);

  useEffect(() => {
    if (activeRelatedIndex == null) return;
    if (activeRelatedIndex < 0 || activeRelatedIndex >= relatedOnlyList.length) {
      setActiveRelatedIndex(null);
    }
  }, [activeRelatedIndex, relatedOnlyList.length]);

  const isRelatedView = relatedThumbMode && activeRelatedIndex != null;
  const viewProduct = isRelatedView ? relatedOnlyList[activeRelatedIndex] : product;
  /** Single primary image on card — multi-gallery picker removed. */
  const galleryMain = images[0] ?? null;
  const relatedMainUrl = isRelatedView ? firstImageUrlForProduct(viewProduct) : null;
  const main = isRelatedView
    ? relatedMainUrl
      ? { sourceUrl: relatedMainUrl, altText: viewProduct?.name || "", bnotSlot: null }
      : null
    : galleryMain;

  const title = viewProduct.name || viewProduct.slug || "Produit sans titre";
  const baseNum = resolveProductPriceNumber(viewProduct, { locale, fallbackCountry: "fr" });

  const productMetaLine = buildStripMetaFromProduct(viewProduct);
  const slot = isRelatedView ? null : main?.bnotSlot ?? null;
  const displayTitle =
    slot?.slotTitle != null && String(slot.slotTitle).trim() !== "" ? String(slot.slotTitle).trim() : title;
  const stripAttributeLabels = ["pa_variete", "pa_origine", "pa_clarte"]
    .map((key) => getProductAttributeValue(viewProduct, key))
    .map((value) => toCapitalizedWords(value))
    .filter(Boolean);
  let displayPriceNum = baseNum;
  if (slot?.slotPriceRaw != null && String(slot.slotPriceRaw).trim() !== "") {
    const n = parsePrice(slot.slotPriceRaw);
    if (n > 0) displayPriceNum = n;
  }
  const hasDisplayPrice = displayPriceNum > 0;

  const priceLocale = locale === "fr" ? "fr-FR" : "en-US";
  /** Strip: symbol first (e.g. €3 006), compact decimals when whole euros. */
  const stripPriceLabel = hasDisplayPrice
    ? formatMoneySymbolFirst(convertFromBase(displayPriceNum), currency, priceLocale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : "";

    const kgTypeObj = viewProduct.metaData?.find(
      (item) => item.key === "kg_type"
    );
  
  
    const kg_type = kgTypeObj?.value || null;

  /** Always PDP for the product currently shown (listing or related thumb). */
  const productPageHref = viewProduct?.slug ? productPath(locale, viewProduct.slug) : href;

  const showRelatedThumbRow = relatedThumbMode;
  const relatedThumbsSyncKey = `${product.id}-${thumbRowProducts.map((r) => r.id ?? r.slug ?? "").join(",")}`;

  if (variant === "strip") {
    return (
      <div
        className={cn(
          "group/card flex min-h-0 w-full flex-col overflow-hidden border border-[rgba(0,17,34,0.08)] bg-[#F5EEE5] h-full",
          className,
        )}
      >
        <Link
          href={productPageHref}
          className="relative block aspect-square w-full shrink-0 overflow-hidden bg-[#ECEBE8]"
        >
          {main?.sourceUrl
            ? (
                <img
                  src={main.sourceUrl}
                  alt={displayTitle}
                  className="h-full w-full object-cover transition duration-300 ease-out group-hover/card:scale-[1.03]"
                  loading="lazy"
                />
              )
            : viewProduct?.imageUrl
              ? (
                <img
                  src={viewProduct.imageUrl}
                  alt={displayTitle}
                  className="h-full w-full object-cover transition duration-300 ease-out group-hover/card:scale-[1.03]"
                  loading="lazy"
                />
              )
            : (
                <div className="flex h-full items-center justify-center text-sm text-[rgba(0,17,34,0.45)]">Aucune image</div>
              )
          }
   
         
          <ZoomBadge />
        </Link>

        {showRelatedThumbRow ? (
          <RelatedThumbsScrollWithNav syncKey={relatedThumbsSyncKey} scrollClassName="flex w-full shrink-0 gap-2 px-1 py-1">
            {thumbRowProducts.map((rp, visIdx) => {
              if (!rp) return null;
              const tu = firstImageUrlForProduct(rp);
              const isMainThumb = visIdx === 0;
              const relIdx = visIdx - 1;
              const isActive = isMainThumb ? activeRelatedIndex == null : activeRelatedIndex === relIdx;
              return (
                <button
                  key={rp.id || rp.databaseId || rp.slug || (isMainThumb ? "main-thumb" : `related-${relIdx}`)}
                  type="button"
                  role="listitem"
                  data-related-thumb
                  onClick={() => {
                    if (isMainThumb) {
                      setActiveRelatedIndex(null);
                      return;
                    }
                    setActiveRelatedIndex((prev) => (prev === relIdx ? null : relIdx));
                  }}
                  aria-label={
                    isMainThumb
                      ? (rp.name ? `${rp.name} (produit principal)` : "Produit principal")
                      : rp.name || `Produit ${visIdx + 1}`
                  }
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "h-11 w-11 shrink-0 cursor-pointer overflow-hidden border bg-white transition-colors",
                    isActive
                      ? "border-[#2563EB]"
                      : "border-[rgba(0,17,34,0.18)] hover:border-[rgba(0,17,34,0.45)]",
                  )}
                >
                  {tu ? (
                    <img src={tu} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-[#ECEBE8] px-0.5 text-center text-[10px] font-medium leading-tight text-[#001122]">
                      {(rp.name || "?").slice(0, 3)}
                    </span>
                  )}
                </button>
              );
            })}
          </RelatedThumbsScrollWithNav>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col gap-[15px] px-[10px] py-[15px] min-[1440px]:gap-2.5 min-[1440px]:p-3.5">
          <Link href={productPageHref} className="no-underline text-[#001122] hover:text-[#FF6633]">
            <h2 className="font-serif text-[21px] max-[767px]:text-[17px] leading-[1.35] transition-colors min-[1440px]:leading-[1.3]">
              <StripTitle title={displayTitle} />
            </h2>
          </Link>
          {stripAttributeLabels.length > 0 ? (
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-normal leading-snug text-[rgba(0,17,34,0.55)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] min-[1440px]:gap-x-2.5 min-[1440px]:text-xs"
              role="list"
              aria-label="Caractéristiques"
            >
              {stripAttributeLabels.map((label, i) => (
                <span key={`${label}-${i}`} className="inline">
                  {i > 0 ? (
                    <span className="select-none text-[rgba(0,17,34,0.35)]" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <span role="listitem" className="ml-1">
                    {label}
                  </span>
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <p
              className="flex items-end gap-1 text-[14px] font-semibold leading-tight [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] min-[1440px]:text-base"
              style={{ color: ACCENT_ORANGE }}
            >
              <span>{hasDisplayPrice ? stripPriceLabel : "Prix sur demande"}</span>
              {hasDisplayPrice ? (
                <span className="text-[10px] font-normal leading-none opacity-80">incl. tax</span>
              ) : null}
            </p>
            {kg_type === "Stones" && (
              <Link
                href={productPageHref}
                className="shrink-0 text-[11px] font-normal leading-tight text-[#001122] transition-colors hover:text-[#001122] hover:text-[#FF6633] min-[1440px]:text-xs [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
              >
                Configuration IA
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden border border-[rgba(0,17,34,0.2)] bg-[#f5eee5] transition-[border-color,box-shadow] duration-200 hover:border-[#001122] hover:shadow-[0_8px_24px_rgba(0,17,34,0.08)]",
        className,
      )}
    >
      {showRelatedThumbRow ? (
        <div className="border-b border-[rgba(0,17,34,0.2)]">
          <RelatedThumbsScrollWithNav syncKey={`${relatedThumbsSyncKey}-grid`} scrollClassName="flex gap-[10px] px-[10px] py-[10px]">
            {thumbRowProducts.map((rp, visIdx) => {
              const tu = firstImageUrlForProduct(rp);
              const isMainThumb = visIdx === 0;
              const relIdx = visIdx - 1;
              const isActive = isMainThumb ? activeRelatedIndex == null : activeRelatedIndex === relIdx;
              return (
                <button
                  key={rp.id || rp.databaseId || rp.slug || (isMainThumb ? "main-thumb-grid" : `related-grid-${relIdx}`)}
                  type="button"
                  role="listitem"
                  data-related-thumb
                  onClick={() => {
                    if (isMainThumb) {
                      setActiveRelatedIndex(null);
                      return;
                    }
                    setActiveRelatedIndex((prev) => (prev === relIdx ? null : relIdx));
                  }}
                  aria-label={
                    isMainThumb
                      ? (rp.name ? `${rp.name} (produit principal)` : "Produit principal")
                      : rp.name || `Produit ${visIdx + 1}`
                  }
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "h-[60px] w-[60px] shrink-0 overflow-hidden border bg-white transition-colors",
                    isActive
                      ? "border-[#2563EB]"
                      : "border-[rgba(0,17,34,0.2)] hover:border-[rgba(0,17,34,0.55)]",
                  )}
                >
                  {tu ? (
                    <img src={tu} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-[#ECEBE8] text-[10px] font-medium text-[#001122]">
                      {(rp.name || "?").slice(0, 3)}
                    </span>
                  )}
                </button>
              );
            })}
          </RelatedThumbsScrollWithNav>
        </div>
      ) : null}

      <Link href={productPageHref} className="group/main flex flex-1 flex-col no-underline">
        <div className="relative aspect-[315/280] w-full overflow-hidden border-b border-[rgba(0,17,34,0.2)] bg-[#f5eee5]">
          {main?.sourceUrl ? (
            <img
              src={main.sourceUrl}
              alt={displayTitle}
              className="h-full w-full object-cover transition duration-300 ease-out group-hover/main:scale-[1.02]"
              loading="lazy"
            />
          ) : viewProduct?.imageUrl ? (
            <img
              src={viewProduct.imageUrl}
              alt={displayTitle}
              className="h-full w-full object-cover transition duration-300 ease-out group-hover/main:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[rgba(0,17,34,0.6)]">Aucune image</div>
          )}
        </div>
        <div className="flex min-h-[120px] flex-col gap-[15px] p-[15px]">
          <h2 className="line-clamp-2 text-[11px] font-normal leading-[1.36] text-[#001122] transition-colors group-hover/main:text-[#001122]">
            {displayTitle}
          </h2>
          {productMetaLine ? (
            <p className="line-clamp-2 text-[10px] font-normal leading-snug text-[rgba(0,17,34,0.55)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
              {productMetaLine}
            </p>
          ) : null}
          <p className="mt-auto flex items-end gap-1 font-serif text-[28px] font-normal leading-[1.25] text-[#001122]">
            <span>{hasDisplayPrice ? format(displayPriceNum, priceLocale) : "Prix sur demande"}</span>
            {hasDisplayPrice ? (
              <span className="text-[10px] font-normal leading-none opacity-70">incl. tax</span>
            ) : null}
          </p>
        </div>
      </Link>
    </div>
  );
}
