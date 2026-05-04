import { homePath, maisonBonnotPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchMaisonBonnotPageConfigByUri } from "@/modules/maison-bonnot/services/maison-bonnot-page-service";
import { MaisonBonnotPage } from "@/modules/maison-bonnot/components/MaisonBonnotPage";


const META = {
  title: "Maison Bonnot Paris",
  description:
    "Discover how Bonnot Paris combines craftsmanship, responsible sourcing, and transparency across every step of jewelry creation.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = maisonBonnotPath(locale);
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
    breadcrumbSecondTitle: locale === "en" ? "Bonnot House" : "Maison Bonnot",
    breadcrumbSecondTitleLink: maisonBonnotPath(locale),
  };
}

export default async function MaisonBonnotRoutePage({ params }) {
  const { locale } = await params;
  const fallback = customMadePageFallback(locale);
  const sectionConfig = await fetchMaisonBonnotPageConfigByUri(
    maisonBonnotPath(locale),
    fallback,
  ).catch(() => ({
    hero: {
      show: true,
      title1: fallback.title1,
      title2: fallback.title2,
      image: fallback.image,
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
      highlightedText: fallback.jewelryInfoHighlightedText,
      buttonTitle: fallback.jewelryInfoButtonTitle,
      buttonLink: fallback.jewelryInfoButtonLink,
      imageSrc: fallback.jewelryInfoImage?.node?.sourceUrl || "",
      imageAlt: fallback.jewelryInfoImageAlt,
    },
    centerVideo: {
      show: true,
      video: fallback.centerVideo,
    },
    passionSection: {
      show: true,
      leftImage: fallback.passionSectionLeftImage?.node?.sourceUrl || "",
      leftImageAlt: fallback.passionSectionLeftImageAlt,
      title: fallback.passionSectionTitle,
      description: fallback.passionSectionDescription,
      subDescription: fallback.passionSectionSubDescription,
      buttonTitle: fallback.passionSectionButtonTitle,
      buttonLink: fallback.passionSectionButtonLink,
    },
    ourKnowSection: {
      show: true,
      leftImage: fallback.ourKnowLeftImage?.node?.sourceUrl || "",
      leftImageAlt: fallback.ourKnowLeftImageAlt,
      leftMasterImage: fallback.ourKnowLeftMasterImage?.node?.sourceUrl || "",
      leftMasterImageAlt: fallback.ourKnowLeftMasterImageAlt,
      title: fallback.ourKnowTitle,
      description: fallback.ourKnowDescription,
    },
    exceptionalSourcing: {
      show: true,
      imageSrc: fallback.exceptionalSourcingexceptionalSourcingImage?.node?.sourceUrl || "",
      imageAlt: fallback.exceptionalSourcingImageAlt,
      title: fallback.exceptionalSourcingTitle,
      subHeading: fallback.exceptionalSourcingSubHeading,
      description: fallback.exceptionalSourcingDescription,
      highlightedText: fallback.exceptionalSourcingHighlightedText,
      buttonTitle: fallback.exceptionalSourcingButtonTitle,
      buttonLink: fallback.exceptionalSourcingButtonLink,
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
    ourPhilosophy: {
      show: true,
      title: fallback.ourPhilosophyTitle,
      description: fallback.ourPhilosophyDescription,
      accordion: fallback.ourPhilosophyAccordion,
      image: fallback.ourPhilosophyImage?.node?.sourceUrl || "",
      imageAlt: fallback.ourPhilosophyImage?.node?.altText || "",
    },
  }));
  return <MaisonBonnotPage locale={locale} sectionConfig={sectionConfig} />;
}
