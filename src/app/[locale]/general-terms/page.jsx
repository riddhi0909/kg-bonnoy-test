import { generalTermsPath, homePath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { GeneralTermsPage } from "@/modules/general-terms/components/GeneralTermsPage";
import { fetchGeneralTermsPageConfigByUri } from "@/modules/general-terms/services/general-terms";

const META = {
    title: "General terms",
    description:
      "Veuillez renseigner une méta description en éditant le champ ci-dessous. Si vous ne le faites pas, Google essaiera de trouver une partie pertinente de votre publication et l’affichera dans les résultats de recherche.",
};

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const path = generalTermsPath(locale);
    return buildPageMetadata({
      title: META.title,
      description: META.description,
      path,
      locale,
    });
}

const GENERAL_TERMS_PAGE_FALLBACK_BASE = {};


function generalTermsPageFallback(locale) {
  return {
    ...GENERAL_TERMS_PAGE_FALLBACK_BASE,
    breadcrumbFirstTitle: locale === "en" ? "Home" : "Accueil",
    breadcrumbFirstTitleLink: homePath(locale),
    breadcrumbSecondTitle: locale === "en" ? "General terms" : "Conditions générales de vente",
    breadcrumbSecondTitleLink: generalTermsPath(locale),
  };
}

export default async function GeneralTermsRoutePage({ params }) {
  const { locale } = await params;
  const fallback = generalTermsPageFallback(locale);  
  const sectionConfig = await fetchGeneralTermsPageConfigByUri(
    generalTermsPath(locale),
    fallback,
  ).catch(() => ({
   
    generalTermsSection: {
      show: true,
      title: fallback.generalTermsTitle,
      description: fallback.generalTermsDescription,
    },
    testimonialsSection: {
      show: true,
    },
  }));
    return <GeneralTermsPage locale={locale} sectionConfig={sectionConfig} />;
}