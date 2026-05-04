"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppointmentModal } from "@/modules/menu/providers/appointment-modal-context";
import { ProductTypeImage } from "@/modules/product/components/ProductTypeImage";
import { resolveProductPriceRaw } from "@/modules/common/utils/price";
import Image from "next/image";

/** New tab only for http(s) / protocol-relative URLs. */
function linkTargetBlankAttrs(href, explicitTarget = "") {
  if (explicitTarget === "_blank") {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  if (href == null || typeof href !== "string") return {};
  const t = href.trim();
  if (/^https?:\/\//i.test(t) || t.startsWith("//")) {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  return {};
}

const TAB_INK = "#0f172a";
const TAB_MUTED = "rgba(15, 23, 42, 0.5)";
const BODY_SLATE = "#334155";
const FONT_STACK = "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif";

function normalizeAttributeKey(raw) {
  return String(raw ?? "")
    .replace(/^pa_/i, "")
    .replace(/[_-\s]+/g, "")
    .trim()
    .toLowerCase();
}

function normalizeAttributeValue(raw) {
  return String(raw ?? "").trim().toLowerCase();
}

function uniqueNormalizedUrls(urls) {
  const out = [];
  const seen = new Set();
  for (const raw of urls) {
    const url = String(raw ?? "").trim();
    if (!url) continue;
    const normalized = url.split("?")[0];
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(url);
  }
  return out;
}

function extractUrlsFromText(raw) {
  const rawText = String(raw ?? "");
  const normalizedText = rawText
    .replace(/\\\//g, "/")
    .replace(/\\\\u002F/gi, "/")
    .replace(/&quot;/gi, '"');

  const matchIn = (text) => {
    const matches = text.match(/https?:\/\/[^\s"'\\]+?\.(?:png|jpe?g|webp|gif|avif)(?:\?[^\s"'\\]*)?/gi);
    return matches ? matches.map((item) => item.trim()) : [];
  };

  const urls = [...matchIn(rawText), ...matchIn(normalizedText)];
  const maybeJson = normalizedText.trim();
  if ((maybeJson.startsWith("{") && maybeJson.endsWith("}")) || (maybeJson.startsWith("[") && maybeJson.endsWith("]"))) {
    try {
      const parsed = JSON.parse(maybeJson);
      const queue = [parsed];
      while (queue.length > 0) {
        const current = queue.shift();
        if (typeof current === "string") {
          urls.push(...matchIn(current), ...matchIn(current.replace(/\\\//g, "/")));
          continue;
        }
        if (Array.isArray(current)) {
          queue.push(...current);
          continue;
        }
        if (current && typeof current === "object") {
          queue.push(...Object.values(current));
        }
      }
    } catch {
      // Keep silent: value is often serialized text, not valid JSON.
    }
  }

  return Array.from(new Set(urls.filter(Boolean)));
}

function collectVariationImageUrls(variation) {
  const out = [];
  const seen = new Set();
  const pushUrl = (raw) => {
    const url = String(raw ?? "").trim();
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push(url);
  };

  pushUrl(variation?.image?.sourceUrl);
  pushUrl(variation?.image?.mediaItemUrl);
  pushUrl(variation?.featuredImage?.node?.sourceUrl);
  pushUrl(variation?.featuredImage?.node?.mediaItemUrl);

  const meta = Array.isArray(variation?.metaData) ? variation.metaData : [];
  for (const item of meta) {
    const key = String(item?.key ?? "").toLowerCase();
    if (!key.includes("gallery") && !key.includes("image")) continue;
    const urls = extractUrlsFromText(item?.value);
    for (const url of urls) pushUrl(url);
  }

  return out;
}

function collectVariationGalleryMediaIds(variation) {
  const ids = [];
  const meta = Array.isArray(variation?.metaData) ? variation.metaData : [];
  for (const item of meta) {
    const key = String(item?.key ?? "").toLowerCase();
    if (!key.includes("gallery")) continue;
    const value = String(item?.value ?? "");
    const matches = value.match(/\d+/g) ?? [];
    for (const match of matches) {
      const n = Number(match);
      if (Number.isInteger(n) && n > 0) ids.push(n);
    }
  }
  return Array.from(new Set(ids));
}

async function resolveMediaIdsToUrls(mediaIds) {
  const out = [];
  for (const id of mediaIds) {
    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `
          query ResolveMediaItem($id: ID!) {
            mediaItem(id: $id, idType: DATABASE_ID) {
              sourceUrl
              mediaItemUrl
            }
          }
        `,
        variables: { id },
      }),
    });
    if (!res.ok) continue;
    const json = await res.json();
    const url =
      json?.data?.mediaItem?.sourceUrl ??
      json?.data?.mediaItem?.mediaItemUrl ??
      "";
    if (typeof url === "string" && url.trim()) {
      out.push(url.trim());
    }
  }
  return Array.from(new Set(out));
}

function humanizeAttributeLabel(raw) {
  const clean = String(raw ?? "")
    .replace(/^pa_/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!clean) return "";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/** Meta keys shown in the “Détail” tab (order matches design / stones.json ERP export). */
const DETAIL_SPEC_META_ORDER = ["carat", "origin", "treatment", "clarity", "dimensions"];

function tryParseDetailSpecJsonArray(raw) {
  const s = String(raw ?? "").trim();
  if (!s.startsWith("[")) return null;
  try {
    const parsed = JSON.parse(s);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const first = parsed[0];
    if (!first || typeof first !== "object" || typeof first.key !== "string") return null;
    const rows = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const key = String(row.key ?? "").trim().toLowerCase();
      const value = String(row.value ?? "").trim();
      if (!key || !value) continue;
      rows.push({ key, value });
    }
    return rows.length > 0 ? rows : null;
  } catch {
    return null;
  }
}

function orderDetailSpecRows(rows) {
  const map = new Map(rows.map((r) => [String(r.key).toLowerCase(), r.value]));
  const out = [];
  for (const k of DETAIL_SPEC_META_ORDER) {
    if (map.has(k)) out.push({ key: k, value: map.get(k) });
  }
  return out;
}

function buildDetailSpecRowsFromMeta(metaArray) {
  if (!Array.isArray(metaArray) || metaArray.length === 0) return [];
  for (const item of metaArray) {
    const parsed = tryParseDetailSpecJsonArray(item?.value);
    if (parsed) return orderDetailSpecRows(parsed);
  }
  const map = new Map();
  for (const item of metaArray) {
    const k = String(item?.key ?? "").trim().toLowerCase();
    if (!k) continue;
    const val = String(item?.value ?? "").trim();
    if (!val) continue;
    map.set(k, val);
  }
  const out = [];
  for (const k of DETAIL_SPEC_META_ORDER) {
    if (map.has(k)) out.push({ key: k, value: map.get(k) });
  }
  return out;
}

function formatDetailSpecLine(row) {
  const key = String(row?.key ?? "").toLowerCase();
  const v = String(row?.value ?? "").trim();
  if (!v) return "";
  if (key === "carat") return `${v} ct`;
  if (key === "treatment") {
    const n = v.toLowerCase();
    if (n === "heated" || n === "heat") return "Chauffé";
    if (n === "unheated" || n === "non heated" || n.includes("non chauff")) return "Non chauffé";
  }
  return v;
}

function readVariationMeta(variation, key) {
  const meta = Array.isArray(variation?.metaData) ? variation.metaData : [];
  const norm = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/^_+/, "");
  const keyNorm = norm(key);
  const hit = meta.find((item) => norm(item?.key) === keyNorm);
  return hit?.value;
}

function isVariationOutOfStock(variation) {
  if (!variation || typeof variation !== "object") return false;
  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  const statusFromMeta =
    readVariationMeta(variation, "_stock_status") ??
    readVariationMeta(variation, "stock_status");
  const statusValue = statusFromMeta ?? variation?.stockStatus;
  const status = normalize(statusValue);
  const statusSaysAvailable = status === "instock" || status === "onbackorder";
  const statusSaysUnavailable = status === "outofstock" || (status && !statusSaysAvailable);
  if (statusSaysUnavailable) return true;
  const managesStock =
    variation?.manageStock === true ||
    ["1", "yes", "true"].includes(
      normalize(readVariationMeta(variation, "_manage_stock")),
    );
  const qtyRaw =
    variation?.stockQuantity ?? readVariationMeta(variation, "_stock");
  const qty = Number(qtyRaw);
  const qtySaysAvailable = managesStock && Number.isFinite(qty) && qty > 0;
  const qtySaysUnavailable =
    managesStock && (!Number.isFinite(qty) || (Number.isFinite(qty) && qty <= 0));
  if (qtySaysUnavailable) return true;
  // Strict fallback: if we cannot confirm availability, keep add-to-cart disabled.
  if (!statusSaysAvailable && !qtySaysAvailable) return true;
  return false;
}

function extractVariantGroups(product) {
  if (!product || typeof product !== "object") return [];

  const groups = new Map();
  const variationEnabledKeys = new Set();
  const upsert = (rawKey, rawLabel, values) => {
    const key = normalizeAttributeKey(rawKey);
    if (!key) return;
    const label = String(rawLabel ?? "").trim() || humanizeAttributeLabel(rawKey);
    const current = groups.get(key) ?? { key, label, options: new Set() };
    for (const value of values) {
      const option = String(value ?? "").trim();
      if (option) current.options.add(option);
    }
    groups.set(key, current);
  };

  const attrNodes = Array.isArray(product?.attributes?.nodes) ? product.attributes.nodes : [];
  for (const node of attrNodes) {
    const key = normalizeAttributeKey(node?.name ?? node?.label ?? "");
    if (node?.variation === true && key) variationEnabledKeys.add(key);
  }

  for (const node of attrNodes) {
    if (node?.variation !== true) continue;
    const options = Array.isArray(node?.options) ? node.options : [];
    const rawKey = node?.name ?? node?.label ?? "";
    upsert(rawKey, node?.label ?? node?.name, options);
  }

  const variationNodes = Array.isArray(product?.variations?.nodes) ? product.variations.nodes : [];
  for (const variation of variationNodes) {
    const attrs = Array.isArray(variation?.attributes?.nodes)
      ? variation.attributes.nodes
      : Array.isArray(variation?.attributes)
        ? variation.attributes
        : [];
    for (const attr of attrs) {
      const rawKey = attr?.name ?? attr?.attributeName ?? attr?.label ?? "";
      const normalizedRawKey = normalizeAttributeKey(rawKey);
      if (
        variationEnabledKeys.size > 0 &&
        normalizedRawKey &&
        !variationEnabledKeys.has(normalizedRawKey)
      ) {
        continue;
      }
      const rawValue = attr?.value ?? attr?.option ?? attr?.attributeValue ?? "";
      upsert(rawKey, attr?.label ?? attr?.name, [rawValue]);
    }
  }

  return Array.from(groups.values())
    .map((group) => ({
      key: group.key,
      label: group.label,
      options: Array.from(group.options),
    }))
    .filter((group) => group.options.length > 0);
}

export function ProductInfoSection({
  subtitle,
  product,
  priceLabel,
  bodyText,
  specBullets,
  productDescriptionLink,
  productDetail,
  INK,
  INK_20,
  INK_50,
  INK_75,
  ACCENT,
  images,
  activeImg,
  thumbCanScroll,
  thumbAtStart,
  thumbAtEnd,
  thumbStripRef,
  Chevronright,
  stonePickerStones,
  setStonePickerOpen,
  primaryCat,
  onAddToCart,
  addToCartDisabled = false,
  addToCartSubmitting = false,
  ica,
  SAND,
  DEFAULT_ICA_SECTION,
  resolvedAccordionItems,
  resolvedGlobalProductDescriptionLink,
  founder,
  DEFAULT_FOUNDER,
  ArrowLink,
  locale,
  productsPath,
  stripHtml,
  productTypeData,
  productType,
  onVariantSelectionChange,
}) {
  const { open: openAppointmentModal } = useAppointmentModal();
  const isVariableProduct = String(product?.type ?? "").toLowerCase() === "variable";
  const variantGroups = useMemo(() => extractVariantGroups(product), [product]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isVariationLoading, setIsVariationLoading] = useState(false);
  const selectedEntries = useMemo(
    () =>
      Object.entries(selectedVariants).filter(
        ([, value]) => String(value ?? "").trim() !== "",
      ),
    [selectedVariants],
  );
  const selectedVariation = useMemo(() => {
    const variationNodes = Array.isArray(product?.variations?.nodes)
      ? product.variations.nodes
      : [];

      console.log('hasAllSelected = ' ,variationNodes);

    if (!isVariableProduct) return null;
    if (variantGroups.length === 0 && variationNodes.length === 1) {
      return variationNodes[0];
    }
    if (selectedEntries.length === 0) return null;
    return (
      variationNodes.find((variation) => {
        const attrs = Array.isArray(variation?.attributes?.nodes)
          ? variation.attributes.nodes
          : Array.isArray(variation?.attributes)
            ? variation.attributes
            : [];
        const normalizedAttrs = attrs
          .map((attr) => ({
            key: normalizeAttributeKey(
              attr?.name ?? attr?.attributeName ?? attr?.label ?? "",
            ),
            value: normalizeAttributeValue(
              attr?.value ?? attr?.option ?? attr?.attributeValue ?? "",
            ),
          }))
          .filter((attr) => attr.key && attr.value);

        const selectedNormalized = selectedEntries.map(([selectedKey, selectedValue]) => ({
          key: normalizeAttributeKey(selectedKey),
          value: normalizeAttributeValue(selectedValue),
        }));

        const hasAllSelected = selectedNormalized.every(({ key, value }) =>
          normalizedAttrs.some((attr) => attr.key === key && attr.value === value),
        );
        if (!hasAllSelected) return false;

        

        // Avoid partial/ambiguous matches: selected set should match variation attribute set size.
        return normalizedAttrs.length === selectedNormalized.length;
      }) ?? null
    );
  }, [isVariableProduct, product?.variations?.nodes, selectedEntries, variantGroups.length]);
  const selectedVariationOutOfStock = useMemo(() => {
    if (!isVariableProduct || !selectedVariation) return false;
    return isVariationOutOfStock(selectedVariation);
  }, [isVariableProduct, selectedVariation]);

  const detailSpecMetaSource = useMemo(() => {
    if (
      isVariableProduct &&
      selectedVariation &&
      Array.isArray(selectedVariation.metaData) &&
      selectedVariation.metaData.length > 0
    ) {
      return selectedVariation.metaData;
    }
    return Array.isArray(product?.metaData) ? product.metaData : [];
  }, [isVariableProduct, selectedVariation, product?.metaData]);

  const detailSpecRows = useMemo(
    () => buildDetailSpecRowsFromMeta(detailSpecMetaSource),
    [detailSpecMetaSource],
  );

  const descriptionText = (bodyText ?? "").trim();
  const detailRaw = productDetail;
  const detailText =
    typeof detailRaw === "string" ? detailRaw.trim() : detailRaw ? String(detailRaw).trim() : "";
  const hasDescription = Boolean(descriptionText);
  const hasDetail = Boolean(detailText) || detailSpecRows.length > 0;
  const [activeInfoTab, setActiveInfoTab] = useState(() =>
    hasDescription ? "description" : "detail",
  );
  const detailIsHtml = useMemo(() => /<[a-z][\s\S]*>/i.test(detailText), [detailText]);

  const handleTabChange = (tab) => {
    setActiveInfoTab(tab);
  };

  const normalizedGlobalDescriptionLinks = Array.isArray(resolvedGlobalProductDescriptionLink)
    ? resolvedGlobalProductDescriptionLink
      .map((item) => {
        const rawHref =
          item?.productDescriptionTextLink ??
          item?.product_description_text_link ??
          "";
        const href =
          typeof rawHref === "string"
            ? rawHref
            : typeof rawHref?.url === "string"
              ? rawHref.url
              : "";
        const target =
          item?.productDescriptionTextTarget ??
          item?.product_description_text_target ??
          (typeof rawHref === "object" && rawHref && typeof rawHref.target === "string"
            ? rawHref.target
            : "");

        return {
          title:
            item?.productDescriptionTitle ??
            item?.product_description_title ??
            "",
          href,
          target,
        };
      })
      .filter((item) => item.title)
    : [];

  useEffect(() => {
    console.log("isVariableProduct = ", isVariableProduct);
    if (!isVariableProduct || typeof onVariantSelectionChange !== "function") return;


    if (selectedEntries.length === 0) {
      setIsVariationLoading(false);
      onVariantSelectionChange(null);
      return;
    }
    let cancelled = false;
    const run = async () => {
      setIsVariationLoading(true);
      const matchedVariation = selectedVariation;

    console.log('matchedVariation = ' ,matchedVariation);

      if (!matchedVariation) {
        if (!cancelled) {
          onVariantSelectionChange(null);
          setIsVariationLoading(false);
        }
        return;
      }

      const directUrls = collectVariationImageUrls(matchedVariation);
      const galleryIds = collectVariationGalleryMediaIds(matchedVariation);
      const galleryUrls = galleryIds.length > 0 ? await resolveMediaIdsToUrls(galleryIds) : [];
      const matchedImageUrls = uniqueNormalizedUrls([...directUrls, ...galleryUrls]);
      const matchedPriceRaw = resolveProductPriceRaw(matchedVariation, {
        locale,
        fallbackCountry: "fr",
      });

      
      if (cancelled) return;
      onVariantSelectionChange({
        variation: {
          id: matchedVariation?.id ?? null,
          databaseId: matchedVariation?.databaseId ?? null,
          priceRaw: matchedPriceRaw || "",
          imageUrl: matchedImageUrls[0] || null,
          stockStatus: matchedVariation?.stockStatus ?? "",
          manageStock: matchedVariation?.manageStock ?? null,
          stockQuantity: matchedVariation?.stockQuantity ?? null,
          metaData: Array.isArray(matchedVariation?.metaData)
            ? matchedVariation.metaData
            : [],
          attributes: Array.isArray(matchedVariation?.attributes?.nodes)
            ? matchedVariation.attributes.nodes
            : Array.isArray(matchedVariation?.attributes)
              ? matchedVariation.attributes
              : [],
        },
        imageUrl: matchedImageUrls[0] || null,
        imageUrls: matchedImageUrls,
        priceRaw: matchedPriceRaw || "",
      });
      setIsVariationLoading(false);
    };

    run().catch(() => {
      if (!cancelled) {
        onVariantSelectionChange(null);
        setIsVariationLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isVariableProduct, onVariantSelectionChange, selectedEntries, selectedVariation]);

  const isSelectionComplete = !isVariableProduct || selectedEntries.length >= variantGroups.length;
  const addToCartWithVariation = () => {
    if (!isVariableProduct) {
      onAddToCart?.();
      return;
    }
    if (!isSelectionComplete || !selectedVariation) return;
    onAddToCart?.({ variation: selectedVariation, selectedVariants });
  };

  return (
    <div className="w-full min-[1025px]:w-[50%] flex flex-col gap-0 px-4 min-[1025px]:px-[30px] min-[1201px]:px-[60px] max-[1025px]:pt-[30px]">
      <div className="flex flex-col gap-[22px] pb-[30px] max-[768px]:pb-[15px]">
        <div className="flex items-center justify-between hidden">
          <span className="text-sm font-semibold" style={{ color: INK }}>{subtitle}</span>
          <div className="flex items-center gap-2">
            <svg width="11" height="11" viewBox="0 0 12 12" fill={INK} aria-hidden>
              <path d="M6 0l1.76 3.57L12 4.3 9.18 7.13 9.88 12 6 9.9 2.12 12l.7-4.87L0 4.3l4.24-.73L6 0z" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: INK }}>5 / 5</span>
          </div>
        </div>

        <div className="flex items-start gap-[60px] max-[1201px]:gap-[30px] max-[1201px]:flex-col max-[1025px]:flex-row max-[480px]:flex-col">
          <div className="flex min-w-0 flex-1 flex-col gap-[15px]">
            <h1 className="mb-[45px] font-serif text-[28px] font-normal leading-[1.25] max-[1201px]:mb-[20px]" style={{ color: INK }}>
              {product.name}
            </h1>

            <div className="flex items-baseline justify-between gap-2 border-b pb-[15px]" style={{ borderColor: INK_20 }}>
              <p className="flex items-end gap-1 text-[14px] font-semibold leading-none" style={{ color: ACCENT }}>
                <span>{priceLabel}</span>
                <span className="text-[10px] font-normal leading-none opacity-80">incl. tax</span>
              </p>
              <p className="text-[11px] font-normal" style={{ color: ACCENT }}>
                Payable en 3X sans frais
              </p>
            </div>


            <div className="">
              <div
                className="mb-6 flex gap-8"
                role="tablist"
                aria-label="Informations produit"
              >
                <button
                  type="button"
                  role="tab"
                  id="product-info-tab-description"
                  aria-selected={activeInfoTab === "description"}
                  aria-controls="product-info-panel-description"
                  tabIndex={activeInfoTab === "description" ? 0 : -1}
                  onClick={() => setActiveInfoTab("description")}
                  className="cursor-pointer border-0 bg-transparent p-0 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 font-bold"
                  style={{
                    fontFamily: FONT_STACK,
                    fontWeight: activeInfoTab === "description" ? 700 : 600,
                    color: activeInfoTab === "description" ? TAB_INK : TAB_MUTED,
                  }}
                >
                  Description
                </button>
                <button
                  type="button"
                  role="tab"
                  id="product-info-tab-detail"
                  aria-selected={activeInfoTab === "detail"}
                  aria-controls="product-info-panel-detail"
                  tabIndex={activeInfoTab === "detail" ? 0 : -1}
                  onClick={() => setActiveInfoTab("detail")}
                  className="cursor-pointer border-0 bg-transparent p-0 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 font-bold"
                  style={{
                    fontFamily: FONT_STACK,
                    fontWeight: activeInfoTab === "detail" ? 700 : 600,
                    color: activeInfoTab === "detail" ? TAB_INK : TAB_MUTED,
                  }}
                >
                  Détail
                </button>
              </div>
              <div
                role="tabpanel"
                id="product-info-panel-description"
                aria-labelledby="product-info-tab-description"
                hidden={activeInfoTab !== "description"}
                className="text-base leading-[1.6]"
                style={{ color: BODY_SLATE, fontFamily: FONT_STACK }}
              >
                {activeInfoTab === "description" ? (
                  <p className="m-0">{descriptionText && String(descriptionText).trim() !== "" ? descriptionText : "-"}</p>
                ) : null}

              </div>
              <div
                role="tabpanel"
                id="product-info-panel-detail"
                aria-labelledby="product-info-tab-detail"
                hidden={activeInfoTab !== "detail"}
                className="text-base leading-[1.6]"
                style={{ color: BODY_SLATE, fontFamily: FONT_STACK }}
              >
                {activeInfoTab === "detail" ? (
                  detailSpecRows.length > 0 ? (
                    <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
                      {detailSpecRows.map((row) => {
                        const line = formatDetailSpecLine(row);
                        if (!line) return null;
                        return (
                          <li
                            key={row.key}
                            className="flex items-center gap-[10px] text-[14px] leading-[1.5]"
                            style={{ color: INK }}
                          >
                            <span
                              className="shrink-0 text-[14px] leading-none"
                              style={{ color: INK }}
                              aria-hidden
                            >
                              ◆
                            </span>
                            {line}
                          </li>
                        );
                      })}
                    </ul>
                  ) : detailIsHtml ? (
                    <div
                      className="product-detail-html m-0 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                      dangerouslySetInnerHTML={{ __html: detailText }}
                    />
                  ) : (
                    <p className="m-0">-</p>
                  )
                ) : null}
              </div>
            </div>

            {specBullets.length > 0 && (
              <ul className="flex flex-col gap-[10px]">
                {specBullets.map((t) => (
                  <li key={t} className="flex items-center gap-[10px] text-[14px] leading-[1.5]" style={{ color: INK }}>
                    <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ backgroundColor: INK }} aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {normalizedGlobalDescriptionLinks.length > 0 && (
              <div className="flex flex-col gap-[10px] border-t pt-[15px]" style={{ borderColor: INK_20 }}>
                {normalizedGlobalDescriptionLinks.map((item, index) => {
                  const hrefValue =
                    item?.href && typeof item.href === "string" && item.href.trim()
                      ? item.href.trim()
                      : "#rdv";
                  const opensModal = hrefValue === "#rdv";
                  const blank = opensModal ? {} : linkTargetBlankAttrs(hrefValue, item.target);
                  return (
                    <a
                      key={index}
                      href={hrefValue}
                      onClick={
                        opensModal
                          ? (e) => {
                            e.preventDefault();
                            openAppointmentModal();
                          }
                          : undefined
                      }
                      {...blank}
                      className="text-[14px] leading-[1.5] font-semibold underline-offset-2 text-[var(--ink-50)] hover:text-[var(--ink)] hover:underline transition-colors duration-300"
                      style={{
                        "--ink-50": INK_50,
                        "--ink": INK,
                        fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
                      }}
                    >
                      {item.title}
                    </a>
                  );
                })}
              </div>
            )}

            {/* <div className="flex flex-col gap-[15px] border-t pt-[15px]" style={{ borderColor: INK_20 }}>
              {productDescriptionLink.map((item, index) => (
                <a
                  key={index}
                  href={item?.productDescriptionTextLink ?? "#"}
                  className="text-[14px] leading-[1.5] font-semibold underline-offset-2 text-[var(--ink-50)] hover:text-[var(--ink)] hover:underline transition-colors duration-300"
                  style={{ "--ink-50": INK_50, "--ink": INK, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                >
                  {item?.productDescriptionTitle}
                </a>
              ))}
            </div> */}
          </div>

          <ProductTypeImage productTypeData={productTypeData} productType={productType} />
        </div>

        <div className="flex flex-col gap-[15px] pt-[50px]">
          {isVariableProduct ? (
            <div className="flex flex-col gap-[10px] pb-[10px]">
              {variantGroups.length > 0 ? (
                <div className={`grid gap-[8px] ${variantGroups.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                  {variantGroups.map((group) => {
                    const selectedValue = selectedVariants[group.key] ?? "";
                    return (
                      <label key={group.key} className="relative flex min-w-0 flex-col">
                        <select
                          aria-label={group.label}
                          value={selectedValue}
                          onChange={(event) =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [group.key]: event.target.value,
                            }))
                          }
                          className="h-10 w-full appearance-none border bg-transparent px-[14px] pr-[52px] text-center text-[14px] font-semibold leading-[20px] text-[#001122] outline-none transition-colors focus:border-[#001122]"
                          style={{
                            borderColor: INK_20,
                            fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
                          }}
                        >
                          <option value="" >Choisir {group.label.toLowerCase()}</option>
                          {group.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <span
                          className="pointer-events-none absolute right-0 top-0 flex h-10 w-10 items-center justify-center"
                          aria-hidden
                        >
                          <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.3535 0.353577L6.35352 6.35358L0.353516 0.353576" stroke="#001122" strokeMiterlimit="10" />
                          </svg>
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="relative w-full">
                  <select
                    aria-label="Choisir un certificat"
                    className="h-10 w-full appearance-none border bg-transparent px-[14px] pr-[52px] text-center text-[14px] font-semibold leading-[20px] text-[#001122] outline-none transition-colors focus:border-[#001122]"
                    style={{
                      borderColor: INK_20,
                      fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
                    }}
                    defaultValue=""
                  >
                    <option value="">Choisir un certificat</option>
                  </select>
                  <span
                    className="pointer-events-none absolute right-0 top-0 flex h-10 w-10 items-center justify-center border-l"
                    style={{ borderColor: INK_20 }}
                    aria-hidden
                  >
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                      <path d="M1 1L6 6L11 1" stroke={INK} strokeWidth="1.2" />
                    </svg>
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-[8px] sm:flex-row">
                <button
                  type="button"
                  className="group flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 bg-[#001122] px-4 text-sm font-semibold leading-[40px] text-white transition-all duration-300 hover:border hover:border-[#001122] hover:bg-transparent hover:text-[#001122]"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                >
                  <svg
                    className="transition-transform duration-300 group-hover:rotate-12"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M19.03 3.56C17.36 2.17 15.29 1.26 13 1.05V3.06C14.73 3.25 16.31 3.94 17.61 4.98L19.03 3.56Z" fill="currentColor" />
                    <path d="M11 3.06V1.05C8.71 1.25 6.64 2.17 4.97 3.56L6.39 4.98C7.69 3.94 9.27 3.25 11 3.06Z" fill="currentColor" />
                    <path d="M4.98 6.39L3.56 4.97C2.17 6.64 1.26 8.71 1.05 11H3.06C3.25 9.27 3.94 7.69 4.98 6.39Z" fill="currentColor" />
                    <path d="M20.94 11H22.95C22.74 8.71 21.83 6.64 20.44 4.97L19.02 6.39C20.06 7.69 20.75 9.27 20.94 11Z" fill="currentColor" />
                    <path d="M7 12L10.44 13.56L12 17L13.56 13.56L17 12L13.56 10.44L12 7L10.44 10.44L7 12Z" fill="currentColor" />
                    <path d="M12 21C8.89 21 6.15 19.41 4.54 17H7V15H1V21H3V18.3C4.99 21.14 8.27 23 12 23C16.87 23 21 19.83 22.44 15.44L20.48 14.99C19.25 18.48 15.92 21 12 21Z" fill="currentColor" />
                  </svg>
                  Creer avec cette pierre
                </button>
                <button
                  type="button"
                  onClick={addToCartWithVariation}
                  disabled={
                    isVariationLoading ||
                    addToCartDisabled ||
                    !isSelectionComplete ||
                    !selectedVariation ||
                    selectedVariationOutOfStock
                  }
                  className="group flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 border px-4 text-sm font-semibold leading-[40px] transition-all duration-300 hover:border-[#001122] hover:bg-[#001122] hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#00112233] disabled:hover:bg-transparent disabled:hover:text-[#001122BF]"
                  style={{
                    borderColor: INK_20,
                    fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  {addToCartSubmitting ? "Ajout…" : "Ajouter au panier"}
                  <svg
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                  >
                    <path
                      d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                      stroke="currentColor"
                      strokeMiterlimit="10"
                    />
                  </svg>
                </button>
              </div>
              {isVariationLoading ? (
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <svg
                    className="h-4 w-4 animate-spin text-zinc-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.2"
                    />
                    <path
                      d="M22 12a10 10 0 0 0-10-10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Chargement de la variation...
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-row items-center gap-[11px]">
            {thumbCanScroll && (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Vignettes precedentes"
                  onClick={() => thumbStripRef.current?.scrollBy({ left: -140, behavior: "smooth" })}
                  disabled={thumbAtStart}
                  className="flex h-3 w-3 items-center justify-center text-[#001122] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <Chevronright dir="left" stroke={1.2} />
                </button>
              </div>
            )}

            <div ref={thumbStripRef} className="strip-hide-scrollbar flex flex-row gap-[10px] overflow-x-auto overflow-y-hidden">

              {stonePickerStones.slice(0, 25).map((stone, i) => (
                <button
                  key={stone.id}
                  type="button"
                  onClick={() => setStonePickerOpen(true)}
                  aria-label={stone.name || `Image ${i + 1}`}
                  aria-current={stone.slug === product.slug ? "true" : undefined}
                  className="h-[60px] w-[60px] shrink-0 overflow-hidden border border-[#00112233] bg-white transition-colors hover:border-[#001122] cursor-pointer"
                >
                  <Image width={60} height={60} src={stone.imageUrl || "/figma/product/product-gold-ring.png"} alt={stone.name || ""} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  {stone.name}
                </button>
              ))}
            </div>

            {thumbCanScroll && (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Vignettes suivantes"
                  onClick={() => thumbStripRef.current?.scrollBy({ left: 140, behavior: "smooth" })}
                  disabled={thumbAtEnd}
                  className="flex h-3 w-3 items-center justify-center text-[#001122] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <Chevronright dir="right" stroke={1.2} />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStonePickerOpen(true)}
              className="group inline-flex cursor-pointer items-center gap-[10px] text-sm font-semibold text-[rgba(0,17,34,0.5)] underline-offset-2 transition-colors duration-300 hover:text-[#FF6633] hover:underline"
            >
              {primaryCat ? ` ${String(primaryCat.name || "").toLowerCase()}`: ""}
              <svg
                className="transition-transform duration-300 group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                  stroke="currentColor"
                  strokeMiterlimit="10"
                />
              </svg>
            </button>
          </div>
        </div>

        {!isVariableProduct ? (
          <div className="flex flex-col gap-[8px] pt-[15px] sm:flex-row">
            <button
              type="button"
              onClick={() => openAppointmentModal()}
              className="group flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 bg-[#001122] px-4 text-sm font-semibold leading-[40px] text-white transition-all duration-300 hover:border hover:border-[#001122] hover:bg-transparent hover:text-[#001122]"
              style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
            >
              <svg
                className="transition-transform duration-300 group-hover:rotate-12"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M19.03 3.56C17.36 2.17 15.29 1.26 13 1.05V3.06C14.73 3.25 16.31 3.94 17.61 4.98L19.03 3.56Z" fill="currentColor" />
                <path d="M11 3.06V1.05C8.71 1.25 6.64 2.17 4.97 3.56L6.39 4.98C7.69 3.94 9.27 3.25 11 3.06Z" fill="currentColor" />
                <path d="M4.98 6.39L3.56 4.97C2.17 6.64 1.26 8.71 1.05 11H3.06C3.25 9.27 3.94 7.69 4.98 6.39Z" fill="currentColor" />
                <path d="M20.94 11H22.95C22.74 8.71 21.83 6.64 20.44 4.97L19.02 6.39C20.06 7.69 20.75 9.27 20.94 11Z" fill="currentColor" />
                <path d="M7 12L10.44 13.56L12 17L13.56 13.56L17 12L13.56 10.44L12 7L10.44 10.44L7 12Z" fill="currentColor" />
                <path d="M12 21C8.89 21 6.15 19.41 4.54 17H7V15H1V21H3V18.3C4.99 21.14 8.27 23 12 23C16.87 23 21 19.83 22.44 15.44L20.48 14.99C19.25 18.48 15.92 21 12 21Z" fill="currentColor" />
              </svg>
              Creer avec cette pierre
            </button>
            <button
              type="button"
              onClick={() => onAddToCart?.()}
              disabled={addToCartDisabled}
              className="group flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 border px-4 text-sm font-semibold leading-[40px] text-[#001122bf] transition-all duration-300 hover:border-[#001122] hover:bg-[#001122] hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#00112233] disabled:hover:bg-transparent disabled:hover:text-[#00112240]"
              style={{
                borderColor: INK_20,
                fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {addToCartSubmitting ? "Ajout…" : "Ajouter au panier"}
              <svg
                className="transition-transform duration-300 group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                  stroke="currentColor"
                  strokeMiterlimit="10"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-[24px] pt-[30px] max-[768px]:pt-[15px]">
        <div className="flex flex-row items-center gap-[60px] max-[1201px]:gap-[30px] max-[480px]:flex-col max-[480px]:text-center max-[480px]:gap-0" style={{ backgroundColor: SAND }}>
          <div className="flex flex-1 flex-col gap-[15px] p-[15px]">
            <p className="text-sm font-semibold" style={{ color: INK }}>
              {ica.title || DEFAULT_ICA_SECTION.title}
            </p>
            <p className="text-[13px] leading-[1.6]" style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}>
              {stripHtml(ica.description || DEFAULT_ICA_SECTION.description)}
            </p>
          </div>
          <div className="mx-auto h-[160px] w-[160px] shrink-0 overflow-hidden bg-[#001122] lg:mx-0 lg:h-[180px] lg:w-[180px]">
            <Image width={160} height={160} src={ica.image || DEFAULT_ICA_SECTION.image} alt={ica.title || "ICA"} loading="lazy" decoding="async" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        </div>

        <div className="border-b" style={{ borderColor: INK_20 }}>
          {resolvedAccordionItems.map((item, i) => (
            <details key={item.title} className="group border-t" style={{ borderColor: INK_20 }} open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-3 py-[14px] pr-1 [&::-webkit-details-marker]:hidden">
                <span className="flex-1 text-sm font-semibold" style={{ color: INK }}>{item.title}</span>
                {item.linkStyle && (
                  <span className="flex gap-[3px]" aria-hidden>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <svg key={s} width="9" height="9" viewBox="0 0 12 12" fill={INK} opacity={0.35}>
                        <path d="M6 0l1.76 3.57L12 4.3 9.18 7.13 9.88 12 6 9.9 2.12 12l.7-4.87L0 4.3l4.24-.73L6 0z" />
                      </svg>
                    ))}
                  </span>
                )}
                <svg className="h-[5px] w-3 shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 12 6" fill="none" aria-hidden>
                  <path d="M1 1l5 4 5-4" stroke={INK} strokeWidth="1.2" />
                </svg>
              </summary>
              <div
                className="pb-[14px] text-[13px] leading-[1.6]"
                style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
            </details>
          ))}
        </div>

        <div className="flex flex-row items-center gap-5 max-[480px]:flex-col max-[480px]:gap-[15px] max-[480px]:text-center lg:gap-[30px]">
          <div className="h-[220px] w-[165px] shrink-0 overflow-hidden bg-[#e8dfd4]">
            <Image width={165} height={220} src={founder.image || DEFAULT_FOUNDER.image} alt={founder.imageAlt || DEFAULT_FOUNDER.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />  
          </div>
          <div className="flex flex-1 flex-col justify-center gap-[18px]">
            <div className="flex flex-col gap-[10px]">
              <p className="text-sm font-semibold" style={{ color: INK }}>
                {founder.title || DEFAULT_FOUNDER.title}
              </p>
              <div
                className="text-[14px] leading-[1.6]"
                style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                dangerouslySetInnerHTML={{ __html: founder.description || DEFAULT_FOUNDER.description }}
              />
            </div>
            <ArrowLink href={founder.linkUrl || productsPath(locale)} style={{ color: INK }}>
              {founder.linkText || DEFAULT_FOUNDER.linkText}
            </ArrowLink>
          </div>
        </div>
      </div>
    </div>
  );
}
