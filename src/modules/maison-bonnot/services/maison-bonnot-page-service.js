import { getClient } from "@/apollo/register-client";
import {
  GET_MAISON_BONNOT_PAGE_BY_URI,
  GET_GLOBAL_ACF_FIELDS,
} from "@/modules/maison-bonnot/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchMaisonBonnotPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes, globalAcfFieldsRes] = await Promise.all([
    client.query({
      query: GET_MAISON_BONNOT_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    }),
    client.query({
      query: GET_GLOBAL_ACF_FIELDS,
      fetchPolicy: "no-cache",
    }),
  ]);

  const data = pageRes?.data;
  const errors = [...(pageRes?.errors ?? [])];

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.maisonBonnotPageAcfField ?? null,
    globalAcfFields: globalAcfFieldsRes?.data?.themeSettings?.globalAcfFields ?? null,
  };
}

export async function fetchMaisonBonnotPageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchMaisonBonnotPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;
  const globalAcf = pageData?.globalAcfFields ?? null;
    const showHeroSection =
    acf?.showHeroPageSection !== false && acf?.showHeroPageSection !== "No";
  const showBreadcrumbSection =
    acf?.showBreadcrumbSection !== false && acf?.showBreadcrumbSection !== "No";
  const showJewelryInfoSection =
    acf?.showJewelryInfoSection !== false && acf?.showJewelryInfoSection !== "No";
  const showPassionSection =
    acf?.showPassionSection !== false && acf?.showPassionSection !== "No";
  const showCenterVideoSection =
    globalAcf?.showCenterVideoSection !== false && globalAcf?.showCenterVideoSection !== "No";
  const showOurKnowSection =
    acf?.showOurKnowSection !== false && acf?.showOurKnowSection !== "No";
  const showExceptionalSourcing =
    acf?.showExceptionalSourcing !== false && acf?.showExceptionalSourcing !== "No";
  const showCertificationBySection =
    acf?.showCertificationBySection !== false && acf?.showCertificationBySection !== "No";
  const showFaqSection =
    acf?.showFaqSection !== false && acf?.showFaqSection !== "No";
  const showTestimonialsSection =
    acf?.showTestimonialsSection !== false && acf?.showTestimonialsSection !== "No";
  const showOurPhilosophy =
    acf?.showOurPhilosophy !== false && acf?.showOurPhilosophy !== "No";
  return {
    raw: acf,
    hero: {
      show: showHeroSection,
      title1: String(acf?.pageHeroTitle1 ?? "").trim() || fallback.title1 || "",
      title2: String(acf?.pageHeroTitle2 ?? "").trim() || fallback.title2 || "",
      image:
        acf?.pageHeroImage?.node?.sourceUrl ||
        fallback.image ||
        "",
      imageAlt:
        String(acf?.pageHeroImage?.node?.altText ?? "").trim() ||
        fallback.imageAlt ||
        "",
    },
    breadcrumb: {
      show: showBreadcrumbSection,
      firstTitle:
        String(acf?.breadcrumbFirstTitle ?? "").trim() ||
        fallback.breadcrumbFirstTitle ||
        "",
      firstLink:
        String(acf?.breadcrumbFirstTitleLink ?? "").trim() ||
        fallback.breadcrumbFirstTitleLink ||
        "",
      secondTitle:
        String(acf?.breadcrumbSecondTitle ?? "").trim() ||
        fallback.breadcrumbSecondTitle ||
        "",
      secondLink:
        String(acf?.breadcrumbSecondTitleLink ?? "").trim() ||
        fallback.breadcrumbSecondTitleLink ||
        "",
    },
    jewelryInfo: {
      show: showJewelryInfoSection,
      title: String(acf?.jewelryInfoTitle ?? "").trim() || fallback.jewelryInfoTitle || "",
      subHeading: String(acf?.jewelryInfoSubHeading ?? "").trim() || fallback.jewelryInfoSubHeading || "",
      description: String(acf?.jewelryInfoDescription ?? "").trim() || fallback.jewelryInfoDescription || "",
      highlightedText: String(acf?.jewelryInfoHighlightedText ?? "").trim() || fallback.jewelryInfoHighlightedText || "",
      buttonTitle: String(acf?.jewelryInfoButtonTitle ?? "").trim() || fallback.jewelryInfoButtonTitle || "",
      buttonLink: String(acf?.jewelryInfoButtonLink ?? "").trim() || fallback.jewelryInfoButtonLink || "",
      imageSrc: acf?.jewelryInfoImage?.node?.sourceUrl || fallback.jewelryInfoImage || "",
      imageAlt: String(acf?.jewelryInfoImage?.node?.altText ?? "").trim() || fallback.jewelryInfoImageAlt || "",
    },
    centerVideo: {
      show: showCenterVideoSection,
      video:
        String(globalAcf?.centerVideo ?? "").trim() ||
        String(acf?.centerVideo ?? "").trim() ||
        String(fallback.centerVideo ?? "").trim() ||
        "",
    },
    passionSection: {
      show: showPassionSection,
      leftImage: acf?.passionSectionLeftImage?.node?.sourceUrl || fallback.passionSectionLeftImage || "",
      leftImageAlt: String(acf?.passionSectionLeftImage?.node?.altText ?? "").trim() || fallback.passionSectionLeftImageAlt || "",
      title: String(acf?.passionSectionTitle ?? "").trim() || fallback.passionSectionTitle || "",
      description: String(acf?.passionSectionDescription ?? "").trim() || fallback.passionSectionDescription || "",
      subDescription: String(acf?.passionSectionSubDescription ?? "").trim() || fallback.passionSectionSubDescription || "",
      buttonTitle: String(acf?.passionSectionButtonTitle ?? "").trim() || fallback.passionSectionButtonTitle || "",
      buttonLink: String(acf?.passionSectionButtonLink ?? "").trim() || fallback.passionSectionButtonLink || "",
    },
    ourKnowSection: {
      show: showOurKnowSection,
      leftImage:
        String(acf?.ourKnowLeftImage?.node?.sourceUrl ?? "").trim() ||
        String(fallback.ourKnowLeftImage ?? "").trim() ||
        "",
      leftImageAlt:
        String(acf?.ourKnowLeftImage?.node?.altText ?? "").trim() ||
        String(fallback.ourKnowLeftImageAlt ?? "").trim() ||
        "",
      leftMasterImage:
        String(acf?.ourKnowLeftMasterImage?.node?.sourceUrl ?? "").trim() ||
        String(fallback.ourKnowLeftMasterImage ?? "").trim() ||
        "",
      leftMasterImageAlt:
        String(acf?.ourKnowLeftMasterImage?.node?.altText ?? "").trim() ||
        String(fallback.ourKnowLeftMasterImageAlt ?? "").trim() ||
        "",
      title: String(acf?.ourKnowTitle ?? "").trim() || fallback.ourKnowTitle || "",
      description: String(acf?.ourKnowDescription ?? "").trim() || fallback.ourKnowDescription || "",
      contentList: (acf?.ourKnowContentList || fallback.ourKnowContentList || [])
        .map((item) => String(item?.ourKnowContent ?? "").trim())
        .filter(Boolean),
      subHeading: String(acf?.ourKnowSubHeading ?? "").trim() || fallback.ourKnowSubHeading || "",
      buttonTitle: String(acf?.ourKnowButtonTitle ?? "").trim() || fallback.ourKnowButtonTitle || "",
      buttonLink: String(acf?.ourKnowButtonLink ?? "").trim() || fallback.ourKnowButtonLink || "",
    },
    exceptionalSourcing: {
      show: showExceptionalSourcing,
      imageSrc: acf?.exceptionalSourcingImage?.node?.sourceUrl || fallback.exceptionalSourcingImage || "",
      imageAlt: String(acf?.exceptionalSourcingImage?.node?.altText ?? "").trim() || fallback.exceptionalSourcingImageAlt || "",
      title: String(acf?.exceptionalSourcingTitle ?? "").trim() || fallback.exceptionalSourcingTitle || "",
      subHeading: String(acf?.exceptionalSourcingSubHeading ?? "").trim() || fallback.exceptionalSourcingSubHeading || "",
      description: String(acf?.exceptionalSourcingDescription ?? "").trim() || fallback.exceptionalSourcingDescription || "",
      highlightedText: String(acf?.exceptionalSourcingHighlightedText ?? "").trim() || fallback.exceptionalSourcingHighlightedText || "",
      buttonTitle: String(acf?.exceptionalSourcingButtonTitle ?? "").trim() || fallback.exceptionalSourcingButtonTitle || "",
      buttonLink: String(acf?.exceptionalSourcingButtonLink ?? "").trim() || fallback.exceptionalSourcingButtonLink || "",
    },
    ourPhilosophy: {
      show: showOurPhilosophy,
      title: String(acf?.ourPhilosophyTitle ?? "").trim() || fallback.ourPhilosophyTitle || "",
      description: String(acf?.ourPhilosophyDescription ?? "").trim() || fallback.ourPhilosophyDescription || "",
      accordion: (acf?.ourPhilosophyAccordion || fallback.ourPhilosophyAccordion || [])
        .map((item) => ({
          title: String(item?.ourPhilosophyAccordionTitle ?? "").trim(),
          description: String(item?.ourPhilosophyAccordionDescription ?? "").trim(),
        })).filter((item) => item.title || item.description),
      image: acf?.ourPhilosophyImage?.node?.sourceUrl || fallback.ourPhilosophyImage || "",
      imageAlt: String(acf?.ourPhilosophyImage?.node?.altText ?? "").trim() || fallback.ourPhilosophyImageAlt || "",
    },  
    certificationBySection: {
      show: showCertificationBySection,
      image: acf?.certificationByImage?.node?.sourceUrl || fallback.certificationByImage || "",
      imageAlt: String(acf?.certificationByImage?.node?.altText ?? "").trim() || fallback.certificationByImageAlt || "",
      title: String(acf?.certificationByTitle ?? "").trim() || fallback.certificationByTitle || "",
      subHeading: String(acf?.certificationBySubHeading ?? "").trim() || fallback.certificationBySubHeading || "",
      description: String(acf?.certificationByDescription ?? "").trim() || fallback.certificationByDescription || "",
      buttonTitle: String(acf?.certificationByButtonTitle ?? "").trim() || fallback.certificationByButtonTitle || "",
      buttonLink: String(acf?.certificationByButtonLink ?? "").trim() || fallback.certificationByButtonLink || "",
    },
    faqSection: {
      show: showFaqSection,
      faqDetails: (acf?.faqDetails || fallback.faqDetails || [])
        .map((item) => ({
          faqTitle: String(item?.faqTitle ?? "").trim(),
          faqDescription: String(item?.faqDescription ?? "").trim(),
          faqButtonLinkTitle: String(item?.faqButtonLinkTitle ?? "").trim(),
          faqButtonLink: String(item?.faqButtonLink ?? "").trim(),
          faqDetailsImage: String(item?.faqDetailsImage?.node?.sourceUrl ?? "").trim() || fallback.faqDetailsImage || "",
          faqDetailsImageAlt: String(item?.faqDetailsImage?.node?.altText ?? "").trim() || fallback.faqDetailsImageAlt || "",
        })).filter((item) => item.faqTitle || item.faqDescription || item.faqButtonLinkTitle || item.faqButtonLink || item.faqDetailsImage),
    },
    testimonialsSection: {
      show: showTestimonialsSection,
    },
  };
}
