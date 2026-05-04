"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCurrency } from "@/modules/common/providers/currency-context";
import { categoryPath, productsPath } from "@/constants/routes";
import { productPath } from "@/modules/product/routes/paths";
import { resolveProductPriceNumber, resolveProductPriceRaw } from "@/modules/common/utils/price";
import { ProductCard } from "@/modules/product/components/ProductCard";
import { HomeProductStrip } from "@/modules/home/components/HomeProductStrip";
import { ProductTypeImage } from "@/modules/product/components/ProductTypeImage";
import { ProductInfoSection } from "@/modules/product/components/ProductInfoSection";
import { RingConfiguratorSection } from "@/modules/product/components/RingConfiguratorSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { useAppointmentModal } from "@/modules/menu/providers/appointment-modal-context";
import {
  normalizeProductToStone,
  SelectStoneModal,
} from "@/modules/product/components/SelectStoneModal";
import Image from "next/image";

const INK = "#001122";
const INK_50 = "rgba(0,17,34,0.5)";
const INK_75 = "rgba(0,17,34,0.75)";
const INK_20 = "rgba(0,17,34,0.2)";
const ACCENT = "#FF6633";
const SAND = "#F5EEE5";
const GALLERY_BG = "#F5EEE5";

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseListItems(html) {
  if (!html) return [];
  return (html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [])
    .map((li) => stripHtml(li)).filter(Boolean).slice(0, 8);
}

function firstParagraphPlain(html) {
  if (!html) return "";
  const m = String(html).match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return m ? stripHtml(m[1]) : stripHtml(html);
}

function truthyAcfShow(v) {
  return v === true || v === "yes" || v === "Yes" || v === 1 || v === "1";
}

function falsyAcfShow(v) {
  return v === false || v === "no" || v === "No" || v === 0 || v === "0";
}

// function normalizeGalleryImages(product) {
//   const out = [];
//   const seen = new Set();

//   const pushImage = (img) => {
//     const sourceUrl = img?.sourceUrl ?? img?.node?.sourceUrl ?? null;
//     if (!sourceUrl || seen.has(sourceUrl)) return;
//     out.push({
//       sourceUrl,
//       altText: img?.altText ?? img?.node?.altText ?? product?.name ?? "",
//     });
//     seen.add(sourceUrl);
//   };

//   // Primary image candidates used by different WooGraphQL shapes.
//   pushImage(product?.featuredImage?.node);
//   pushImage(product?.featuredImage);
//   pushImage(product?.image?.node);
//   pushImage(product?.image);

//   // Gallery connection shapes.
//   for (const img of product?.galleryImages?.nodes ?? []) pushImage(img);
//   for (const edge of product?.galleryImages?.edges ?? []) pushImage(edge?.node);

//   // Some backends expose a plain array.
//   for (const img of product?.images ?? []) pushImage(img);

//   return out;
// }
function normalizeGalleryImages(product) {
  const preferredGalleryNodes =
    product?.productAcfFields?.productGallery?.nodes?.length
      ? product.productAcfFields.productGallery.nodes
      : [];
  const out = [];
  const seen = new Set();


  const pushImage = (img) => {
    const sourceUrl =
      img?.sourceUrl ??
      img?.mediaItemUrl ??
      img?.node?.sourceUrl ??
      img?.node?.mediaItemUrl ??
      null;
    if (!sourceUrl || seen.has(sourceUrl)) return;
    const mimeType = String(img?.mimeType ?? img?.node?.mimeType ?? "").toLowerCase();
    const isVideoByUrl = /\\.(mp4|webm|mov|m4v)(\\?|#|$)/i.test(String(sourceUrl));
    if (mimeType.startsWith("video/") || isVideoByUrl) return;
    out.push({
      type: "image",
      sourceUrl,
      altText: img?.altText ?? img?.node?.altText ?? product?.name ?? "",
    });
    seen.add(sourceUrl);
  };


  // Primary image candidates used by different WooGraphQL shapes.
  pushImage(product?.featuredImage?.node);
  pushImage(product?.featuredImage);
  pushImage(product?.image?.node);
  pushImage(product?.image);


  // Prefer ACF gallery; fallback to galleryImages when ACF is missing/empty.
  for (const item of preferredGalleryNodes) pushImage(item);


  for (const img of product?.images ?? []) pushImage(img);


  return out;
}

function normalizeGalleryMedia(product) {
  const preferredGalleryNodes = product?.productAcfFields?.productGallery?.nodes
    ?.length
    ? product.productAcfFields.productGallery.nodes
    : [];
  if (preferredGalleryNodes.length > 0) {
    const out = [];
    const seen = new Set();

    for (const item of preferredGalleryNodes) {
      const sourceUrl =
        item?.sourceUrl ??
        item?.mediaItemUrl ??
        item?.node?.sourceUrl ??
        item?.node?.mediaItemUrl ??
        null;
      if (!sourceUrl || seen.has(sourceUrl)) continue;

      const mimeType = String(
        item?.mimeType ?? item?.node?.mimeType ?? "",
      ).toLowerCase();
      const isVideo =
        mimeType.startsWith("video/") ||
        /\\.(mp4|webm|mov|m4v)(\\?|#|$)/i.test(String(sourceUrl));

      out.push({
        type: isVideo ? "video" : "image",
        sourceUrl,
        altText: item?.altText ?? item?.node?.altText ?? product?.name ?? "",
        ...(isVideo
          ? { posterUrl: item?.posterUrl ?? item?.node?.posterUrl ?? null }
          : {}),
      });
      seen.add(sourceUrl);
    }

    return out;
  }

  const images = normalizeGalleryImages(product).map((img) => ({
    type: img.type,
    sourceUrl: img.sourceUrl,
    altText: img.altText,
  }));

  const videos = [];
  const seen = new Set(images.map((m) => m.sourceUrl));

  const pushVideo = (v) => {
    const sourceUrl =
      v?.sourceUrl ??
      v?.mediaItemUrl ??
      v?.url ??
      v?.node?.sourceUrl ??
      v?.node?.url ??
      v?.node?.mediaItemUrl ??
      null;
    if (!sourceUrl) return;
    if (seen.has(sourceUrl)) return;

    const mime = v?.mimeType ?? v?.node?.mimeType ?? "";
    const isVideo =
      String(mime).startsWith("video/") ||
      /\\.(mp4|webm|mov|m4v)(\\?|#|$)/i.test(String(sourceUrl));
    if (!isVideo) return;

    videos.push({
      type: "video",
      sourceUrl,
      altText: v?.altText ?? v?.node?.altText ?? product?.name ?? "",
      posterUrl: v?.posterUrl ?? v?.node?.posterUrl ?? null,
    });
    seen.add(sourceUrl);
  };

  for (const v of preferredGalleryNodes) pushVideo(v);

  return [...images, ...videos];
}

function Chevronright({ dir = "down", size = 12, stroke = 1 }) {
  if (dir === "left")  return <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth={stroke}/></svg>;
  if (dir === "right") return <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth={stroke}/></svg>;
  return <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`} fill="none" aria-hidden><path d={`M1 1l${size/2-1} ${size/2-2} ${size/2-1}-${size/2-2}`} stroke="currentColor" strokeWidth={stroke}/></svg>;
}
function Chevron({ dir = "down", size = 12, stroke = 1 }) {
  if (dir === "left")  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.707 6.35358L0.707031 6.35358M0.707031 6.35358L6.70703 12.3536M0.707031 6.35358L6.70703 0.353576" stroke="#001122" strokeMiterlimit="10"/></svg>;
  if (dir === "right") return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 6.35358H12M12 6.35358L6 0.353577M12 6.35358L6 12.3536" stroke="#001122" strokeMiterlimit="10"/></svg>;
  return <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`} fill="none" aria-hidden><path d={`M1 1l${size/2-1} ${size/2-2} ${size/2-1}-${size/2-2}`} stroke="currentColor" strokeWidth={stroke}/></svg>;
}

function ArrowLink({ href, children, style, className = "" }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-[15px] text-sm font-semibold text-[#001122] hover:text-[#FF6633] transition-colors duration-300 max-[480px]:justify-center ${className}`} style={style} >
      <span>{children}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"/>
      </svg>
    </Link>
  );
}

function normalizeComparableImageUrl(raw) {
  return String(raw ?? "").trim().split("?")[0];
}

const DEFAULT_FOUNDER = {
  image: "/figma/product/product-push-founder.png",
  imageAlt: "Fondateur Bonnot Paris",
  title: "Le fondateur de Bonnot Paris",
  description: "Découvrez les coulisses de ses voyages, de la sélection des gemmes à la création des bijoux. Une aventure transparente et inspirante, au plus près du métier.",
  linkText: "Suivez son aventure ici",
  linkUrl: "",
};

const DEFAULT_ICA_SECTION = {
  image: "/figma/social-3.png",
  title: "Membre de l'ICA",
  description:
    "Bonnot Paris est membre de l'International Colored Gemstone Association, gage d'éthique et de professionnalisme dans le commerce des gemmes.",
};

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
  if (!statusSaysAvailable && !qtySaysAvailable) return true;
  return false;
}

export function ProductDetail({
  product,
  locale,
  relatedProducts = [],
  popupProducts = [],
  shapeFilters = [],
  accordionItems = [],
  productDescriptionLinks = [],
  founderSection = null,
  icaSection = null,
  storiesSectionData = [],
  secondStoriesSectionData = [],
  onAddToCart,
  onAddRelatedToCart,
  addToCartSubmitting = false,
  getAddToCartDisabled,
}) {
  const resolvedAccordionItems = Array.isArray(accordionItems) ? accordionItems : [];
  const resolvedGlobalProductDescriptionLink = productDescriptionLinks.length > 0 ? productDescriptionLinks: [];
  const founder = founderSection ?? DEFAULT_FOUNDER;

  const productType = useMemo(() => {
    const acfType = String(product?.productAcfFields?.productType ?? "").trim();
    if (acfType) return acfType;
    const wooType = String(product?.type ?? "").trim();
    return wooType || null;
   }, [product]);
   
   
  const safeStoriesSectionData = Array.isArray(storiesSectionData) ? storiesSectionData : [];
  const safeSecondStoriesSectionData = Array.isArray(secondStoriesSectionData) ? secondStoriesSectionData : [];
  const productTypeData = productType === "Stones" ? safeStoriesSectionData[0] : safeSecondStoriesSectionData[0];

  const ica = {
    image: icaSection?.image || DEFAULT_ICA_SECTION.image,
    title:
      (typeof icaSection?.title === "string" && icaSection.title.trim()) || DEFAULT_ICA_SECTION.title,
    description:
      (typeof icaSection?.description === "string" && icaSection.description.trim()) ||
      DEFAULT_ICA_SECTION.description,
  };

  const { format } = useCurrency();
  const [active, setActive]   = useState(0);
  const [ringSel, setRingSel] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
   const thumbStripRef = useRef(null);
  const ringConfiguratorSectionRef = useRef(null);
  const [thumbCanScroll, setThumbCanScroll] = useState(false);
  const [thumbAtStart, setThumbAtStart] = useState(true);
  const [thumbAtEnd, setThumbAtEnd] = useState(false);
  const [stonePickerOpen, setStonePickerOpen] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [selectedVariantPriceRaw, setSelectedVariantPriceRaw] = useState("");
  const [selectedVariantImageUrls, setSelectedVariantImageUrls] = useState([]);
  const [selectedVariantSelection, setSelectedVariantSelection] = useState(null);
  const slideTimerRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));
  const activeRef = useRef(0);
  const mediaWithVariantRef = useRef([]);

  /* ─── images ─── */
    const images = useMemo(() => {
      return normalizeGalleryImages(product);
    }, [product]);
  /* ─── media (images + optional videos) ─── */
  const media = useMemo(() => {
    return normalizeGalleryMedia(product);
  }, [product]);
  const mediaWithVariant = useMemo(() => {
    const selectedList = Array.isArray(selectedVariantImageUrls)
      ? selectedVariantImageUrls
      : [];
    if (selectedList.length === 0) return media;

    const seen = new Set();
    const variantOnlyMedia = [];
    for (const rawUrl of selectedList) {
      const normalized = normalizeComparableImageUrl(rawUrl);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      variantOnlyMedia.push({
        type: "image",
        sourceUrl: rawUrl,
        altText: product?.name ?? "",
      });
    }

    return variantOnlyMedia.length > 0 ? variantOnlyMedia : media;
  }, [media, product?.name, selectedVariantImageUrls]);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    mediaWithVariantRef.current = mediaWithVariant;
  }, [mediaWithVariant]);

  const displayRelatedProducts = useMemo(() => {
    return Array.isArray(relatedProducts) ? relatedProducts : [];
  }, [relatedProducts]);

  const ringRelatedProducts = useMemo(() => {
    const acf = product?.productAcfFields ?? product?.acfFields ?? null;
    const raw =
      acf?.select_related_product ??
      acf?.select_related_products ??
      acf?.selectRelatedProduct ??
      acf?.selectRelatedProducts;
    const list = Array.isArray(raw?.nodes)
      ? raw.nodes
      : Array.isArray(raw?.edges)
        ? raw.edges.map((edge) => edge?.node)
        : Array.isArray(raw)
          ? raw
          : [];

    return list.filter(Boolean).slice(0, 5);
  }, [product]);

  const showRingConfiguratorSection = useMemo(() => {
    const acf = product?.productAcfFields ?? product?.acfFields ?? null;
    const showValue =
      acf?.show_realated_products_section ??
      acf?.showRealatedProductsSection ??
      acf?.show_related_products_section ??
      acf?.showRelatedProductsSection;
    if (showValue === undefined || showValue === null || String(showValue).trim() === "") return true;
    if (falsyAcfShow(showValue)) return false;
    return truthyAcfShow(showValue);
  }, [product]);
  const scrollToRingConfigurator = useCallback(() => {
    ringConfiguratorSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const primaryCategorySlug = String(product?.productCategories?.nodes?.[0]?.slug ?? "").trim();

  const categoryProducts = Array.isArray(popupProducts)
   ? popupProducts.filter((candidate) => {
     if (!primaryCategorySlug) return true;
     const candidateCategories = Array.isArray(candidate?.productCategories?.nodes)
      ? candidate.productCategories.nodes
      : [];
     return candidateCategories.some(
      (category) => String(category?.slug ?? "").trim() === primaryCategorySlug,
     );
    })
   : [];

  const categoryStonePickerStones = useMemo(() => {
    const map = new Map();
    const push = (p) => {
      const s = normalizeProductToStone(p);
      if (s && !map.has(s.id)) map.set(s.id, s);
    };
    push(product);
    for (const p of categoryProducts) push(p);
		if (map.size <= 1) {
		 for (const p of popupProducts) push(p);
    }
    return Array.from(map.values());
  }, [product, popupProducts]);

  


  const activeMedia = mediaWithVariant[active] ?? mediaWithVariant[0] ?? null;
  const activeImg =
    activeMedia?.type === "image"
      ? activeMedia
      : images[0] ?? null;
  const firstRingConfiguratorImage =
    ringRelatedProducts[0]?.featuredImage?.node?.sourceUrl ?? null;
  const secondaryImg = images[1] ?? images[0] ?? null;

  /* ─── price ─── */
  const rawPrice = resolveProductPriceRaw(product, {
    locale,
    fallbackCountry: "fr",
    overrideRawPrice: selectedVariantPriceRaw,
  });
  const baseNum = resolveProductPriceNumber(product, {
    locale,
    fallbackCountry: "fr",
    overrideRawPrice: selectedVariantPriceRaw,
  });
  const localeFmt = locale === "fr" ? "fr-FR" : "en-US";
  const priceLabel = baseNum > 0 ? format(baseNum, localeFmt) : rawPrice;

  /* ─── meta ─── */
  const categories = product.productCategories?.nodes ?? [];
  const primaryCat = categories[0] ?? null;
  const subtitle   = primaryCat?.name ?? "Pierre précieuse";
  const specBullets = parseListItems(product.shortDescription ?? "");
  const bodyText    = firstParagraphPlain(product.description ?? "") || stripHtml(product.shortDescription ?? "");
  const pairing = ringRelatedProducts[ringSel] ?? ringRelatedProducts[0] ?? null;
  const isVariableProduct = String(product?.type ?? "").toLowerCase() === "variable";
  const variationRequiredButMissing =
    isVariableProduct && !selectedVariantSelection;
  const selectedVariationOutOfStock =
    isVariableProduct && selectedVariantSelection
      ? isVariationOutOfStock(selectedVariantSelection)
      : false;
  const mainAddToCartDisabled = variationRequiredButMissing || selectedVariationOutOfStock || (getAddToCartDisabled
    ? getAddToCartDisabled(
        product,
        selectedVariantSelection
          ? { variation: selectedVariantSelection }
          : undefined,
      )
    : false);
  const pairingAddToCartDisabled =
    getAddToCartDisabled && pairing ? getAddToCartDisabled(pairing) : false;
  const rating = Math.max(0, Math.min(5, Number(product?.averageRating ?? 4)));

  /* ─── handlers ─── */
  const setSlide = (nextIndex) => {
    if (mediaWithVariant.length <= 1) return;
    if (isSliding) return;
    if (nextIndex < 0 || nextIndex >= mediaWithVariant.length) return;
    if (nextIndex === active) return;

    setIsSliding(true);
    setActive(nextIndex);
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    slideTimerRef.current = setTimeout(() => setIsSliding(false), 430);
  };
  const canGoPrev = active > 0;
  const canGoNext = active < mediaWithVariant.length - 1;
  const goPrev = () => setSlide(active - 1);
  const goNext = () => setSlide(active + 1);
  const focusMediaByImageUrl = useCallback((imageUrl) => {
    const target = normalizeComparableImageUrl(imageUrl);
    if (!target) return;
    const mediaIndex = mediaWithVariantRef.current.findIndex((item) => {
      if (item?.type !== "image") return false;
      return normalizeComparableImageUrl(item?.sourceUrl) === target;
    });
    if (mediaIndex >= 0 && mediaIndex !== activeRef.current) {
      setActive(mediaIndex);
      return;
    }
  }, []);
  const handleVariantSelectionChange = useCallback((payload) => {
    const nextPrice =
      payload?.priceRaw && String(payload.priceRaw).trim() !== ""
        ? String(payload.priceRaw)
        : "";
    setSelectedVariantPriceRaw(nextPrice);
    const imageUrls = Array.isArray(payload?.imageUrls)
      ? payload.imageUrls.map((url) => String(url ?? "").trim()).filter(Boolean)
      : payload?.imageUrl
        ? [String(payload.imageUrl).trim()]
        : [];
    setSelectedVariantSelection(payload?.variation ?? null);
    setSelectedVariantImageUrls(imageUrls);
    if (imageUrls.length > 0) {
      setActive(0);
      focusMediaByImageUrl(imageUrls[0]);
    } else {
      setActive(0);
    }
  }, [focusMediaByImageUrl]);

  const productDescriptionLink = Array.isArray(product?.productAcfFields?.productDescriptionLink)
  ? product.productAcfFields.productDescriptionLink
  : [];
  const productDetail = product?.productAcfFields?.productDetail

  useEffect(() => {
    if (active >= mediaWithVariant.length) setActive(0);
  }, [active, mediaWithVariant.length]);

  useEffect(() => {
    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const el = thumbStripRef.current;
    if (!el) return undefined;
    const updateThumbUi = () => {
      const max = el.scrollWidth - el.clientWidth;
      setThumbCanScroll(max > 2);
      if (el.scrollWidth <= el.clientWidth) {
        setThumbAtStart(true);
        setThumbAtEnd(true);
        return;
      }
      setThumbAtStart(el.scrollLeft <= 2);
      setThumbAtEnd(el.scrollLeft >= max - 2);
    };
    updateThumbUi();
    el.addEventListener("scroll", updateThumbUi, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateThumbUi) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", updateThumbUi);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyCart(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ringRelatedProducts.length) return;
    if (ringSel >= ringRelatedProducts.length) {
      setRingSel(0);
    }
  }, [ringSel, ringRelatedProducts]);

  /* ─── lifestyle image for jewelry section (selected related product second image) ─── */
  const lifestyleImg =
    pairing?.galleryImages?.nodes?.[1]?.sourceUrl ??
    pairing?.galleryImages?.nodes?.[1]?.mediaItemUrl ??
    pairing?.galleryImages?.nodes?.[0]?.sourceUrl ??
    pairing?.galleryImages?.nodes?.[0]?.mediaItemUrl ??
    pairing?.featuredImage?.node?.sourceUrl ??
    secondaryImg?.sourceUrl ??
    null;
  
    const { open: openAppointmentModal } = useAppointmentModal();
  return (
    
    <div className="w-full bg-[#FFFAF5]" suppressHydrationWarning>

            <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex flex-col gap-[15px] pb-[30px] pt-[50px] px-4 min-[1440px]:px-[60px] max-[768px]:pt-[30px] max-[768px]:pb-[15px]">
          <div className="flex w-full items-center justify-between gap-5 max-[768px]:flex-col max-[768px]:gap-[15px]">
            <nav
              aria-label="Fil d'ariane produit"
              className="min-w-0 text-[12px] leading-[2] text-[rgba(0,17,34,0.50)] max-[768px]:text-center"
            >
              <Link href="/" className="hover:text-[rgba(0,17,34,1)]">
                Accueil
              </Link>
              <span className="px-2">›</span>
              <Link href={productsPath(locale)} className="hover:text-[rgba(0,17,34,1)]">
                Pierres précieuses
              </Link>
              {primaryCat?.slug ? (
                <>
                  <span className="px-2">›</span>
                  <Link href={categoryPath(locale, primaryCat.slug)} className="hover:text-[rgba(0,17,34,1)]">
                    {primaryCat.name}
                  </Link>
                </>
              ) : null}
              <span className="px-2">›</span>
              <span className="text-[rgba(0,17,34,1)]">{product.name}</span>
            </nav>

            <div className="flex shrink-0 items-center gap-2 text-[14px] leading-[1.6] font-semibold text-[#001122]">
              <div className="flex items-center gap-[2px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill={i < rating ? "#001122" : "#00112233"}
                    aria-hidden="true"
                  >
                    <path d="M6 0l1.76 3.57L12 4.3 9.18 7.13 9.88 12 6 9.9 2.12 12l.7-4.87L0 4.3l4.24-.73L6 0z"></path>
                  </svg>
                ))}
              </div>
              <span>{rating} / 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 1 — Product detail
      ═══════════════════════════════════════════════ */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col min-[1025px]:flex-row">

        {/* ── LEFT: Gallery (720 px) ── */}
        <div className="w-full min-[1025px]:w-[50%] shrink-0 min-[1025px]:sticky min-[1025px]:top-[100px] h-fit">


          {/* Main image — 720 × 900 */}
          <div
            className="relative flex w-full flex-col justify-end lg:h-[720px] kg-product-image-wrapper"
            style={{ minHeight: "min(100vw, 720px)", backgroundColor: GALLERY_BG }}
            // onMouseEnter={() => setIsAutoPaused(true)}
            // onMouseLeave={() => setIsAutoPaused(false)}
          >
            {/* Gradient overlay — mimic image for reference */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background:"linear-gradient(rgba(0, 17, 34, 0) 66%, rgb(0 17 34 / 44%) 97%, rgb(0 17 34 / 55%) 100%)",
                zIndex: 1,
                transition: "opacity 0.3s"
              }}
              aria-hidden
            />

            {/* Product image */}
            <div className="absolute inset-0 overflow-hidden [touch-action:pan-y]">
              {mediaWithVariant.length > 0 ? (
                <div
                  className="flex h-full w-full will-change-transform transition-transform duration-[420ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                  style={{ transform: `translateX(-${active * 100}%)` }}
                >
                  {/* {media && <pre>{JSON.stringify(media, null, 2)}</pre>} */}
                  {mediaWithVariant.map((item, idx) => {
                    // Example of adding a static image
                    // Only render static images
                    if (item.type === "image") {
                      return (
                        <Image key={`${item.sourceUrl}-${idx}`} width={600} height={600} src={item.sourceUrl} alt={item.altText || product.name || ""} loading="lazy" decoding="async" className="h-full w-full shrink-0 object-cover" />
                      );
                    } else if (item.type === "video") {
                      return (
                        <video
                          key={`${item.sourceUrl}-${idx}`}
                          ref={el => {
                            // If this video is the active slide, play and reset to 0
                            if (el && idx === active) {
                              el.currentTime = 0;
                              el.play().catch(() => {});
                            } else if (el) {
                              el.pause();
                              el.currentTime = 0;
                            }
                          }}
                          src={item.sourceUrl}
                          className="h-full w-full shrink-0 object-cover"
                          playsInline
                          preload="metadata"
                        >
                          Désolé, votre navigateur ne prend pas en charge les vidéos intégrées.
                        </video>
                      );
                    }
                    // If the item is of a different type (fallback)
                    return null;
                  })}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: INK_50 }}>
                  Aucune image
                </div>
              )}
            </div>

            {/* Prev / Next */}
            {mediaWithVariant.length > 1 && (
              <>
                <button onClick={goPrev} type="button" aria-label="Image précédente" disabled={isSliding || !canGoPrev}
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 shadow text-[#001122] transition-opacity disabled:cursor-not-allowed disabled:opacity-35">
                  <Chevron dir="left" stroke={1.2} />
                </button>
                <button onClick={goNext} type="button" aria-label="Image suivante" disabled={isSliding || !canGoNext}
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 shadow text-[#001122] transition-opacity disabled:cursor-not-allowed disabled:opacity-35">
                  <Chevron dir="right" stroke={1.2} />
                </button>
              </>
            )}

            {/* Dots + category badge */}
            <div className="relative z-10 flex w-full items-end justify-between px-3 pb-3 pt-8">
              {mediaWithVariant.length > 1 ? (
                <div className="flex items-center gap-[5px]">
                  {mediaWithVariant.map((item, idx) => {
                    const isVideo = item.type === "video";
                    const isActive = idx === active;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSlide(idx)}
                        aria-label={`${isVideo ? "Vidéo" : "Image"} ${idx + 1}`}
                        className={`relative ${isVideo ? "h-[22px] w-[22px]" : "h-[13px] w-[13px]"} rounded-full border transition-colors
                          ${isActive 
                            ? `bg-white border-[#001122]` 
                            : `bg-white/55 border-[rgba(0,17,34,0.5)]`
                          }
                        `}
                        style={isVideo ? { padding: 0 } : undefined}
                      >
                        {isVideo ? (
                          <svg className="kg-product-video-dot absolute" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 8 10" fill="none">
                          <path d="M0 10V0L7.5 5L0 10Z" fill="#001122"/>
                          </svg>
                        ) : null}
                        {!isVideo && isActive ? (
                          <svg className="kg-product-image-dots absolute" xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 6 6" fill="none">
                            <circle cx="3" cy="3" r="3" fill="#001122"/>
                          </svg>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : <div />}

              {showRingConfiguratorSection && ringRelatedProducts.length > 0 ? (
                <button
                  type="button"
                  onClick={scrollToRingConfigurator}
                  className="flex h-[35px] max-w-[200px] items-center gap-[8px] rounded-[18px] bg-[rgba(0,17,34,0.25)] px-[6px] py-[3px] backdrop-blur-sm"
                  style={{ WebkitBackdropFilter: "blur(8px)" }}
                >
                  <div className="h-[29px] w-[29px] shrink-0 overflow-hidden rounded-full bg-[#f5eee5]">
                    {firstRingConfiguratorImage ? (
                      <Image width={29} height={29} src={firstRingConfiguratorImage} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <p className="truncate text-[9px] font-semibold text-white">Les bagues avec cette pierre</p>
                </button>
              ) : null}
                
            </div>
          </div>

        </div>

        <ProductInfoSection
          subtitle={subtitle}
          product={product}
          priceLabel={priceLabel}
          bodyText={bodyText}
          specBullets={specBullets}
          productDescriptionLink={productDescriptionLink}
          productDetail={productDetail}
          INK={INK}
          INK_20={INK_20}
          INK_50={INK_50}
          INK_75={INK_75}
          ACCENT={ACCENT}
          images={images}
          activeImg={activeImg}
          thumbCanScroll={thumbCanScroll}
          thumbAtStart={thumbAtStart}
          thumbAtEnd={thumbAtEnd}
          thumbStripRef={thumbStripRef}
          Chevronright={Chevronright}
          stonePickerStones={categoryStonePickerStones}
          setStonePickerOpen={setStonePickerOpen}
          primaryCat={primaryCat}
          onAddToCart={(payload) => onAddToCart?.(payload)}
          addToCartDisabled={mainAddToCartDisabled}
          addToCartSubmitting={addToCartSubmitting}
          ica={ica}
          SAND={SAND}
          DEFAULT_ICA_SECTION={DEFAULT_ICA_SECTION}
          resolvedAccordionItems={resolvedAccordionItems}
          resolvedGlobalProductDescriptionLink={resolvedGlobalProductDescriptionLink}
          founder={founder}
          DEFAULT_FOUNDER={DEFAULT_FOUNDER}
          ArrowLink={ArrowLink}
          locale={locale}
          productsPath={productsPath}
          stripHtml={stripHtml}
          productTypeData={productTypeData}
          productType={productType}
          onVariantSelectionChange={handleVariantSelectionChange}
        />
      </div>  

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Jewelry / Ring configurator
      ═══════════════════════════════════════════════ */}

      {showRingConfiguratorSection && ringRelatedProducts.length > 0 ? (
        <div ref={ringConfiguratorSectionRef}>
          <RingConfiguratorSection
            ringSel={ringSel}
            setRingSel={setRingSel}
            pairing={pairing}
            activeImg={activeImg}
            product={product}
            locale={locale}
            localeFmt={localeFmt}
            format={format}
            lifestyleImg={lifestyleImg}
            ringRelatedProducts={ringRelatedProducts}
            onAddToCart={async (payload) => {
              if (onAddRelatedToCart && pairing) {
                await onAddRelatedToCart(pairing, payload);
                return;
              }
              await onAddToCart?.(payload);
            }}
            addToCartDisabled={pairingAddToCartDisabled}
            addToCartSubmitting={addToCartSubmitting}
            getAddToCartDisabled={getAddToCartDisabled}
          />
        </div>
      ) : null}

      {/* ═══════════════════════════════════════════════
          SECTION 3 — Related products
      ═══════════════════════════════════════════════ */}

 


      {displayRelatedProducts.length > 0 && (

      <section className="mx-auto w-full max-w-[1440px] space-y-[30px] pt-16  min-[1440px]:pt-[120px]">
       <HomeProductStrip
          products={relatedProducts}
          locale={locale}
          title="Vous apprécierez aussi"
          viewAllHref={
            primaryCat?.slug
              ? categoryPath(locale, primaryCat.slug)
              : productsPath(locale)
          }
          viewAllLabel={
            primaryCat?.name
              ? `Tous les ${primaryCat.name}`
              : "Toutes les pierres"
          }
          stonePickerStones={categoryStonePickerStones}
        />
      </section>
      )}

    {stonePickerOpen ? (
      <SelectStoneModal
        isOpen={stonePickerOpen}
        onClose={() => setStonePickerOpen(false)}
        locale={locale}
        stones={categoryStonePickerStones}
        shapeFilters={shapeFilters}
      />
    ) : null}

      {showStickyCart ? (
        <div className="fixed bottom-0 right-0 z-[65] w-full max-w-[50%] max-[1025px]:max-w-full border-t border-l max-[1025px]:border-l-0 border-[#00112233] bg-[#FFFAF5] px-[60px] py-[30px] max-[1025px]:px-[30px] max-[1025px]:py-[15px] min-[1025px]:left-auto min-[1025px]:translate-x-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-[15px]">
              <div className="h-[45px] w-[45px] shrink-0 overflow-hidden bg-[#e8dfd4]">
                {activeImg?.sourceUrl ? (
                  <Image width={45} height={45} src={activeImg.sourceUrl} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <p className="line-clamp-2 font-serif text-[21px] font-normal leading-[1.2] max-[768px]:text-[18px]" style={{ color: INK }}>
                {product.name}
              </p>
            </div>
            <p className="shrink-0 text-[20px] font-semibold max-[768px]:text-[18px]" style={{ color: ACCENT }}>
              {priceLabel}
            </p>
          </div>
          <div className="mt-[15px] flex flex-row gap-[10px] max-[480px]:flex-col">
            <button
              type="button"
              onClick={() => openAppointmentModal(true)}
              className="group flex h-10 w-full items-center justify-center gap-[15px] border border-[#001122] bg-[#001122] text-sm font-semibold text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122] cursor-pointer"
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

              Créer avec cette pierre
            </button>
            <button
              type="button"
              onClick={() =>
                onAddToCart?.(
                  selectedVariantSelection
                    ? { variation: selectedVariantSelection }
                    : undefined,
                )
              }
              disabled={mainAddToCartDisabled}
              className="group flex h-10 w-full items-center justify-center gap-[15px] border border-[#00112233] text-sm font-semibold text-[#001122BF] transition-all duration-300 hover:border-[#001122] hover:bg-[#001122] hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#00112233] disabled:hover:bg-transparent disabled:hover:text-[#001122BF]" 
              style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
            >
              {addToCartSubmitting ? "Ajout…" : "Ajouter au panier"}
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"/>
              </svg>
            </button>
          </div>
        </div>
      ) : null}

 <TestimonialsSection pt={20} pb={0} />
    <BeforeFooterSection/>

    </div>
  );
}
