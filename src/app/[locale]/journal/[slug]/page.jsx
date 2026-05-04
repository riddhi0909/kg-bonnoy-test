import { notFound } from "next/navigation";
import { getClient } from "@/apollo/register-client";
import { journalPath, journalPostPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { SingleJournalPage } from "@/modules/journal/components/SingleJournalPage";
import { fetchPostBySlug } from "@/modules/cms/services/cms-page-service";
import {
  fetchJournalPageConfigByUri,
  fetchLatestJournalPosts,
} from "@/modules/journal/services/journal-page-service";

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  let post = null;
  try {
    post = await fetchPostBySlug(getClient(), slug);
  } catch {
    post = null;
  }

  const title = stripHtml(post?.title || "") || "Journal";
  const description = stripHtml(post?.excerpt || post?.content || "").slice(0, 160);

  return buildPageMetadata({
    title,
    description: description || title,
    path: journalPostPath(locale, slug),
    imageUrl: post?.featuredImage?.node?.sourceUrl,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export default async function JournalSlugPage({ params }) {
  const { locale, slug } = await params;
  const post = await fetchPostBySlug(getClient(), slug).catch(() => null);
  if (!post) notFound();

  const sectionConfig = await fetchJournalPageConfigByUri(journalPath(locale)).catch(() => ({}));
  const relatedPosts = await fetchLatestJournalPosts({ excludeSlug: slug, first: 6 }).catch(() => []);

  const normalizedSectionConfig = {
    ...sectionConfig,
    relatedArticleSection: sectionConfig?.relatedBlogSection ?? sectionConfig?.relatedArticleSection,
  };

  return (
    <SingleJournalPage
      locale={locale}
      post={post}
      sectionConfig={normalizedSectionConfig}
      relatedPosts={relatedPosts}
    />
  );
}

