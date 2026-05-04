import { joaillierAngersPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchJoaillierAngersPageConfigByUri } from "@/modules/joaillier-angers/services/joaillier-angers-page-service";
import { AngersJewelerPage } from "@/modules/joaillier-angers/components/AngersJewelerPage";

const META = {
  title: "Joaillier Angers",
  description:
    "Discover the Joaillier Angers, a family-owned business that has been in the jewelry business for over 100 years.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = joaillierAngersPath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
const JOAILLIER_ANGERS_PAGE_FALLBACK_BASE = {
  joaillierAngersTitle: "Nos créations",
  joaillierAngersDescription: "sur mesure",
};

/** @param {string} locale */
function joaillierAngersPageFallback(locale) {
  return {
    ...JOAILLIER_ANGERS_PAGE_FALLBACK_BASE,
    joaillierAngersTitle: locale === "en" ? "Joaillier Angers" : "Joaillier Angers",
    joaillierAngersDescription: locale === "en" ? "Creating a custom ring or jewelry follows the same ritual. From selecting the stone to crafting and design, we support you at every step." : "La creation d'une bague sur mesure ou de bijoux sur mesure suit un meme rituel. De la selection de la pierre, a la fabrication en passant par realisation du design, nous vous accompagnons a chaque etape.",
    
  };
}

export default async function MaisonBonnotRoutePage({ params }) {
  const { locale } = await params;
  const fallback = joaillierAngersPageFallback(locale);
  const sectionConfig = await fetchJoaillierAngersPageConfigByUri(
    joaillierAngersPath(locale),
    fallback,
  ).catch(() => ({
    joaillierAngersSection: {
      show: true,
      title: fallback.joaillierAngersTitle,
      subHeading: fallback.joaillierAngersSubHeading,
      description: fallback.joaillierAngersDescription,
      image: fallback.joaillierAngersImage?.node?.sourceUrl || "",
      imageAlt: fallback.joaillierAngersImage?.node?.altText || "",
      buttonTitle: fallback.joaillierAngersButtonTitle,
      buttonLink: fallback.joaillierAngersButtonLink,
    },
    theStudioSection: {
      show: true,
      title: fallback.theStudioTitle,
      subHeading: fallback.theStudioSubHeading,
      description: fallback.theStudioDescription,
      image: fallback.theStudioImage?.node?.sourceUrl || "",
      imageAlt: fallback.theStudioImage?.node?.altText || "",
      buttonTitle: fallback.theStudioButtonTitle,
      buttonLink: fallback.theStudioButtonLink,
    },
    maisonBonnotSection: {
      show: true,
      title: fallback.maisonBonnotTitle,
      description: fallback.maisonBonnotDescription,
      image: fallback.maisonBonnotImage?.node?.sourceUrl || "",
      imageAlt: fallback.maisonBonnotImage?.node?.altText || "",
    },
    theOriginsSection: {
      show: true,
      title: fallback.theOriginsTitle,
      description: fallback.theOriginsDescription,
      image: fallback.theOriginsImage?.node?.sourceUrl || "",
      imageAlt: fallback.theOriginsImage?.node?.altText || "",
    },
    yourTailorSection: {
      show: true,
      title: fallback.yourTailorTitle,
      description: fallback.yourTailorDescription,
    },
    innovativeCreativitySection: {
      show: true,
      title: fallback.innovativeCreativityTitle,
      description: fallback.innovativeCreativityDescription,
    },
    bonnotJewelerSection: {
      show: true,
      title: fallback.bonnotJewelerTitle,
      subHeading: fallback.bonnotJewelerSubHeading,
      description: fallback.bonnotJewelerDescription,
      image: fallback.bonnotJewelerImage?.node?.sourceUrl || "",
      imageAlt: fallback.bonnotJewelerImage?.node?.altText || "",
      buttonTitle: fallback.bonnotJewelerButtonTitle,
      buttonLink: fallback.bonnotJewelerButtonLink,
    },
    testimonialsSection: {
      show: true,
    },
  }));
  return <AngersJewelerPage locale={locale} sectionConfig={sectionConfig} />;
}
