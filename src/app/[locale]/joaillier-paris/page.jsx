import { joaillierParisPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchJoaillierParisPageConfigByUri } from "@/modules/joaillier-paris/services/joaillier-paris-page-service";
import { JoaillierParisPage } from "@/modules/joaillier-paris/components/JoaillierParisPage";

const META = {
  title: "Joaillier Angers",
  description:
    "Discover the Joaillier Angers, a family-owned business that has been in the jewelry business for over 100 years.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = joaillierParisPath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
const JOAILLIER_PARIS_PAGE_FALLBACK_BASE = {
  joaillierParisTitle: "Joaillier Paris",
  joaillierParisDescription: "Nos créations",
};

/** @param {string} locale */
function joaillierParisPageFallback(locale) {
  return {
    ...JOAILLIER_PARIS_PAGE_FALLBACK_BASE,
    joaillierParisTitle: locale === "en" ? "Joaillier Paris" : "Joaillier Paris",
    joaillierParisDescription: locale === "en" ? "Creating a custom ring or jewelry follows the same ritual. From selecting the stone to crafting and design, we support you at every step." : "La creation d'une bague sur mesure ou de bijoux sur mesure suit un meme rituel. De la selection de la pierre, a la fabrication en passant par realisation du design, nous vous accompagnons a chaque etape.",
    
  };
}

export default async function MaisonBonnotRoutePage({ params }) {
  const { locale } = await params;
  const fallback = joaillierParisPageFallback(locale);
  const sectionConfig = await fetchJoaillierParisPageConfigByUri(
    joaillierParisPath(locale),
    fallback,
  ).catch(() => ({
    BonnotJewelerSection: {
      show: true,
      title: fallback.bonnotJewelerTitle,
      subHeading: fallback.bonnotJewelerSubHeading,
      description: fallback.bonnotJewelerDescription,
      image: fallback.bonnotJewelerImage?.node?.sourceUrl || "",
      imageAlt: fallback.bonnotJewelerImage?.node?.altText || "",
    },
    UniqueCreationsSection: {
      show: true,
      title: fallback.uniqueCreationsTitle,
      subHeading: fallback.uniqueCreationsSubHeading,
      description: fallback.uniqueCreationsDescription,
      image: fallback.uniqueCreationsImage?.node?.sourceUrl || "",
      imageAlt: fallback.uniqueCreationsImage?.node?.altText || "",
      buttonTitle: fallback.uniqueCreationsButton?.title || null,
      buttonLink: fallback.uniqueCreationsButton?.url || null,
    },
    RingsCreatedSection: {
      show: true,
      title: fallback.ringsCreatedTitle,
      subHeading: fallback.ringsCreatedSubHeading,
      description: fallback.ringsCreatedDescription,
      image: fallback.ringsCreatedImage?.node?.sourceUrl || "",
      imageAlt: fallback.ringsCreatedImage?.node?.altText || "",
      buttonTitle: fallback.ringsCreatedButton?.title || null,
      buttonLink: fallback.ringsCreatedButton?.url || null,
    },
    BonnotParisJewelerSection: {
      show: true,
      title: fallback.bonnotParisJewelerTitle,  
      description: fallback.bonnotParisJewelerDescripition,
      image: fallback.bonnotParisJewelerImage?.node?.sourceUrl || "",
      imageAlt: fallback.bonnotParisJewelerImage?.node?.altText || "",
    },
    TheStagesSection: {
      show: true,
      title: fallback.theStagesTitle,
      description: fallback.theStagesDescription,
    },
    HistorySection: {
      show: true,
      title: fallback.historyTitle,
      description: fallback.historyDescription,
    },
    DiscoverOurStonesSection: {
      show: true,
      title: fallback.discoverOurStonesTitle,
      description: fallback.discoverOurStonesDescription,
    },
    testimonialSection: {
      show: true,
    },
  }));
  return <JoaillierParisPage locale={locale} sectionConfig={sectionConfig} />;
}
