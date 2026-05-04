import { homePath, bagueSurMesurePath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchCustomRingPageConfigByUri } from "@/modules/bague-sur-mesure/services/bague-sur-mesure-page-service";
import { BagueSurMesurePage } from "@/modules/bague-sur-mesure/components/BagueSurMesurePage";

const META = {
  title: "Bague sur mesure",
  description:
    "Discover how Bonnot Paris combines craftsmanship, responsible sourcing, and transparency across every step of jewelry creation.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = bagueSurMesurePath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
const CUSTOM_RING_PAGE_FALLBACK_BASE = {
  customCreationTitle: "Nos créations",
  customCreationDescription: "sur mesure",
};

/** @param {string} locale */
function customRingPageFallback(locale) {
  return {
    ...CUSTOM_RING_PAGE_FALLBACK_BASE,
    customCreationTitle: locale === "en" ? "Custom creation" : "Creation sur mesure",
    customCreationDescription: locale === "en" ? "Creating a custom ring or jewelry follows the same ritual. From selecting the stone to crafting and design, we support you at every step." : "La creation d'une bague sur mesure ou de bijoux sur mesure suit un meme rituel. De la selection de la pierre, a la fabrication en passant par realisation du design, nous vous accompagnons a chaque etape.",
    
  };
}

export default async function MaisonBonnotRoutePage({ params }) {
  const { locale } = await params;
  const fallback = customRingPageFallback(locale);
  const sectionConfig = await fetchCustomRingPageConfigByUri(
    bagueSurMesurePath(locale),
    fallback,
  ).catch(() => ({
    customCreationSection: {
      show: true,
      title: fallback.customCreationTitle,
      description: fallback.customCreationDescription,
      image: fallback.customCreationImage?.node?.sourceUrl || "",
      imageAlt: fallback.customCreationImage?.node?.altText || "",
    },
    theStoneSection: {
      show: true,
      title: fallback.stoneTitle,
      description: fallback.stoneDescription,
      image: fallback.stoneImage?.node?.sourceUrl || "",
      imageAlt: fallback.stoneImage?.node?.altText || "",
      buttonTitle: fallback.stoneButtonTitle,
      buttonLink: fallback.stoneButtonLink,
    },
    theManufacturingSection: {
      show: true,
      title: fallback.theManufacturingTitle,
      description: fallback.theManufacturingDescription,
      image: fallback.theManufacturingImage?.node?.sourceUrl || "",
      imageAlt: fallback.theManufacturingImage?.node?.altText || "",
      buttonTitle: fallback.theManufacturingButtonTitle,
      buttonLink: fallback.theManufacturingButtonLink,
    },
    theCreationSection: {
      show: true,
      title: fallback.theCreationTitle,
      description: fallback.theCreationDescription,
      image: fallback.theCreationImage?.node?.sourceUrl || "",
      imageAlt: fallback.theCreationImage?.node?.altText || "",
      buttonTitle: fallback.theCreationButtonTitle,
      buttonLink: fallback.theCreationButtonLink,
    },
    theDiscoverySection: {
      show: true,
      title: fallback.theDiscoveryTitle,
      description: fallback.theDiscoveryDescription,
      image: fallback.theDiscoveryImage?.node?.sourceUrl || "",
      imageAlt: fallback.theDiscoveryImage?.node?.altText || "",
      buttonTitle: fallback.theDiscoveryButtonTitle,
      buttonLink: fallback.theDiscoveryButtonLink,
    },
    customMadeSection: {
      show: true,
      title: fallback.customMadeTitle,
      description: fallback.customMadeDescription,
    },
    theProcessSection: {
      show: true,
      title: fallback.theProcessTitle,
      description: fallback.theProcessDescription,
    },
    whyBuySection: {
      show: true,
      title: fallback.whyBuyTitle,
      description: fallback.whyBuyDescription,
    },
    testimonialsSection: {
      show: true,
    },
  }));
  return <BagueSurMesurePage locale={locale} sectionConfig={sectionConfig} />;
}
