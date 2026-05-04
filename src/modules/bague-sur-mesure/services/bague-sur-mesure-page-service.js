import { getClient } from "@/apollo/register-client";
import {
  GET_CUSTOM_RING_PAGE_BY_URI,
} from "@/modules/bague-sur-mesure/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchCustomRingPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes] = await Promise.all([
    client.query({
      query: GET_CUSTOM_RING_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    }),
  ]);

  const data = pageRes?.data;
  const errors = [
    ...(pageRes?.errors ?? []),
  ];

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.customRingPageAcfField ?? null,
  };
}

export async function fetchCustomRingPageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchCustomRingPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;

  const showCustomCreationSection =
    acf?.showCustomCreationSection !== false &&
    acf?.showCustomCreationSection !== "No";
  const showTestimonialsSection =
    acf?.showTestimonialsSection !== false &&
    acf?.showTestimonialsSection !== "No";
  const showStoneSection =
    acf?.showStoneSection !== false &&
    acf?.showStoneSection !== "No";
  const showTheCreationSection =
    acf?.showTheCreationSection !== false &&
    acf?.showTheCreationSection !== "No";
  const showTheManufacturingSection =
    acf?.showTheManufacturingSection !== false &&
    acf?.showTheManufacturingSection !== "No";
  const showTheDiscoverySection =
    acf?.showTheDiscovery !== false &&
    acf?.showTheDiscovery !== "No";
  const showRichTextSection =
    acf?.showCustomMadeSection !== false &&
    acf?.showCustomMadeSection !== "No";
  const showTheProcessSection =
    acf?.showTheProcess !== false &&
    acf?.showTheProcess !== "No";
  const showWhyBuySection =
    acf?.showWhyBuy !== false &&
    acf?.showWhyBuy !== "No";

  return {
    raw: acf,
    customCreationSection: {
      show: showCustomCreationSection,
      title: String(acf?.customCreationTitle ?? "").trim() || fallback.customCreationTitle || "",
      description:
        String(acf?.customCreationDescription ?? "").trim() || fallback.customCreationDescription || "",
      image: acf?.customCreationImage?.node?.sourceUrl || fallback.customCreationImage || "",
      imageAlt:
        String(acf?.customCreationImage?.node?.altText ?? "").trim() ||
        fallback.customCreationImageAlt ||
        "",
    },
    theStoneSection: {
      show: showStoneSection,
      title: String(acf?.stoneTitle ?? "").trim() || fallback.stoneTitle || "",
      description: String(acf?.stoneDescription ?? "").trim() || fallback.stoneDescription || "",
      image: acf?.stoneImage?.node?.sourceUrl || fallback.stoneImage || "",
      imageAlt: String(acf?.stoneImage?.node?.altText ?? "").trim() || fallback.stoneImageAlt || "",
      buttonTitle: String(acf?.stoneButton?.title ?? "").trim() || fallback.stoneButtonTitle || "",
      buttonLink: String(acf?.stoneButton?.url ?? "").trim() || fallback.stoneButtonLink || "",
    },
    theManufacturingSection: {
      show: showTheManufacturingSection,
      title:
        String(acf?.theManufacturingTitle ?? "").trim() || fallback.theManufacturingTitle || "",
      description:
        String(acf?.theManufacturingDescription ?? "").trim() ||
        fallback.theManufacturingDescription ||
        "",
      image: acf?.theManufacturingImage?.node?.sourceUrl || fallback.theManufacturingImage || "",
      imageAlt:
        String(acf?.theManufacturingImage?.node?.altText ?? "").trim() ||
        fallback.theManufacturingImageAlt ||
        "",
      buttonTitle:
        String(acf?.theManufacturingButton?.title ?? "").trim() ||
        fallback.theManufacturingButtonTitle ||
        "",
      buttonLink:
        String(acf?.theManufacturingButton?.url ?? "").trim() ||
        fallback.theManufacturingButtonLink ||
        "",
    },
    theCreationSection: {
      show: showTheCreationSection,
      title: String(acf?.theCreationTitle ?? "").trim() || fallback.theCreationTitle || "",
      description:
        String(acf?.theCreationDescription ?? "").trim() || fallback.theCreationDescription || "",
      image: acf?.theCreationImage?.node?.sourceUrl || fallback.theCreationImage || "",
      imageAlt:
        String(acf?.theCreationImage?.node?.altText ?? "").trim() || fallback.theCreationImageAlt || "",
      buttonTitle:
        String(acf?.theCreationButton?.title ?? "").trim() || fallback.theCreationButtonTitle || "",
      buttonLink:
        String(acf?.theCreationButton?.url ?? "").trim() || fallback.theCreationButtonLink || "",
    },
    theDiscoverySection: {
      show: showTheDiscoverySection,
      title: String(acf?.theDiscoveryTitle ?? "").trim() || fallback.theDiscoveryTitle || "",
      description:
        String(acf?.theDiscoveryDescription ?? "").trim() || fallback.theDiscoveryDescription || "",
      image: acf?.theDiscoveryImage?.node?.sourceUrl || fallback.theDiscoveryImage || "",
      imageAlt:
        String(acf?.theDiscoveryImage?.node?.altText ?? "").trim() || fallback.theDiscoveryImageAlt || "",
      buttonTitle:
        String(acf?.theDiscoveryButton?.title ?? "").trim() || fallback.theDiscoveryButtonTitle || "",
      buttonLink:
        String(acf?.theDiscoveryButton?.url ?? "").trim() || fallback.theDiscoveryButtonLink || "",
    },
    customMadeSection: {
      show: showRichTextSection,
      title: String(acf?.customMadeTitle ?? "").trim() || fallback.customMadeTitle || "",
      description: String(acf?.customMadeDescription ?? "").trim() || fallback.customMadeDescription || "",
    },
    theProcessSection: {
      show: showTheProcessSection,
      title: String(acf?.theProcessTitle ?? "").trim() || fallback.theProcessTitle || "",
      description:
        String(acf?.theProcessDescription ?? "").trim() || fallback.theProcessDescription || "",
    },
    whyBuySection: {
      show: showWhyBuySection,
      title: String(acf?.whyBuyTitle ?? "").trim() || fallback.whyBuyTitle || "",
      description:
        String(acf?.whyBuyDescription ?? "").trim() || fallback.whyBuyDescription || "",
    },
    testimonialsSection: {
      show: showTestimonialsSection,
    },
  };
}