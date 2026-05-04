import { termsOfUsePath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { TermsOfUsePage } from "@/modules/terms-of-use/components/TermsOfUsePage";
import { fetchTermsOfUsePageConfigByUri } from "@/modules/terms-of-use/services/terms-of-use";

const META = {
    title: "Terms of use",
    description:
      "Veuillez renseigner une méta description en éditant le champ ci-dessous. Si vous ne le faites pas, Google essaiera de trouver une partie pertinente de votre publication et l’affichera dans les résultats de recherche.",
};

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const path = termsOfUsePath(locale);
    return buildPageMetadata({
      title: META.title,
      description: META.description,
      path,
      locale,
    });
}

const TERMS_OF_USE_PAGE_FALLBACK_BASE = {};


function termsOfUsePageFallback(locale) {
  return {
    ...TERMS_OF_USE_PAGE_FALLBACK_BASE,
  };
}

export default async function TermsOfUseRoutePage({ params }) {
  const { locale } = await params;
  const fallback = termsOfUsePageFallback(locale);  
  const sectionConfig = await fetchTermsOfUsePageConfigByUri(
    termsOfUsePath(locale),
    fallback,
  ).catch(() => ({
   
    pageHeroSection: {
      show: true,
      title: fallback.pageHeroTitle,
      image: fallback.pageHeroImage?.node?.sourceUrl,
      backUrl: fallback.pageBackUrl,
    },
    termsInformationSection: {
      show: true,
      termsInformation: fallback.termsInformation,
      lastUpdateDate: fallback.lastUpdateDate,
    },
  }));
    return <TermsOfUsePage locale={locale} sectionConfig={sectionConfig} />;
}