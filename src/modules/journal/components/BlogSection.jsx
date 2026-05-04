"use client";

function sanitizeHtml(value) {
  return String(value || "")
  .replace(/&nbsp;/g, " ")
  .replace(/&rsquo;|&#8217;|&#x2019;/gi, "'")
  .replace(/&lsquo;|&#8216;|&#x2018;/gi, "'")
  .replace(/&quot;|&#34;|&#x22;/gi, "\"")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&amp;/g, "&")
  .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
  .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
  .replace(/\son\w+="[^"]*"/gi, "")
  .replace(/\son\w+='[^']*'/gi, "")
  .trim();
}

export function BlogSection({ prefix,title, subTitle }) {
  const normalizedPrefix = String(prefix ?? "").trim();
  const normalizedTitle = String(title ?? "").trim();
  const normalizedSubTitle = String(subTitle ?? "").trim();

  const displayPrefix =
    normalizedPrefix &&
    normalizedPrefix.toLowerCase() !== normalizedTitle.toLowerCase()
      ? normalizedPrefix
      : "";
  const displaySubTitle =
    normalizedSubTitle &&
    normalizedSubTitle.toLowerCase() !== normalizedTitle.toLowerCase() &&
    normalizedSubTitle.toLowerCase() !== normalizedPrefix.toLowerCase()
      ? normalizedSubTitle
      : "";

  if (!normalizedTitle && !displayPrefix && !displaySubTitle) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="mx-auto w-full max-w-[912px]">
        <div className="flex flex-col text-[#001122] items-center text-center">
          {displayPrefix ? (
            <span className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-medium leading-[1.2] max-[768px]:text-[18px]">
              {displayPrefix}
            </span>
          ) : null}
          {normalizedTitle ? (
            <h2 className="m-0 mb-4 font-serif text-[52px] font-medium leading-[1.2] tracking-normal text-[#001122]">
              {normalizedTitle}
            </h2>
          ) : null}
          {displaySubTitle ? (
            <div
              className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[24px] leading-[1.5] [&_a]:hover:text-[#f63] [&_p]:mb-[24px] [&_p:last-child]:mb-0 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_li]:last:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(displaySubTitle) }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
