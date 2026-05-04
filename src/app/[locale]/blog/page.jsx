import Link from "next/link";
import { getClient } from "@/apollo/register-client";
import { blogPath, blogPostPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchPosts } from "@/modules/cms/services/cms-page-service";

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

/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    title: "Blog",
    description: "Articles et actualites depuis WordPress.",
    path: blogPath(locale),
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
export default async function BlogPage({ params }) {
  const { locale } = await params;
  let posts = [];
  try {
    posts = await fetchPosts(getClient(), 18);
  } catch {
    posts = [];
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Blog
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Les derniers articles publies depuis WordPress.
        </p>
      </header>

      {posts.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const title = stripHtml(post?.title || "Article");
            const excerpt = stripHtml(post?.excerpt || "").slice(0, 180);
            const image = post?.featuredImage?.node;
            const dateText = formatDate(post?.date, locale);
            return (
              <article
                key={post?.id || post?.slug || title}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                {image?.sourceUrl ? (
                  <Link href={blogPostPath(locale, post.slug)} className="block">
                    <img
                      src={image.sourceUrl}
                      alt={image.altText || title}
                      className="h-48 w-full object-cover"
                    />
                  </Link>
                ) : null}
                <div className="space-y-3 p-4">
                  {dateText ? (
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {dateText}
                    </p>
                  ) : null}
                  <h2 className="line-clamp-2 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                    <Link href={blogPostPath(locale, post.slug)}>{title}</Link>
                  </h2>
                  {excerpt ? (
                    <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {excerpt}
                    </p>
                  ) : null}
                  <Link
                    href={blogPostPath(locale, post.slug)}
                    className="inline-flex text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
                  >
                    Lire l&apos;article
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-zinc-300 p-8 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          Aucun article publie pour le moment.
        </section>
      )}
    </div>
  );
}
