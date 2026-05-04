import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { loginPath } from "@/constants/routes";
import { LoginForm } from "@/modules/auth/components/LoginForm";

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    title: "Connexion",
    path: loginPath(locale),
    locale,
  });
}

export default function LoginPage() {
  return <LoginForm />;
}
