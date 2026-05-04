import { getClient } from "@/apollo/register-client";
import {
  GET_ANGERS_JEWELER_PAGE_BY_URI,
} from "@/modules/joaillier-angers/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchJoaillierAngersPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes] = await Promise.all([
    client.query({
      query: GET_ANGERS_JEWELER_PAGE_BY_URI,
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
    acf: data?.page?.angersJewelerPageAcfField ?? null,
  };
}

export async function fetchJoaillierAngersPageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchJoaillierAngersPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;

  const showJoaillierAngersSection =
    acf?.showJewelerAngersSection !== false &&
    acf?.showJewelerAngersSection !== "No";
  const showCustomCreationSection =
    acf?.showCustomCreationSection !== false &&
    acf?.showCustomCreationSection !== "No";
  const showTheStudioSection =
    acf?.showTheStudioSection !== false &&
    acf?.showTheStudioSection !== "No";
  const showMaisonBonnotSection =
    acf?.showMaisonBonnotSection !== false &&
    acf?.showMaisonBonnotSection !== "No";
  const showTheOriginsSection =
    acf?.showTheOriginsSection !== false &&
    acf?.showTheOriginsSection !== "No";
  const showYourTailorSection =
    acf?.showYourTailorSection !== false &&
    acf?.showYourTailorSection !== "No";
  const showInnovativeCreativitySection =
    acf?.showInnovativeCreativitySection !== false &&
    acf?.showInnovativeCreativitySection !== "No";
  const showBonnotJewelerSection =
    acf?.showBonnotJewelerSection !== false &&
    acf?.showBonnotJewelerSection !== "No";
  const showTestimonialsSection =
    acf?.showTestimonialsSection !== false &&
    acf?.showTestimonialsSection !== "No";
  return {
    raw: acf,
    joaillierAngersSection: {
      show: showJoaillierAngersSection,
      title: String(acf?.jewelerAngersTitle ?? "").trim() || fallback.joaillierAngersTitle || "",
      subHeading:
        String(acf?.jewelerAngersSubHeading ?? "").trim() ||
        fallback.joaillierAngersSubHeading ||
        "",
      description:
        String(acf?.jewelerAngersDescription ?? "").trim() || fallback.joaillierAngersDescription || "",
      image: acf?.jewelerAngersImage?.node?.sourceUrl || fallback.joaillierAngersImage || "",
      imageAlt:
        String(acf?.jewelerAngersImage?.node?.altText ?? "").trim() ||
        fallback.joaillierAngersImageAlt ||
        "",
      buttonTitle:
        String(acf?.jewelerAngersButton?.title ?? "").trim() ||
        fallback.joaillierAngersButtonTitle ||
        "",
      buttonLink:
        String(acf?.jewelerAngersButton?.url ?? "").trim() ||
        fallback.joaillierAngersButtonLink ||
        "",
    },
    customCreationSection: {
      show: showCustomCreationSection,
      title:
        String(acf?.customCreationTitle ?? "").trim() ||
        fallback.customCreationTitle ||
        "",
      subHeading:
        String(acf?.customCreationSubHeading ?? "").trim() ||
        fallback.customCreationSubHeading ||
        "",
      description:
        String(acf?.customCreationDescription ?? "").trim() ||
        fallback.customCreationDescription ||
        "",
      image: acf?.customCreationImage?.node?.sourceUrl || fallback.customCreationImage || "",
      imageAlt:
        String(acf?.customCreationImage?.node?.altText ?? "").trim() ||
        fallback.customCreationImageAlt ||
        "",
      buttonTitle:
        String(acf?.customCreationButton?.title ?? "").trim() ||
        fallback.customCreationButtonTitle ||
        "",
      buttonLink:
        String(acf?.customCreationButton?.url ?? "").trim() ||
        fallback.customCreationButtonLink ||
        "",
    },
    theStudioSection: {
      show: showTheStudioSection,
      title: String(acf?.theStudioTitle ?? "").trim() || fallback.theStudioTitle || "",
      subHeading:
        String(acf?.theStudioSubHeading ?? "").trim() ||
        fallback.theStudioSubHeading ||
        "",
      description:
        String(acf?.theStudioDescription ?? "").trim() ||
        fallback.theStudioDescription ||
        "",
      image: acf?.theStudioImage?.node?.sourceUrl || fallback.theStudioImage || "",
      imageAlt:
        String(acf?.theStudioImage?.node?.altText ?? "").trim() ||
        fallback.theStudioImageAlt ||
        "",
      buttonTitle:
        String(acf?.theStudioButton?.title ?? "").trim() ||
        fallback.theStudioButtonTitle ||
        "",
      buttonLink:
        String(acf?.theStudioButton?.url ?? "").trim() ||
        fallback.theStudioButtonLink ||
        "",
    },
    maisonBonnotSection: {
      show: showMaisonBonnotSection,
      title:
        String(acf?.maisonBonnotTitle ?? "").trim() ||
        fallback.maisonBonnotTitle ||
        "",
      description:
        String(acf?.maisonBonnotDescription ?? "").trim() ||
        fallback.maisonBonnotDescription ||
        "",
      image: acf?.maisonBonnotImage?.node?.sourceUrl || fallback.maisonBonnotImage || "",
      imageAlt:
        String(acf?.maisonBonnotImage?.node?.altText ?? "").trim() ||
        fallback.maisonBonnotImageAlt ||
        "",
    },
    theOriginsSection: {
      show: showTheOriginsSection,
      title:
        String(acf?.theOriginsTitle ?? "").trim() ||
        fallback.theOriginsTitle ||
        "",
      description:
        String(acf?.theOriginsDescription ?? "").trim() ||
        fallback.theOriginsDescription ||
        "",
      image: acf?.theOriginsImage?.node?.sourceUrl || fallback.theOriginsImage || "",
      imageAlt:
        String(acf?.theOriginsImage?.node?.altText ?? "").trim() ||
        fallback.theOriginsImageAlt ||
        "",
    },
    yourTailorSection: {
      show: showYourTailorSection,
      title:
        String(acf?.yourTailorTitle ?? "").trim() ||
        fallback.yourTailorTitle ||
        "",
      description:
        String(acf?.yourTailorDescription ?? "").trim() ||
        fallback.yourTailorDescription ||
        "",
    },
    innovativeCreativitySection: {
      show: showInnovativeCreativitySection,
      title:
        String(acf?.innovativeCreativityTitle ?? "").trim() ||
        fallback.innovativeCreativityTitle ||
        "",
      description:
        String(acf?.innovativeCreativityDescription ?? "").trim() ||
        fallback.innovativeCreativityDescription ||
        "",
    },
    bonnotJewelerSection: {
      show: showBonnotJewelerSection,
      title:
        String(acf?.bonnotJewelerTitle ?? "").trim() ||
        fallback.bonnotJewelerTitle ||
        "",
      subHeading:
        String(acf?.bonnotJewelerSubHeading ?? "").trim() ||
        fallback.bonnotJewelerSubHeading ||
        "",
      description:
        String(acf?.bonnotJewelerDescription ?? "").trim() ||
        fallback.bonnotJewelerDescription ||
        "",
      image: acf?.bonnotJewelerImage?.node?.sourceUrl || fallback.bonnotJewelerImage || "",
      imageAlt:
        String(acf?.bonnotJewelerImage?.node?.altText ?? "").trim() ||
        fallback.bonnotJewelerImageAlt ||
        "",
      buttonTitle:
        String(acf?.bonnotJewelerButton?.title ?? "").trim() ||
        fallback.bonnotJewelerButtonTitle ||
        "",
      buttonLink:
        String(acf?.bonnotJewelerButton?.url ?? "").trim() ||
        fallback.bonnotJewelerButtonLink ||
        "",
    },
    testimonialsSection: {
      show: showTestimonialsSection,
    },
  };
}