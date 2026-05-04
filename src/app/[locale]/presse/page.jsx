import { pressPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchPressPageConfigByUri } from "@/modules/presse/services/presse-page-service";
import { PressePage } from "@/modules/presse/components/PressePage";

const META = {
  title: "Presse",
  description:
    "Discover the Presse, a family-owned business that has been in the jewelry business for over 100 years.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = pressPath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
const PRESS_PAGE_FALLBACK_BASE = {
  pressTitle: "Presse",
  pressDescription: "Presse",
};

/** @param {string} locale */
function pressPageFallback(locale) {
  return {
    ...PRESS_PAGE_FALLBACK_BASE,
    pressTitle: locale === "en" ? "Press" : "Presse",
    pressDescription: locale === "en" ? "Press" : "Presse",
    
  };
}

export default async function MaisonBonnotRoutePage({ params }) {
  const { locale } = await params;
  const fallback = pressPageFallback(locale);
  const sectionConfig = await fetchPressPageConfigByUri(
    pressPath(locale),
    fallback,
  ).catch(() => ({
    talkingAboutSection: {
      show: true,
      title: fallback.talkingAboutTitle,
      subHeading: fallback.pressSubHeading,
      articleList: fallback.articleList.map((item) => ({
        articleLink: item.articleLink,
        articleTitle: item.articleTitle,
        articleDate: item.articleDate,
        articleImage: item.articleImage?.node?.sourceUrl || "",
        articleImageAlt: item.articleImage?.node?.altText || "",
      })),
    },
    pressSection: {
      show: true,
      title: fallback.pressTitle,
      subHeading: fallback.pressSubHeading,
      description: fallback.pressDescription,
      image: fallback.pressImage?.node?.sourceUrl || "",
      imageAlt: fallback.pressImage?.node?.altText || "",
    },
    theBrandSection: {
      show: true,
      title: fallback.theBrandTitle,
      subHeading: fallback.theBrandSubHeading,
      description: fallback.theBrandDescription,
      image: fallback.theBrandImage?.node?.sourceUrl || "",
      imageAlt: fallback.theBrandImage?.node?.altText || "",
      buttonTitle: fallback.theBrandButton?.title || "",
      buttonLink: fallback.theBrandButton?.url || "",
    },
    testimonialsSection: {
      show: true,
    },
  }));
  return <PressePage locale={locale} sectionConfig={sectionConfig} />;
}
