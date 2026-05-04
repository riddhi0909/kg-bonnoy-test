import { homePath, surMesurePath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchCustomMadePageConfigByUri } from "@/modules/custom-made/services/custom-made-page-service";
import { CustomMadePage } from "@/modules/custom-made/components/CustomMadePage";

const META = {
  title: "Custom-made",
  description:
    "Discover how Bonnot Paris combines craftsmanship, responsible sourcing, and transparency across every step of jewelry creation.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = surMesurePath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
const CUSTOM_MADE_PAGE_FALLBACK_BASE = {
  title1: "Nos créations",
  title2: "sur mesure",
};

/** @param {string} locale */
function customMadePageFallback(locale) {
  return {
    ...CUSTOM_MADE_PAGE_FALLBACK_BASE,
    breadcrumbFirstTitle: locale === "en" ? "Home" : "Accueil",
    breadcrumbFirstTitleLink: homePath(locale),
    breadcrumbSecondTitle: locale === "en" ? "Custom-made" : "Sur mesure",
    breadcrumbSecondTitleLink: surMesurePath(locale),
  };
}

export default async function SurMesurePage({ params }) {
  const { locale } = await params;
  const fallback = customMadePageFallback(locale);
  const sectionConfig = await fetchCustomMadePageConfigByUri(
    surMesurePath(locale),
    fallback,
  ).catch(() => ({
    hero: {
      show: true,
      title1: fallback.title1,
      title2: fallback.title2,
      heroImage: fallback.heroImage,
      imageAlt: "",
    },
    breadcrumb: {
      show: true,
      firstTitle: fallback.breadcrumbFirstTitle,
      firstLink: fallback.breadcrumbFirstTitleLink,
      secondTitle: fallback.breadcrumbSecondTitle,
      secondLink: fallback.breadcrumbSecondTitleLink,
    },
    jewelryInfo: {
      show: true,
      title: fallback.jewelryInfoTitle,
      subHeading: fallback.jewelryInfoSubHeading,
      description: fallback.jewelryInfoDescription,
      buttonTitle: fallback.jewelryInfoButtonTitle,
      buttonLink: fallback.jewelryInfoButtonLink,
      imageSrc: fallback.jewelryInfoImage,
      imageAlt: fallback.jewelryInfoImageAlt,
    },
    stepSection: {
      show: true,
      steps: fallback.stepSectionList.map((step) => ({
        number: step.stepNumber,
        title: step.stepTitle,
        highlightedText: step.stepHighlightedText,
        description: step.stepDescription,
        buttonText: step.stepButtonText,
        buttonLink: step.stepButtonLink,
        image: step.stepImage?.node?.sourceUrl || "",
      })),
    },
    centerVideo: {
      show: true,
      video: fallback.centerVideo?.node?.sourceUrl || "",
      videoAlt: fallback.centerVideo?.node?.altText || "",
    },
    ourAchievements: {
      show: true,
      title: fallback.ourAchievementsTitle,
      subHeading: fallback.ourAchievementsSubHeading,
      buttonTitle: fallback.ourAchievementsButtonTitle,
      buttonLink: fallback.ourAchievementsButtonLink,
    },
    bonnotHouseParis: {
      show: true,
      image: fallback.bonnotHouseParisImage?.node?.sourceUrl || "",
      imageAlt: fallback.bonnotHouseParisImage?.node?.altText || "",
      title: fallback.bonnotHouseParisTitle,
      description: fallback.bonnotHouseParisDescription,
      highlightedText: fallback.bonnotHouseParisHighlightedText,
      buttonTitle: fallback.bonnotHouseParisButtonTitle,
      buttonLink: fallback.bonnotHouseParisButtonLink,
    },
    ourKnowSection: {
      show: true,
      title: fallback.ourKnowTitle,
      description: fallback.ourKnowDescription,
      contentList: fallback.ourKnowContentList,
      subHeading: fallback.ourKnowSubHeading,
      buttonTitle: fallback.ourKnowButtonTitle,
      buttonLink: fallback.ourKnowButtonLink,
    },
    certificationBySection: {
      show: true,
      image: fallback.certificationByImage?.node?.sourceUrl || "",
      imageAlt: fallback.certificationByImage?.node?.altText || "",
      title: fallback.certificationByTitle,
      description: fallback.certificationByDescription,
      buttonTitle: fallback.certificationByButtonTitle,
      buttonLink: fallback.certificationByButtonLink,
    },
    faqSection: { 
      show: true,
      faqDetails: fallback.faqDetails.map((item) => ({
        faqTitle: item.faqTitle,
        faqDescription: item.faqDescription,
        faqButtonLinkTitle: item.faqButtonLinkTitle,
        faqButtonLink: item.faqButtonLink,
        faqDetailsImage: item.faqDetailsImage?.node?.sourceUrl || "",
      })),
    },
    testimonialsSection: {
      show: true,
    },
  }));
  return <CustomMadePage locale={locale} sectionConfig={sectionConfig} />;
}
