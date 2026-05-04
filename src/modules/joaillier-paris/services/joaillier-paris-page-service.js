import { getClient } from "@/apollo/register-client";
import {
  GET_JEWELER_PARIS_PAGE_BY_URI,
  GET_GLOBAL_ACF_FIELDS,
} from "@/modules/joaillier-paris/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchJoaillierParisPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes] = await Promise.all([
    client.query({
      query: GET_JEWELER_PARIS_PAGE_BY_URI,
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
    acf: data?.page?.jewelerParisPageAcfField ?? null,
  };
}

export async function fetchJoaillierParisPageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchJoaillierParisPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;

  const showTestimonialsSection =
    acf?.showTestimonialSection !== false &&
    acf?.showTestimonialSection !== "No";
  const showBonnotJewelerSection =
    acf?.showBonnotJewelerSection !== false &&
    acf?.showBonnotJewelerSection !== "No";
  const showUniqueCreationsSection =
    acf?.showUniqueCreationsSection !== false &&
    acf?.showUniqueCreationsSection !== "No";
  const showRingsCreatedSection =
    acf?.showRingsCreatedSection !== false &&
    acf?.showRingsCreatedSection !== "No";
  const showBonnotParisJewelerSection =
    acf?.showBonnotParisJewelerSection !== false &&
    acf?.showBonnotParisJewelerSection !== "No";
  const showTheStagesSection =
    acf?.showTheStagesSection !== false &&
    acf?.showTheStagesSection !== "No";
  const showHistorySection =
    acf?.showHistorySection !== false &&
    acf?.showHistorySection !== "No";
  const showDiscoverOurStonesSection =
    acf?.showDiscoverOurStonesSection !== false &&
    acf?.showDiscoverOurStonesSection !== "No";
  return {
    raw: acf,
    bonnotJewelerSection: {
      show: showBonnotJewelerSection,
      title: String(acf?.bonnotJewelerTitle ?? "").trim() || fallback.bonnotJewelerTitle || "",
      subHeading: String(acf?.bonnotJewelerSubHeading ?? "").trim() || fallback.bonnotJewelerSubHeading || "",
      description: String(acf?.bonnotJewelerDescription ?? "").trim() || fallback.bonnotJewelerDescription || "",
      image: acf?.bonnotJewelerImage?.node?.sourceUrl || fallback.bonnotJewelerImage || "",
      imageAlt: String(acf?.bonnotJewelerImage?.node?.altText ?? "").trim() || fallback.bonnotJewelerImageAlt || "",
    },
    uniqueCreationsSection: {
      show: showUniqueCreationsSection,
      title: String(acf?.uniqueCreationsTitle ?? "").trim() || fallback.uniqueCreationsTitle || "",
      subHeading: String(acf?.uniqueCreationsSubHeading ?? "").trim() || fallback.uniqueCreationsSubHeading || "",
      description: String(acf?.uniqueCreationsDescritption ?? "").trim() || fallback.uniqueCreationsDescription || "",
      image: acf?.uniqueCreationsImage?.node?.sourceUrl || fallback.uniqueCreationsImage || "",
      imageAlt: String(acf?.uniqueCreationsImage?.node?.altText ?? "").trim() || fallback.uniqueCreationsImageAlt || "",
      buttonTitle: String(acf?.uniqueCreationsButton?.title ?? "").trim() || fallback.uniqueCreationsButtonTitle || "",
      buttonLink: String(acf?.uniqueCreationsButton?.url ?? "").trim() || fallback.uniqueCreationsButtonLink || "",
    },  
    ringsCreatedSection: {
      show: showRingsCreatedSection,
      title: String(acf?.ringsCreatedTitle ?? "").trim() || fallback.ringsCreatedTitle || "",
      subHeading: String(acf?.ringsCreatedSubHeading ?? "").trim() || fallback.ringsCreatedSubHeading || "",
      description: String(acf?.ringsCreatedDescription ?? "").trim() || fallback.ringsCreatedDescription || "",
      image: acf?.ringsCreatedImage?.node?.sourceUrl || fallback.ringsCreatedImage || "",
      imageAlt: String(acf?.ringsCreatedImage?.node?.altText ?? "").trim() || fallback.ringsCreatedImageAlt || "",
      buttonTitle: String(acf?.ringsCreatedButton?.title ?? "").trim() || fallback.ringsCreatedButtonTitle || "",
      buttonLink: String(acf?.ringsCreatedButton?.url ?? "").trim() || fallback.ringsCreatedButtonLink || "",
    },
    bonnotParisJewelerSection: {
      show: showBonnotParisJewelerSection,
      title: String(acf?.bonnotParisJewelerTitle ?? "").trim() || fallback.bonnotParisJewelerTitle || "",
      description: String(acf?.bonnotParisJewelerDescripition ?? "").trim() || fallback.bonnotParisJewelerDescripition || "",
      image: acf?.bonnotParisJewelerImage?.node?.sourceUrl || fallback.bonnotParisJewelerImage || "",
      imageAlt: String(acf?.bonnotParisJewelerImage?.node?.altText ?? "").trim() || fallback.bonnotParisJewelerImageAlt || "",
    },
    theStagesSection: {
      show: showTheStagesSection,
      title: String(acf?.theStagesTitle ?? "").trim() || fallback.theStagesTitle || "",
      description: String(acf?.theStagesDescription ?? "").trim() || fallback.theStagesDescription || "",
    },
    historySection: {
      show: showHistorySection,
      title: String(acf?.historyTitle ?? "").trim() || fallback.historyTitle || "",
      description: String(acf?.historyDescription ?? "").trim() || fallback.historyDescription || "",
      image: acf?.historyImage?.node?.sourceUrl || fallback.historyImage || "",
      imageAlt: String(acf?.historyImage?.node?.altText ?? "").trim() || fallback.historyImageAlt || "",
    },
    discoverOurStonesSection: {
      show: showDiscoverOurStonesSection,
      title: String(acf?.discoverOurStonesTitle ?? "").trim() || fallback.discoverOurStonesTitle || "",
      description: String(acf?.discoverOurStonesDescription ?? "").trim() || fallback.discoverOurStonesDescription || "",
    },
    testimonialsSection: {
      show: showTestimonialsSection,
    },
  };
}