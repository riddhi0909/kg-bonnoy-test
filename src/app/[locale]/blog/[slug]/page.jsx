import { notFound } from "next/navigation";
import Link from "next/link";
import { getClient } from "@/apollo/register-client";
import { blogPath, blogPostPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchPostBySlug } from "@/modules/cms/services/cms-page-service";

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value, locale) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

/** @param {{ params: Promise<{ locale: string, slug: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  let post = null;
  try {
    post = await fetchPostBySlug(getClient(), slug);
  } catch {
    post = null;
  }

  const title = stripHtml(post?.title || "Article");
  const description = stripHtml(post?.excerpt || post?.content || "").slice(0, 160);

  return buildPageMetadata({
    title,
    description: description || title,
    path: blogPostPath(locale, slug),
    imageUrl: post?.featuredImage?.node?.sourceUrl,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string, slug: string }> }} props */
export default async function BlogPostPage({ params }) {
  const { locale, slug } = await params;
  let post = null;
  try {
    post = await fetchPostBySlug(getClient(), slug);
  } catch {
    post = null;
  }
  if (!post) notFound();

  const title = post?.title || "Article";
  const dateText = formatDate(post?.date, locale);
  const image = post?.featuredImage?.node;

  return (
    <article className="space-y-6">
      <Link
        href={blogPath(locale)}
        className="inline-flex text-sm font-medium text-zinc-700 underline dark:text-zinc-300"
      >
        Retour au blog
      </Link>
      <header className="space-y-3">
        {dateText ? (
          <p className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {dateText}
          </p>
        ) : null}
        <h1
          className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </header>
      {image?.sourceUrl ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <img
            src={image.sourceUrl}
            alt={image.altText || stripHtml(title)}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <section className="prose prose-zinc max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
      </section>
    </article>
  );
}
