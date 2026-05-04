import { contactInternationalPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { ContactinternationalPage } from "@/modules/contact-international/components/ContactinternationalPage";
import { fetchContactPageConfigByUri } from "@/modules/common/services/contact-page-service";
const META = {
  title: "Contact — International",
  description:
    "Prenez rendez-vous ou écrivez-nous pour toute question concernant la Maison Bonnot à l'international.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = contactInternationalPath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
export default async function ContactInternationalRoutePage({ params }) {
  const { locale } = await params;
  const { contactSection } = await fetchContactPageConfigByUri(contactInternationalPath(locale));
  return <ContactinternationalPage contactSection={contactSection} />;
}
