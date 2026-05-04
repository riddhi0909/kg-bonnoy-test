import { getClient } from "@/apollo/register-client";
import {
  GET_INVESTIR_PAGE_BY_URI,
  GET_GLOBAL_ACF_FIELDS,
} from "@/modules/investir/api/queries";

function normalizeUri(uri) {
  const value = String(uri || "").trim();
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function fetchInvestirPageByUri(uri) {
  const client = getClient();
  const normalizedUri = normalizeUri(uri);

  const [pageRes, globalAcfFieldsRes] = await Promise.all([
    client.query({
      query: GET_INVESTIR_PAGE_BY_URI,
      variables: { uriId: normalizedUri },
      fetchPolicy: "no-cache",
    }),
    client.query({
      query: GET_GLOBAL_ACF_FIELDS,
      fetchPolicy: "no-cache",
    }),
  ]);

  const data = pageRes?.data;
  const errors = [...(pageRes?.errors ?? []), ...(globalAcfFieldsRes?.errors ?? [])];

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    acf: data?.page?.investPageAcfField ?? null,
    globalAcfFields: globalAcfFieldsRes?.data?.themeSettings?.globalAcfFields ?? null,
  };
}

export async function fetchInvestirPageConfigByUri(uri, fallback = {}) {
  const pageData = await fetchInvestirPageByUri(uri).catch(() => null);
  const acf = pageData?.acf ?? null;
  const globalAcf = pageData?.globalAcfFields ?? null;
  return {
    raw: acf,
    breadcrumb: {
      show: acf?.showBreadcrumbSection !== false && acf?.showBreadcrumbSection !== "No",
      firstTitle: String(acf?.breadcrumbFirstTitle ?? "").trim() || fallback.breadcrumbFirstTitle || "",
      firstLink: String(acf?.breadcrumbFirstTitleLink ?? "").trim() || fallback.breadcrumbFirstTitleLink || "",
      secondTitle: String(acf?.breadcrumbSecondTitle ?? "").trim() || fallback.breadcrumbSecondTitle || "",
      secondLink: String(acf?.breadcrumbSecondTitleLink ?? "").trim() || fallback.breadcrumbSecondTitleLink || "",
    },
    hero: {
      show: acf?.showHeroPageSection !== false && acf?.showHeroPageSection !== "No",
      title1: String(acf?.pageHeroTitle1 ?? "").trim() || fallback.title1 || "",
      title2: String(acf?.pageHeroTitle2 ?? "").trim() || fallback.title2 || "",
      image: acf?.pageHeroImage?.node?.sourceUrl || fallback.image || "",
      imageAlt: String(acf?.pageHeroImage?.node?.altText ?? "").trim() || fallback.imageAlt || "",
    },
    thePotentialSection: {
      show: acf?.showThePotentialSection !== false && acf?.showThePotentialSection !== "No",
      title: acf?.thePotentialTitle,
      subHeading: acf?.thePotentialSubHeading,
      description: acf?.thePotentialDescription,
      highlightedText: acf?.thePotentialHighlightText,
      button: acf?.thePotentialButton,
      image: acf?.thePotentialImage?.node?.sourceUrl, 
      imageAlt: acf?.thePotentialImage?.node?.altText,
    },
    stepSection: {
      show: acf?.showStepSection !== false && acf?.showStepSection !== "No",
      steps: (acf?.stepSectionList ?? []).map((step) => ({
        stepPrefix: step.stepPrefix,
        title: step.stepTitle,
        subtitle: step.stepSubHeading,
        body: step.stepDescription,
        image: step.stepImage?.node?.sourceUrl,
        imageAlt: step.stepImage?.node?.altText,
        stepButton: step.stepButton,
      })),
    },
    investmentSection: {
      show: acf?.showInvestmentSection !== false && acf?.showInvestmentSection !== "No",
      title: acf?.investmentTitle,
      subtitle: acf?.investmentSubHeading,
      image: acf?.investmentImage?.node?.sourceUrl,
      imageAlt: acf?.investmentImage?.node?.altText,
      accordion: (acf?.investmentList ?? []).map((item) => ({
        title: item.investmentAccordionTitle,
        description: item.investmentAccordionDescription,
      })),
    },
    exceptionalSourcing: {
      show:acf?.showExpertiseSection !== false && acf?.showExpertiseSection !== "No",
      leftImage: acf?.expertiseImage?.node?.sourceUrl,
      leftImageAlt: acf?.expertiseImage?.node?.altText,
      leftMasterImage: acf?.expertiseLeftMasterImage?.node?.sourceUrl, 
      leftMasterImageAlt: acf?.expertiseLeftMasterImage?.node?.altText,
      title: acf?.expertiseTitle,
      description: acf?.expertiseDescription,
      contentList: acf?.expertiseContentList,
      subHeading: acf?.expertiseSubHeading,
      button: acf?.expertiseButton,
    },
    faqSection: {
      show: acf?.showFaqSection !== false && acf?.showFaqSection !== "No",
      faqDetails: (acf?.faqDetails || fallback.faqDetails || [])
        .map((item) => ({
          faqTitle: String(item?.faqTitle ?? "").trim(),
          faqDescription: String(item?.faqDescription ?? "").trim(),
          faqButton: item.faqButton,
          faqDetailsImage: String(item?.faqDetailsImage?.node?.sourceUrl ?? "").trim() || fallback.faqDetailsImage || "",
        })).filter((item) => item.faqTitle || item.faqDescription || item.faqButton || item.faqDetailsImage),
    },
    sourcingSection: {
      show: acf?.showSourcingSection !== false && acf?.showSourcingSection !== "No",
      image: acf?.sourcingImage?.node?.sourceUrl,
      imageAlt: acf?.sourcingImage?.node?.altText,
      title: acf?.sourcingTitle,
      subHeading: acf?.sourcingSubHeading,
      description: acf?.sourcingDescription,
      button: acf?.sourcingButton,
    },
    testimonialsSection: {
      show: acf?.showTestimonialsSection !== false && acf?.showTestimonialsSection !== "No",
    },
    performanceSection: {
      show: acf?.showPerformanceSection !== false && acf?.showPerformanceSection !== "No",
      title: acf?.performanceTitle,
      description: acf?.performanceDescription,
      backgroundImage: acf?.performanceBackgroundImage?.node?.sourceUrl,
      performanceTab: acf?.performanceTab,
    },
    ourOffersSection: {
      show: acf?.showOurOffers !== false && acf?.showOurOffers !== "No",
      heading: acf?.ourOffersHeading,
      subHeading: acf?.ourOffersSubHeading,
      managementTabHeading: acf?.managementTabHeading,
      managementTabTitle: acf?.managementTabTitle,
      managementTabSubHeading: acf?.managementTabSubHeading,
      managementTabHighlightText: acf?.managementTabHighlightText,
      managementTabImage: acf?.managementTabImage?.node?.sourceUrl,
      managementTabImageAlt: acf?.managementTabImage?.node?.altText,
      managementTabDescription: acf?.managementTabDescription,
      managementTabButton: acf?.managementTabButton,
      portfolioTabHeading: acf?.portfolioTabHeading,
      portfolioTabTitle: acf?.portfolioTabTitle,
      portfolioTabSubHeading: acf?.portfolioTabSubHeading,
      portfolioTabDescription: acf?.portfolioTabDescription,
      portfolioTabButton: acf?.portfolioTabButton,
      portfolioTabHighlightText: acf?.portfolioTabHighlightText,
      portfolioTabImage: acf?.portfolioTabImage?.node?.sourceUrl,
      portfolioTabImageAlt: acf?.portfolioTabImage?.node?.altText,
    },
  };
}
