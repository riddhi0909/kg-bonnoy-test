"use client";

import Link from "next/link";

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value, locale = "fr") {
  void locale;
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function buildPageHref(basePath, page) {
  if (page <= 1) return basePath;
  return `${basePath}?page=${page}`;
}

export function JournalArticlesSection({
  posts,
  locale,
  basePath,
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
}) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-[128px] min-[1440px]:px-[60px]">
      <div className="mx-auto w-full max-w-[1040px]">
        <div className="grid grid-cols-1 gap-x-6 gap-y-16 min-[768px]:grid-cols-2">
          {posts.map((post) => {
            const title = stripHtml(post?.title);
            const excerpt = stripHtml(post?.excerpt);
            const href = `/journal/${String(post?.slug || "").replace(/^\/+|\/+$/g, "")}`;
            const image = post?.featuredImage?.node?.sourceUrl || "";
            const imageAlt = post?.featuredImage?.node?.altText || title;
            const author = post?.author?.node?.name || "Bonnot Paris";

            return (
              <article key={post?.id || href} className="overflow-hidden">
                <Link href={href} className="group block">
                  <div className="h-[300px] w-full overflow-hidden bg-[#f0e8de]">
                    {image ? (
                      <img
                        src={image}
                        alt={imageAlt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="flex h-[236px] flex-col justify-between bg-[#faf5ef] px-[24px] pt-[24px] pb-[24px] transition-colors duration-200 group-hover:text-[#ee4308]">
                    <div>
                      <h3
                        className="mb-3 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[20px] font-semibold leading-[1.5] text-[#000d29] transition-colors duration-200 group-hover:text-[#ee4308]"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {title}
                      </h3>
                      {excerpt ? (
                        <p
                          className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] leading-[1.5] text-[#000d29] transition-colors duration-200 group-hover:text-[#ee4308]"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {excerpt}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-2 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[14px] leading-[1.5] text-[#000d29] transition-colors duration-200 group-hover:text-[#ee4308]">
                      <span className="font-semibold capitalize transition-colors duration-200 group-hover:text-[#ee4308]">{author}</span>
                      <span aria-hidden="true" className="transition-colors duration-200 group-hover:text-[#ee4308]">•</span>
                      <span className="transition-colors duration-200 group-hover:text-[#ee4308]">{formatDate(post?.date, locale)}</span>
                      {/* <span aria-hidden="true" className="transition-colors duration-200 group-hover:text-[#ee4308]">•</span>
                      <span className="transition-colors duration-200 group-hover:text-[#ee4308]">5 Min Read</span> */}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between" data-page={page}>
          <nav className="pagination" role="navigation" aria-label="Pagination">
            <ul className="list-unstyled flex items-center gap-4" role="list">
              {hasPrevPage ? (
                <li className="m-0 h-auto w-auto max-w-fit flex-auto">
                  <Link
                    href={buildPageHref(basePath, page - 1)}
                    className="group pagination__item inline-flex h-8 min-h-0 w-8 items-center justify-center border border-transparent bg-[#fd641b] text-white transition-all duration-300 hover:border-[#00112233] hover:bg-transparent hover:text-[#001122]"
                    aria-label="Page précédente"
                  >
  
                    <svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5">
                      <path d="M0 6.35H12M12 6.35L6 0.35M12 6.35L6 12.35" stroke="currentColor"></path>
                    </svg>
                  </Link>
                </li>
              ) : null}
              {hasNextPage ? (
                <li className="m-0 h-auto w-auto max-w-fit flex-auto">
                  <Link
                    href={buildPageHref(basePath, page + 1)}
                    className="group pagination__item inline-flex h-8 min-h-0 w-8 items-center justify-center border border-transparent bg-[#fd641b] text-white transition-all duration-300 hover:border-[#00112233] hover:bg-transparent hover:text-[#001122]"
                    aria-label="Page suivante"
                  >
                    <svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                      <path d="M0 6.35H12M12 6.35L6 0.35M12 6.35L6 12.35" stroke="currentColor"></path>
                    </svg>
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
          <div className="flex items-end gap-[3px] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif]">
            <span className="text-[20px] font-normal leading-[1.5] text-[#fd641b]">{page}</span>
            <span className="text-[16px] font-normal leading-[1.5] text-[#000d29]">/</span>
            <span className="text-[16px] font-normal leading-[1.5] text-[#000d29]">
              {Math.max(1, totalPages || 1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
