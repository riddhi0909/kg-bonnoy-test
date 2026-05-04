import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { cartPath } from "@/constants/routes";
import { CartPageClient } from "@/modules/cart/components/CartPageClient";

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    title: "Panier",
    path: cartPath(locale),
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
export default async function CartPage({ params }) {
  const { locale } = await params;
  return <CartPageClient locale={locale} />;
}
