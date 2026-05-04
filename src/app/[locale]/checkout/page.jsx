import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { checkoutPath } from "@/constants/routes";
import { CheckoutPageClient } from "@/modules/checkout/components/CheckoutPageClient";

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    title: "Paiement",
    path: checkoutPath(locale),
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
export default async function CheckoutPage({ params }) {
  const { locale } = await params;
  return <CheckoutPageClient locale={locale} />;
}
