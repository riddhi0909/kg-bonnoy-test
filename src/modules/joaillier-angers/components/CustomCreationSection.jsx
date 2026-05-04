"use client";

import Link from "next/link";

function decodeAndSanitizeHtml(value) {
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

export function CustomCreationSection({
    title,
    subHeading,
    description,
    buttonTitle,
    buttonLink,
    imageSrc,
    imageAlt,
}) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="grid grid-cols-1 gap-14 [place-items:center_stretch] min-[768px]:grid-cols-2 min-[768px]:gap-[88px]">
        <div className="order-1 flex flex-1 flex-col items-start justify-start min-[768px]:order-1">
          {title && (
            <h2 className="m-0 mb-8 font-serif text-[52px] font-medium leading-[1.2] tracking-normal text-[#001122]">
              {title}
            </h2>
          )}

          {subHeading && (
            <div className="m-0 mb-4 font-jakarta text-[20px] font-medium leading-[1.5] tracking-normal text-[#001122]">
              {subHeading}
            </div>
          )}

          {description && (
            <div
              className="m-0 mb-8 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-medium leading-[1.5] tracking-normal text-[#7e7067] max-[768px]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_li]:last:mb-0"
              dangerouslySetInnerHTML={{ __html: decodeAndSanitizeHtml(description) }}
            />
          )}

          {buttonTitle && buttonLink && (
            <Link
              href={buttonLink}
              className="group flex min-h-10 min-w-[232px] w-max items-center justify-center gap-[15px] bg-[#001122] px-[15px] py-2 border border-[rgba(0,17,34,0.2)] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122]"
            >
              {buttonTitle}
              <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path
                  d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                  stroke="currentColor"
                  strokeOpacity="0.85"
                  strokeMiterlimit="10"
                />
              </svg>
            </Link>
          )}

        </div>

        {imageSrc && (
          <div className="order-1 min-[768px]:order-2">
            <img
              src={imageSrc}
              alt={String(imageAlt ?? "").trim() || "Jewelry"}
              className="h-auto max-h-[600px] w-full place-self-center object-contain"
              loading="lazy"
            />
          </div>
        )}
      </div>

    </div>
  );
}
