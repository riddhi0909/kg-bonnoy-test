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
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

export function SingleJournalHeroSection({ locale = "fr", post }) {
  const title = stripHtml(post?.title) || "Journal";
  const author = stripHtml(post?.author?.node?.name) || "Bonnot Paris";
  const dateText = formatDate(post?.date, locale) || "";
  const image = String(post?.featuredImage?.node?.sourceUrl || "").trim();
  const imageAlt = stripHtml(post?.featuredImage?.node?.altText) || title;

  return (
    <section className="relative z-1">
      <div className="px-[40px]">
        <div className="mx-auto w-full max-w-[768px]">
          <div className="relative top-[15px] w-[120px] min-[480px]:top-[19px] min-[992px]:top-[40px] min-[992px]:left-[-14.9vw] min-[480px]:left-0">
            <Link
              href="/journal"
              className="group relative z-0 flex h-10 items-center justify-between gap-2 overflow-hidden rounded-none bg-[#000d29] px-4 text-left [font-family:var(--font-plus-jakarta-sans),sans-serif] text-[14px] font-medium leading-[1.5] tracking-[0] text-[#f4efe6] no-underline transition-all duration-300 [transition-timing-function:cubic-bezier(.4,0,1,1)] hover:bg-[#f63]"
            >
              <span className="inline-flex scale-x-[-1] items-center justify-center" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10" />
                </svg>
              </span>
              <span>Retour</span>
            </Link>
          </div>
          <div className="py-[64px] min-[768px]:py-[96px] min-[992px]:py-[128px]">
            <div className="mx-auto flex max-w-[768px] flex-col items-center justify-start text-center">
              <h1 className="mb-6 [font-family:var(--font-bonnot-serif),serif] text-[32px] font-medium leading-[1.2] tracking-[0px] text-[#f4efe6] min-[768px]:mb-12 min-[768px]:text-[40px]">
                {title}
              </h1>
                <div className="flex flex-col items-center text-center">
                <div className="text-[16px] font-semibold leading-[1.5] tracking-[0] text-[#f4efe6]">
                  {author}
                </div>
                <div className="mt-1 flex items-center justify-start">
                  <div className="text-[14px] font-normal leading-[1.5] tracking-[0] text-[#f4efe6]">
                    {dateText}
                  </div>
                  <div className="mb-[7px] mx-2 leading-[1] text-[#f4efe6]">-</div>
                  <div className="text-[14px] font-normal leading-[1.5] tracking-[0] text-[#f4efe6]">
                    5 min read
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-[-1] bg-[linear-gradient(#00000080,#00000080)]">
        <div className="absolute inset-0 z-[1] block bg-[#000d2980]" />
        {image ? (
          <img
            loading="lazy"
            src={image}
            alt={imageAlt}
            className="absolute inset-0 inline-block h-full w-full max-w-full align-middle object-cover"
          />
        ) : null}
      </div>
    </section>
  );
}

export default SingleJournalHeroSection;
