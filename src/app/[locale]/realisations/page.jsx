import { homePath, realisationsPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchRealisationsPageConfigByUri } from "@/modules/realisations/services/realisations-page-service";
import { RealisationsPage } from "@/modules/realisations/components/RealisationsPage";

const META = {
  title: "Realisations",
  description:
    "Discover how Bonnot Paris combines craftsmanship, responsible sourcing, and transparency across every step of jewelry creation.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = realisationsPath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
const REALISATIONS_PAGE_FALLBACK_BASE = {};

/** @param {string} locale */
function customMadePageFallback(locale) {
  return {
    ...REALISATIONS_PAGE_FALLBACK_BASE,
    breadcrumbFirstTitle: locale === "en" ? "Home" : "Accueil",
    breadcrumbFirstTitleLink: homePath(locale),
    breadcrumbSecondTitle: locale === "en" ? "Realisations" : "Réalisations",
    breadcrumbSecondTitleLink: realisationsPath(locale),
  };
}

/** @param {{ params: Promise<{ locale: string }>; searchParams: Promise<{ tag?: string }> }} props */
export default async function RealisationsRoutePage({ params, searchParams }) {
  const { locale } = await params;
  const { tag } = await searchParams;
  const fallback = customMadePageFallback(locale);
  const sectionConfig = await fetchRealisationsPageConfigByUri(
    realisationsPath(locale),
    fallback,
    {
      achievementTagSlug: typeof tag === "string" && tag.trim() ? tag.trim() : undefined,
    },
  ).catch(() => ({
    breadcrumb: {
      show: true,
      firstTitle: fallback.breadcrumbFirstTitle,
      firstLink: fallback.breadcrumbFirstTitleLink,
      secondTitle: fallback.breadcrumbSecondTitle,
      secondLink: fallback.breadcrumbSecondTitleLink,
    },
    achievementSection: {
      show: true,
      achievements: fallback.achievementsPosts,
    },
    featuresSection: {
      show: true,
      feature1Image: fallback.feature1Image,
      feature1ImageAlt: fallback.feature1ImageAlt,
      feature1Title: fallback.feature1Title,
      feature1Description: fallback.feature1Description,
      feature2Image: fallback.feature2Image,
      feature2ImageAlt: fallback.feature2ImageAlt,
      feature2Title: fallback.feature2Title,
      feature2Description: fallback.feature2Description,
      feature3Image: fallback.feature3Image,
      feature3ImageAlt: fallback.feature3ImageAlt,
      feature3Title: fallback.feature3Title,
      feature3Description: fallback.feature3Description,
    },
    readyToShipSection: {
      show: true,
      imageSrc: fallback.readyToShipImage,
      imageAlt: fallback.readyToShipImageAlt,
      title: fallback.readyToShipTitle,
      description: fallback.readyToShipDescription,
      buttonTitle: fallback.readyToShipButtonTitle,
      buttonLink: fallback.readyToShipButtonLink,
    },
    sourcingSection: {
      show: true,
      imageSrc: fallback.sourcingImage,
      imageAlt: fallback.sourcingImageAlt,
      title: fallback.sourcingTitle,
      subHeading: fallback.sourcingSubHeading,
      description: fallback.sourcingDescription,
      buttonTitle: fallback.sourcingButtonTitle,
      buttonLink: fallback.sourcingButtonLink,
    },
    faqSection: { 
      show: true,
      faqDetails: fallback.faqDetails.map((item) => ({
        faqTitle: item.faqTitle,
        faqDescription: item.faqDescription,
        faqButtonLinkTitle: item.faqButtonLinkTitle,
        faqButtonLink: item.faqButtonLink,
        faqDetailsImage: item.faqDetailsImage?.node?.sourceUrl || "",
        faqDetailsImageAlt: item.faqDetailsImage?.node?.altText || "",
      })),
    },
    testimonialsSection: {
      show: true,
    },
  }));
  return <RealisationsPage locale={locale} sectionConfig={sectionConfig} />;
}
