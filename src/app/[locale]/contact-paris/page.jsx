import { contactParisPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { ContactParisPage } from "@/modules/contact-paris/components/ContactParisPage";
import { fetchContactPageConfigByUri } from "@/modules/common/services/contact-page-service";

const META = {
  title: "Contact — Paris",
  description:
    "Prenez rendez-vous ou écrivez-nous pour toute question concernant la Maison Bonnot à Paris.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = contactParisPath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
export default async function ContactParisRoutePage({ params }) {
  const { locale } = await params;
  const { contactSection } = await fetchContactPageConfigByUri(contactParisPath(locale));
  return <ContactParisPage contactSection={contactSection} />;
}
