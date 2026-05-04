import { homePath, investirPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { InvestirPage } from "@/modules/investir/components/Investirpage";
import { fetchInvestirPageConfigByUri } from "@/modules/investir/services/investir-page-service";

const META = {
    title: "Investir",
    description:
      "Veuillez renseigner une méta description en éditant le champ ci-dessous. Si vous ne le faites pas, Google essaiera de trouver une partie pertinente de votre publication et l’affichera dans les résultats de recherche.",
};


export async function generateMetadata({ params }) {
    const { locale } = await params;
    const path = investirPath(locale);
    return buildPageMetadata({
      title: META.title,
      description: META.description,
      path,
      locale,
    });
}

const INVESTIR_PAGE_FALLBACK_BASE = {};


function investirPageFallback(locale) {
  return {
    ...INVESTIR_PAGE_FALLBACK_BASE,
    breadcrumbFirstTitle: locale === "en" ? "Home" : "Accueil",
    breadcrumbFirstTitleLink: homePath(locale),
    breadcrumbSecondTitle: locale === "en" ? "Investir" : "Investir",
    breadcrumbSecondTitleLink: investirPath(locale),
  };
}

export default async function InvestirRoutePage({ params }) {
  const { locale } = await params;
  const fallback = investirPageFallback(locale);  
  const sectionConfig = await fetchInvestirPageConfigByUri(
    investirPath(locale),
    fallback,
  ).catch(() => ({
    hero: {
        show: true,
        title1: fallback.title1,
        title2: fallback.title2,
        image: fallback.image,
        imageAlt: fallback.imageAlt,
      },
    breadcrumb: {
      show: true,
      firstTitle: fallback.breadcrumbFirstTitle,
      firstLink: fallback.breadcrumbFirstTitleLink,
      secondTitle: fallback.breadcrumbSecondTitle,
      secondLink: fallback.breadcrumbSecondTitleLink,
    },
    thePotentialSection: {
      show: true,
      title: fallback.thePotentialTitle,
      subHeading: fallback.thePotentialSubHeading,
      description: fallback.thePotentialDescription,
      highlightedText: fallback.thePotentialHighlightText,
      button: fallback.thePotentialButton,
      image: fallback.thePotentialImage?.node?.sourceUrl || "",
      imageAlt: fallback.thePotentialImage?.node?.altText || "",
    },
    stepSection: {
      show: true,
      steps: fallback.stepSectionList.map((step) => ({
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
      show: true,
      title: fallback.investmentTitle,
      subtitle: fallback.investmentSubHeading,
      image: fallback.investmentImage,
      imageAlt: fallback.investmentImageAlt,
      accordion: fallback.investmentList.map((item) => ({
        title: item.investmentAccordionTitle,
        description: item.investmentAccordionDescription,
      })),
    },
    exceptionalSourcing: {
        show: true,
        leftImage: fallback.expertiseImage?.node?.sourceUrl || "",
        leftImageAlt: fallback.expertiseImage?.node?.altText,
        leftMasterImage: fallback.expertiseLeftMasterImage?.node?.sourceUrl || "",
        leftMasterImageAlt: fallback.expertiseLeftMasterImage?.node?.altText,
        title: fallback.expertiseTitle,
        description: fallback.expertiseDescription,
        contentList: fallback.expertiseContentList.map((item) => ({
          expertiseListTitle: item.expertiseListTitle,
          expertiseListDescription: item.expertiseListDescription,
        })),
        subHeading: fallback.expertiseSubHeading,
        button: fallback.expertiseButton,
    },
    faqSection: { 
      show: true,
      faqDetails: fallback.faqDetails.map((item) => ({
        faqTitle: item.faqTitle,
        faqDescription: item.faqDescription,
        faqButton: item.faqButton,
        faqDetailsImage: item.faqDetailsImage?.node?.sourceUrl || "",
      })),
    },
    testimonialsSection: {
      show: true,
    },
    performanceSection: {
      show: true,
      title: fallback.performanceTitle,
      description: fallback.performanceDescription,
      backgroundImage: fallback.performanceBackgroundImage?.node?.sourceUrl || "",
      performanceTab: fallback.performanceTab,
    },
    ourOffersSection: {
      show: true,
      heading: fallback.ourOffersHeading,
      subHeading: fallback.ourOffersSubHeading,
      managementTabHeading: fallback.managementTabHeading,
      managementTabTitle: fallback.managementTabTitle,
      managementTabSubHeading: fallback.managementTabSubHeading,
      managementTabHighlightText: fallback.managementTabHighlightText,
      managementTabImage: fallback.managementTabImage?.node?.sourceUrl || "",
      managementTabImageAlt: fallback.managementTabImage?.node?.altText || "",
      managementTabDescription: fallback.managementTabDescription,
      managementTabButton: fallback.managementTabButton,
      portfolioTabHeading: fallback.portfolioTabHeading,
      portfolioTabTitle: fallback.portfolioTabTitle,
      portfolioTabSubHeading: fallback.portfolioTabSubHeading,
      portfolioTabDescription: fallback.portfolioTabDescription,
      portfolioTabButton: fallback.portfolioTabButton,
      portfolioTabHighlightText: fallback.portfolioTabHighlightText,
      portfolioTabImage: fallback.portfolioTabImage?.node?.sourceUrl || "",
      portfolioTabImageAlt: fallback.portfolioTabImage?.node?.altText || "",
    },
  }));
    return <InvestirPage locale={locale} sectionConfig={sectionConfig} />;
}