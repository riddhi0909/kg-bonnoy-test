import { notFound } from "next/navigation";
import {
  achievementSlugFromUri,
  homePath,
  realisationsPath,
  realisationsPostPath,
} from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { SingleRealisationPage } from "@/modules/realisations/components/SingleRealisationPage";
import {
  fetchAchievementPostBySlug,
  fetchAchievementPostsList,
  fetchRealisationsPageConfigByUri,
} from "@/modules/realisations/services/realisations-page-service";

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const REALISATIONS_PAGE_FALLBACK_BASE = {};

/** @param {string} locale */
function realisationsListingFallback(locale) {
  return {
    ...REALISATIONS_PAGE_FALLBACK_BASE,
    breadcrumbFirstTitle: locale === "en" ? "Home" : "Accueil",
    breadcrumbFirstTitleLink: homePath(locale),
    breadcrumbSecondTitle: locale === "en" ? "Realisations" : "Réalisations",
    breadcrumbSecondTitleLink: realisationsPath(locale),
  };
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  let post = null;
  try {
    post = await fetchAchievementPostBySlug(slug);
  } catch {
    post = null;
  }

  const title = stripHtml(post?.title || "") || "Réalisation";
  const description = stripHtml(
    post?.achievements?.shortDescription || post?.content || "",
  ).slice(0, 160);

  return buildPageMetadata({
    title,
    description: description || title,
    path: realisationsPostPath(locale, slug),
    imageUrl: post?.featuredImage?.node?.sourceUrl,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export default async function RealisationsSlugPage({ params }) {
  const { locale, slug } = await params;

  const post = await fetchAchievementPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const allPostsRaw = await fetchAchievementPostsList({ first: 52 }).catch(() => []);
  const allPosts = [...allPostsRaw].sort(
    (a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime(),
  );

  const currentSlug =
    String(post?.slug ?? "").trim() ||
    decodeURIComponent(String(slug || "").trim());

  const postsForSlider = allPosts
    .filter((p) => {
      const s = String(p?.slug ?? "").trim() || achievementSlugFromUri(p?.uri);
      return s && s !== currentSlug;
    })
    .slice(0, 50);

  const relatedItems = postsForSlider
    .map((p) => {
      const s =
        String(p?.slug ?? "").trim() || achievementSlugFromUri(p?.uri);
      if (!s) return null;
      const href = realisationsPostPath(locale, s);
      const image = String(p?.featuredImage?.node?.sourceUrl ?? "").trim();
      const title = stripHtml(p?.title) || "";
      const subtitle = String(p?.achievements?.subTitle ?? "").trim();
      const short = stripHtml(p?.achievements?.shortDescription ?? "");
      const subline = subtitle || (short ? short.slice(0, 120) : "");
      if (!href || !image || !title) return null;
      return { href, image, title, subtitle: subline };
    })
    .filter(Boolean);

  const fallback = realisationsListingFallback(locale);
  const sectionConfig = await fetchRealisationsPageConfigByUri(
    realisationsPath(locale),
    fallback,
  ).catch(() => ({
    breadcrumb: {
      show: true,
      firstTitle: fallback.breadcrumbFirstTitle,
      firstLink: fallback.breadcrumbFirstTitleLink,
      secondTitle: fallback.breadcrumbSecondTitle,
      secondLink: fallback.breadcrumbSecondTitleLink,
    },
    achievementSection: {
      show: true,
      achievements: fallback.achievementsPosts,
    },
    featuresSection: {
      show: true,
      feature1Image: fallback.feature1Image,
      feature1ImageAlt: fallback.feature1ImageAlt,
      feature1Title: fallback.feature1Title,
      feature1Description: fallback.feature1Description,
      feature2Image: fallback.feature2Image,
      feature2ImageAlt: fallback.feature2ImageAlt,
      feature2Title: fallback.feature2Title,
      feature2Description: fallback.feature2Description,
      feature3Image: fallback.feature3Image,
      feature3ImageAlt: fallback.feature3ImageAlt,
      feature3Title: fallback.feature3Title,
      feature3Description: fallback.feature3Description,
    },
    readyToShipSection: {
      show: true,
      imageSrc: fallback.readyToShipImage,
      imageAlt: fallback.readyToShipImageAlt,
      title: fallback.readyToShipTitle,
      description: fallback.readyToShipDescription,
      buttonTitle: fallback.readyToShipButtonTitle,
      buttonLink: fallback.readyToShipButtonLink,
    },
    sourcingSection: {
      show: true,
      imageSrc: fallback.sourcingImage,
      imageAlt: fallback.sourcingImageAlt,
      title: fallback.sourcingTitle,
      subHeading: fallback.sourcingSubHeading,
      description: fallback.sourcingDescription,
      buttonTitle: fallback.sourcingButtonTitle,
      buttonLink: fallback.sourcingButtonLink,
    },
    faqSection: {
      show: true,
      faqDetails: (fallback.faqDetails ?? []).map((item) => ({
        faqTitle: item.faqTitle,
        faqDescription: item.faqDescription,
        faqButtonLinkTitle: item.faqButtonLinkTitle,
        faqButtonLink: item.faqButtonLink,
        faqDetailsImage: item.faqDetailsImage?.node?.sourceUrl || "",
        faqDetailsImageAlt: item.faqDetailsImage?.node?.altText || "",
      })),
    },
    testimonialsSection: {
      show: true,
    },
  }));

  return (
    <SingleRealisationPage
      locale={locale}
      post={post}
      relatedItems={relatedItems}
      sectionConfig={sectionConfig}
    />
  );
}
