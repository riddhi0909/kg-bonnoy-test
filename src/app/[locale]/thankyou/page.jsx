import { thankYouPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { ThankyouPage } from "@/modules/thankyou/components/ThankyouPage";
import { fetchThankyouPageConfigByUri } from "@/modules/thankyou/services/thankyou-page-service";

const META = {
  title: "Merci",
  description: "Merci pour votre message ou votre attention.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = thankYouPath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

const THANKYOU_PAGE_FALLBACK_BASE = {
  thankYouTitle: "Merci",
  thankYouDescription: "Merci pour votre message ou votre attention.",
};

/** @param {string} locale */
function thankyouPageFallback(locale) {
  return {
    ...THANKYOU_PAGE_FALLBACK_BASE,
    thankYouTitle: locale === "en" ? "Thank you" : "Merci",
    thankYouDescription:
      locale === "en"
        ? "Thank you for your message or your attention."
        : "Merci pour votre message ou votre attention.",
  };
}


export default async function ThankYouRoutePage({ params }) {
  const { locale } = await params;
  const fallback = thankyouPageFallback(locale);
  let sectionConfig = await fetchThankyouPageConfigByUri(
    thankYouPath(locale),
    fallback,
  ).catch(() => ({
    thankYouSection: {
      show: true,
      title: fallback.thankYouTitle,
      description: fallback.thankYouDescription,
      buttonTitle: fallback.thankYouButtonTitle,
      buttonLink: fallback.thankYouButtonLink,
      imageSrc: fallback.thankYouImage?.node?.sourceUrl,
      imageAlt: fallback.thankYouImage?.node?.altText,
    },
    testimonialSection: {
      show: true,
    },
  }));
  return <ThankyouPage locale={locale} sectionConfig={sectionConfig} />;
}
