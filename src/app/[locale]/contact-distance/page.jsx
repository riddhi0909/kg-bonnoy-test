import { contactDistancePath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { ContactDistancePage } from "@/modules/contact-distance/components/ContactDistancePage";
import { fetchContactPageConfigByUri } from "@/modules/common/services/contact-page-service";
const META = {
  title: "Contact — Distance",
  description:
    "Prenez rendez-vous ou écrivez-nous pour toute question concernant la Maison Bonnot à distance.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = contactDistancePath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
export default async function ContactDistanceRoutePage({ params }) {
  const { locale } = await params;
  const { contactSection } = await fetchContactPageConfigByUri(contactDistancePath(locale));
  return <ContactDistancePage contactSection={contactSection} />;
}
