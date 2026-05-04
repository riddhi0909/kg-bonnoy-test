import { journalPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import {
  fetchJournalPageConfigByUri,
  fetchJournalPostsPage,
} from "@/modules/journal/services/journal-page-service";
import { JournalPage } from "@/modules/journal/components/JournalPage";

const META = {
  title: "Journal",
  description:
    "Discover the Journal, a family-owned business that has been in the jewelry business for over 100 years.",
};

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const path = journalPath(locale);
  return buildPageMetadata({
    title: META.title,
    description: META.description,
    path,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
const JOURNAL_PAGE_FALLBACK_BASE = {
  blogPrefix: "",
  blogTitle: "Journal",
  blogSubTitle: "",
};

/** @param {string} locale */
function journalPageFallback(locale) {
  return {
    ...JOURNAL_PAGE_FALLBACK_BASE,
    blogTitle: locale === "en" ? "Journal" : "Journal",
    blogSubTitle: locale === "en" ? "Journal" : "Journal",
    
  };
}

export default async function JournalRoutePage({ params, searchParams }) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const parsedPage = Number.parseInt(String(pageParam ?? "1"), 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const fallback = journalPageFallback(locale);

  const sectionConfig = await fetchJournalPageConfigByUri(
    journalPath(locale),
    fallback,
  ).catch(() => ({
    blogSection: {
      show: true,
      prefix: fallback.blogPrefix,
      title: fallback.blogTitle,
      subTitle: fallback.blogSubTitle,
    },
    relatedBlogSection: {
      show: true,
      title: fallback.relatedBlogTitle,
      description: fallback.relatedBlogDescription,
    },
    singleBlogSharePostSection: {
      show: true,
      title: fallback.singleBlogSharePostTitle,
      list: fallback.singleBlogSharePostlist ?? [],
    },
    blogAuthorDetailSection: {
      show: true,
      title: fallback.blogButton?.title,
      url: fallback.blogButton?.url,
    },
  }));

  const postsConfig = await fetchJournalPostsPage({ page }).catch(() => ({
    nodes: [],
    page,
    totalPages: 1,
    hasPrevPage: page > 1,
    hasNextPage: false,
  }));

  return (
    <JournalPage
      locale={locale}
      sectionConfig={sectionConfig}
      postsConfig={{
        ...postsConfig,
        basePath: journalPath(locale),
      }}
    />
  );
}
