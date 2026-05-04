"use client";

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
    description,
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

          {description && (
            <div
              className="m-0 mb-8 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[20px] font-medium leading-[1.5] tracking-normal text-[#001122] max-[768px]:mb-0"
              dangerouslySetInnerHTML={{ __html: decodeAndSanitizeHtml(description) }}
            />
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
