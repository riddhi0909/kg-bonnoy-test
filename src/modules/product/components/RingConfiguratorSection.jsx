import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { productsPath } from "@/constants/routes";
import { productPath } from "@/modules/product/routes/paths";
import { parsePrice, resolveProductPriceRaw } from "@/modules/common/utils/price";
import Image from "next/image";


const INK = "#001122";
const INK_50 = "rgba(0,17,34,0.5)";
const INK_75 = "rgba(0,17,34,0.75)";
const ACCENT = "#FF6633";
const SAND = "#F5EEE5";

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

function humanizeAttributeLabel(raw) {
  const clean = String(raw ?? "")
    .replace(/^pa_/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!clean) return "";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function getGalleryImageUrls(entity) {
  if (!entity || typeof entity !== "object") return [];
  const urls = [];
  const seen = new Set();
  const pushUrl = (img) => {
    const url =
      img?.sourceUrl ??
      img?.mediaItemUrl ??
      img?.node?.sourceUrl ??
      img?.node?.mediaItemUrl ??
      null;
    if (url && !seen.has(url)) {
      urls.push(url);
      seen.add(url);
    }
  };
  const preferredAcfNodes = Array.isArray(entity?.productAcfFields?.productGallery?.nodes)
    ? entity.productAcfFields.productGallery.nodes
    : [];
  for (const node of preferredAcfNodes) pushUrl(node);
  const nodes = Array.isArray(entity?.galleryImages?.nodes) ? entity.galleryImages.nodes : [];
  for (const node of nodes) pushUrl(node);
  const edges = Array.isArray(entity?.galleryImages?.edges) ? entity.galleryImages.edges : [];
  for (const edge of edges) pushUrl(edge?.node);
  const rawGallery = Array.isArray(entity?.galleryImages) ? entity.galleryImages : [];
  for (const item of rawGallery) pushUrl(item);
  const images = Array.isArray(entity?.images) ? entity.images : [];
  for (const item of images) pushUrl(item);
  return urls;
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
  const directGallery = getGalleryImageUrls(variation);
  for (const url of directGallery) pushUrl(url);
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
    if (typeof url === "string" && url.trim()) out.push(url.trim());
  }
  return Array.from(new Set(out));
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

function RingStyleSelector({ ringSel, setRingSel, ringRelatedProducts }) {
  return (
    <div className="flex flex-wrap gap-[10px] lg:gap-[20px]">
      {ringRelatedProducts.map((relatedProduct, i) => (
        <button
          key={relatedProduct.id ?? relatedProduct.databaseId ?? relatedProduct.slug ?? `related-${i}`}
          type="button"
          onClick={() => setRingSel(i)}
          className="group flex cursor-pointer flex-col items-center gap-[15px]"
          style={{ width: 100 }}
        >
          <span
            className={`flex h-[90px] w-[90px] max-[1025px]:h-[80px] max-[1025px]:w-[80px] items-center justify-center overflow-hidden rounded-full transition-shadow ${
              ringSel === i
                ? "ring-[1.5px] ring-[#001122]"
                : "group-hover:ring-[1.5px] group-hover:ring-[#00112266]"
            }`}
            style={{ backgroundColor: SAND }}
          >
            {relatedProduct?.featuredImage?.node?.sourceUrl && (
              <Image width={90} height={90} src={relatedProduct.featuredImage.node.sourceUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-75" />
            )}
          </span>
          <span
            className="whitespace-pre-line text-center text-[14px] leading-[1.4]"
            style={{
              color: ringSel === i ? INK : INK_75,
              fontWeight: 400,
              fontFamily:
                "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {relatedProduct?.name ?? ""}
          </span>
        </button>
      ))}
    </div>
  );
}

function RingConfiguratorProductCard({
  pairing,
  activeImg,
  product,
  locale,
  localeFmt,
  format,
  onAddToCart,
  addToCartDisabled = false,
  addToCartSubmitting = false,
  getAddToCartDisabled,
  onLifestyleImageChange,
}) {
  const pairingHref = pairing ? productPath(locale, pairing.slug) : productsPath(locale);
  const variationNodes = Array.isArray(pairing?.variations?.nodes)
    ? pairing.variations.nodes
    : [];
  const isVariableProduct =
    String(pairing?.type ?? "").toLowerCase() === "variable" ||
    variationNodes.length > 0;
  const variantGroups = useMemo(() => extractVariantGroups(pairing), [pairing]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isVariationLoading, setIsVariationLoading] = useState(false);
  const variationLoadingTimeoutRef = useRef(null);
  const variationImageCacheRef = useRef(new Map());
  useEffect(() => {
    setSelectedVariants({});
    setSelectedVariation(null);
    setIsVariationLoading(false);
    if (variationLoadingTimeoutRef.current) {
      clearTimeout(variationLoadingTimeoutRef.current);
      variationLoadingTimeoutRef.current = null;
    }
  }, [pairing?.id, pairing?.databaseId, pairing?.slug]);
  useEffect(() => {
    return () => {
      if (variationLoadingTimeoutRef.current) {
        clearTimeout(variationLoadingTimeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (!isVariableProduct) {
      setSelectedVariation(null);
      return;
    }
    const selectedEntries = Object.entries(selectedVariants).filter(
      ([, value]) => String(value ?? "").trim() !== "",
    );
    if (selectedEntries.length === 0) {
      setSelectedVariation(null);
      setIsVariationLoading(false);
      return;
    }
    const matched = variationNodes.find((variation) => {
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
      const selectedNormalized = selectedEntries.map(([k, v]) => ({
        key: normalizeAttributeKey(k),
        value: normalizeAttributeValue(v),
      }));
      const hasAllSelected = selectedNormalized.every(({ key, value }) =>
        normalizedAttrs.some((attr) => attr.key === key && attr.value === value),
      );
      if (!hasAllSelected) return false;
      return normalizedAttrs.length === selectedNormalized.length;
    }) ?? null;
    setSelectedVariation(matched);
    if (variationLoadingTimeoutRef.current) {
      clearTimeout(variationLoadingTimeoutRef.current);
    }
    variationLoadingTimeoutRef.current = setTimeout(() => {
      setIsVariationLoading(false);
      variationLoadingTimeoutRef.current = null;
    }, 220);
  }, [isVariableProduct, pairing, selectedVariants]);
  const isSelectionComplete =
    !isVariableProduct ||
    Object.values(selectedVariants).filter((v) => String(v ?? "").trim() !== "").length >=
      variantGroups.length;
  const resolvedDisabled = isVariableProduct
    ? (isVariationLoading ||
      !isSelectionComplete ||
      !selectedVariation ||
      (getAddToCartDisabled
        ? getAddToCartDisabled(
            pairing,
            selectedVariation ? { variation: selectedVariation } : undefined,
          )
        : addToCartDisabled))
    : addToCartDisabled;
  const displayRawPrice = selectedVariation
    ? resolveProductPriceRaw(selectedVariation, { locale, fallbackCountry: "fr" })
    : resolveProductPriceRaw(pairing, { locale, fallbackCountry: "fr" });
  const selectedVariationImage =
    selectedVariation?.image?.sourceUrl ??
    selectedVariation?.featuredImage?.node?.sourceUrl ??
    null;

    const selectedVariationGallery = useMemo(
      () => getGalleryImageUrls(selectedVariation),
      [selectedVariation],
     );
     const pairingGallery = useMemo(() => getGalleryImageUrls(pairing), [pairing]);


const selectedVariationLifestyleImage = useMemo(
  () =>
   selectedVariationGallery[1] ??
   selectedVariationGallery[0] ??
   selectedVariationImage ??
   pairingGallery[1] ??
   pairingGallery[0] ??
   pairing?.featuredImage?.node?.sourceUrl ??
   activeImg?.sourceUrl ??
   null,
  [selectedVariationGallery, selectedVariationImage, pairingGallery, pairing, activeImg],
 );
  const [resolvedLifestyleImage, setResolvedLifestyleImage] = useState(selectedVariationLifestyleImage);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {

      if (!selectedVariation) {
        if (!cancelled) setResolvedLifestyleImage(selectedVariationLifestyleImage);
        return;
       }

      const variationKey =
        selectedVariation?.id ??
        selectedVariation?.databaseId ??
        selectedVariation?.slug ??
        null;
      if (variationKey && variationImageCacheRef.current.has(variationKey)) {
        const cached = variationImageCacheRef.current.get(variationKey);
        if (!cancelled && cached) setResolvedLifestyleImage(cached);
        return;
      }
      const directUrls = collectVariationImageUrls(selectedVariation);
      const galleryIds = collectVariationGalleryMediaIds(selectedVariation);
      const galleryUrls = galleryIds.length > 0 ? await resolveMediaIdsToUrls(galleryIds) : [];
      const matchedImageUrls = uniqueNormalizedUrls([...directUrls, ...galleryUrls]);
      const fromVariation =
        matchedImageUrls[1] ??
        matchedImageUrls[0] ??
        selectedVariationLifestyleImage;
      if (!cancelled) {
        if (variationKey && fromVariation) {
          variationImageCacheRef.current.set(variationKey, fromVariation);
        }
        setResolvedLifestyleImage((prev) => (prev === fromVariation ? prev : fromVariation));
      }
    };
    run().catch(() => {
      if (!cancelled) setResolvedLifestyleImage(selectedVariationLifestyleImage);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedVariation, selectedVariationLifestyleImage]);
  useEffect(() => {
    onLifestyleImageChange?.(resolvedLifestyleImage);
  }, [onLifestyleImageChange, resolvedLifestyleImage]);

  const productType = product?.productAcfFields?.productType || product?.type;

  console.log("productType aaaaaaaaaa ", selectedVariationImage);
  
  return (
    <div className="flex w-full flex-col overflow-hidden lg:w-[420px] lg:shrink-0">
      <div
        className="group relative aspect-square w-full overflow-hidden border-b border-b-[#00112233]"
        style={{ backgroundColor: SAND }}
      >
        {selectedVariationImage ? (
          <Image width={200} height={200} src={selectedVariationImage} alt={pairing?.name ?? ""} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : pairing?.featuredImage?.node?.sourceUrl ? (
          <Image width={200} height={200} src={pairing.featuredImage.node.sourceUrl} alt={pairing.name ?? ""} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : activeImg?.sourceUrl ? (
          <Image width={200} height={200} src={activeImg.sourceUrl} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm" style={{ color: INK_50 }}>
            Aucune image
          </div>
        )}
        {isVariationLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <svg className="h-6 w-6 animate-spin text-[#001122]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
              <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-[16px] pt-5 lg:pt-[22px]">
        {pairing ? (
          <>
            <a href={pairingHref} className="text-[#001122] hover:text-[#FF6633]">
              <h3 className="font-serif text-[21px] font-normal leading-[1.2]">{pairing.name}</h3>
            </a>
            <p className="flex items-end gap-1 text-sm font-semibold" style={{ color: ACCENT }}>
              <span>
                {parsePrice(displayRawPrice ?? "0") > 0
                  ? format(parsePrice(displayRawPrice ?? "0"), localeFmt)
                  : displayRawPrice ?? "Prix sur demande"}
              </span>
              {parsePrice(displayRawPrice ?? "0") > 0 ? (
                <span className="text-[10px] font-normal leading-none opacity-80">incl. tax</span>
              ) : null}
            </p>
          </>
        ) : (
          <p className="font-serif text-[18px] font-normal leading-[1.3]" style={{ color: INK }}>
            Découvrez nos créations sur mesure
          </p>
        )}
        {isVariableProduct && (variantGroups.length > 0 || variationNodes.length > 0) ? (
          <div className="grid gap-[8px]">
            {variantGroups.map((group) => {
              const selectedValue = selectedVariants[group.key] ?? "";
              return (
                <label key={group.key} className="relative flex min-w-0 flex-col">
                  <select
                    aria-label={group.label}
                    value={selectedValue}
                    onChange={(event) =>
                      {
                        setIsVariationLoading(true);
                        setSelectedVariants((prev) => ({
                          ...prev,
                          [group.key]: event.target.value,
                        }));
                      }
                    }
                    className="h-10 w-full appearance-none border bg-transparent px-[14px] pr-[52px] text-center text-[14px] font-semibold leading-[20px] text-[#001122] outline-none transition-colors focus:border-[#001122]"
                    style={{
                      borderColor: "rgba(0,17,34,0.2)",
                      fontFamily:
                        "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
                    }}
                  >
                    <option value="">Choisir {group.label.toLowerCase()}</option>
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
                    <svg width="13" height="8" viewBox="0 0 13 8" fill="none">
                      <path
                        d="M12.3535 0.353577L6.35352 6.35358L0.353516 0.353576"
                        stroke="#001122"
                        strokeMiterlimit="10"
                      />
                    </svg>
                  </span>
                </label>
              );
            })}
            {variantGroups.length === 0 ? (
              <p className="text-xs text-zinc-500">
                Variations disponibles pour cette bague.
              </p>
            ) : null}
            {isVariationLoading ? (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <svg className="h-4 w-4 animate-spin text-zinc-500" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                  <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Chargement de la variation...
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="mt-auto flex flex-row gap-[10px] max-[480px]:flex-col">
        {(pairing.productAcfFields?.productType?.toLowerCase() === "stones" ||pairing.metaData.find(item => item.key === 'kg_type')?.value?.toLowerCase() === "stones") && (
            <Link
              href={pairingHref}
              className="group flex h-10 w-full items-center justify-center gap-[15px]
                border border-[#001122]
                bg-[#001122] text-sm font-semibold text-white
                transition-all duration-300
                hover:bg-transparent hover:text-[#001122]"
              style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
            >
              Configurer la vôtre
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                  stroke="currentColor"
                  strokeMiterlimit="10"
                />
              </svg>
            </Link>
          )}
          <button
            type="button"
            onClick={() =>
              onAddToCart?.(
                selectedVariation ? { variation: selectedVariation } : undefined,
              )
            }
            disabled={resolvedDisabled}
            className="group flex h-10 w-full cursor-pointer items-center justify-center gap-[15px]
              border border-[#00112233]
              text-sm font-semibold text-[#001122BF]
              transition-all duration-300
              hover:border-[#001122] hover:bg-[#001122] hover:text-white
              disabled:cursor-not-allowed disabled:opacity-45
              disabled:hover:border-[#00112233] disabled:hover:bg-transparent disabled:hover:text-[#001122BF]"
            style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
          >
            {addToCartSubmitting ? "Ajout…" : "Ajouter au panier"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
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
    </div>
  );
}

export function RingConfiguratorSection({
  ringSel,
  setRingSel,
  pairing,
  activeImg,
  product,
  locale,
  localeFmt,
  format,
  lifestyleImg,
  ringRelatedProducts = [],
  onAddToCart,
  addToCartDisabled = false,
  addToCartSubmitting = false,
  getAddToCartDisabled,
}) {
  const [selectedVariationLifestyleImage, setSelectedVariationLifestyleImage] = useState(null);
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-0 pt-16 min-[1440px]:px-[60px] min-[1440px]:pt-[120px]">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-[8px]">
          <h2 className="font-serif text-[21px] font-normal uppercase leading-[1.2]" style={{ color: INK }}>
            Créez votre bague Bonnot Paris sur mesure
          </h2>
          <p
            className="text-[14px] leading-[1.5]"
            style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
          >
            Personnalisez une de nos créations ou créez la vôtre
          </p>
        </div>
        <RingStyleSelector
          ringSel={ringSel}
          setRingSel={setRingSel}
          ringRelatedProducts={ringRelatedProducts}
        />
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-[30px]">
        <RingConfiguratorProductCard
          pairing={pairing}
          activeImg={activeImg}
          product={product}
          locale={locale}
          localeFmt={localeFmt}
          format={format}
          onAddToCart={onAddToCart}
          addToCartDisabled={addToCartDisabled}
          addToCartSubmitting={addToCartSubmitting}
          getAddToCartDisabled={getAddToCartDisabled}
          onLifestyleImageChange={setSelectedVariationLifestyleImage}
        />

        <div
          className="relative min-h-[620px] flex-1 overflow-hidden max-[1024px]:min-h-[480px] max-[767px]:min-h-[320px]"
          style={{ backgroundColor: SAND }}
        >
          {selectedVariationLifestyleImage || lifestyleImg ? (
            <Image width={200} height={200} src={selectedVariationLifestyleImage || lifestyleImg} alt={selectedVariationLifestyleImage || lifestyleImg || ""} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: INK_50 }}>
              Image bague
            </div>
          )}
        </div>
      </div>
    </section>
  );
}