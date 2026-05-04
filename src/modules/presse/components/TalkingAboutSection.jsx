"use client";

function sanitizeText(value) {
  return String(value || "").replace(/<[^>]*>/g, "").trim();
}

function normalizeHref(href) {
  const raw = String(href || "").trim();
  if (!raw) return "#";
  if (raw.startsWith("//")) return `https:${raw}`;
  return raw;
}

function normalizeImageSrc(src) {
  const raw = String(src || "").trim();
  if (!raw) return "";
  if (raw.startsWith("//")) return `https:${raw}`;
  return raw;
}

export function TalkingAboutSection({ title, subHeading, articleList = [] }) {
  const items = Array.isArray(articleList) ? articleList : [];
  if (!title && !subHeading && items.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="mx-auto mb-12 max-w-[848px] text-center min-[768px]:mb-16 min-[1024px]:mb-20">
        {title ? (
          <h2 className="m-0 mb-4 font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#000d29] min-[768px]:text-[52px]">
            {title}
          </h2>
        ) : null}
        {subHeading ? (
          <p className="m-0 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-normal leading-[1.5] tracking-normal text-[#000d29]">
            {sanitizeText(subHeading)}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 min-[768px]:grid-cols-2 min-[768px]:gap-y-16">
        {items.map((item, index) => {
          const href = normalizeHref(item?.articleLink);
          const imageSrc = normalizeImageSrc(item?.articleImage?.node?.sourceUrl);
          const imageAlt = sanitizeText(item?.articleImage?.node?.altText) || "press image";
          const date = sanitizeText(item?.articleDate);
          const articleTitle = sanitizeText(item?.articleTitle);
          const key = `${href}-${index}`;

          return (
            <article key={key} className="overflow-hidden bg-[#faf5ef]">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col text-[#000d29] no-underline"
              >
                <div className="flex aspect-[3/1] w-full items-center justify-center overflow-hidden bg-[#f4efe6]">
                  {imageSrc ? (
                    <img src={imageSrc} alt={imageAlt} className="h-[60%] w-[30%] object-contain" loading="lazy" />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col items-center gap-4 px-5 py-6 text-center min-[768px]:px-6 min-[768px]:py-8">
                  <div className="w-full">
                    {date ? (
                      <span className="mb-5 block [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[12px] font-normal leading-[1.5] tracking-normal text-[#000d29]">
                        {date}
                      </span>
                    ) : null}
                    {articleTitle ? (
                      <p className="m-0 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] font-normal leading-[1.5] tracking-normal text-[#000d29]">
                        {articleTitle}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[14px] font-medium leading-[1.5] text-[#000d29]">
                    <span className="pb-[3px]">Lire l&apos;article</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 21 20"
                      fill="none"
                      className="mt-[2px] h-[22px] w-[22px]"
                      aria-hidden="true"
                    >
                      <path d="M8.33594 15L13.3359 10L8.33594 5" stroke="currentColor" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
