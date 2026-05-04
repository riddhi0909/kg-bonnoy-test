"use client";

function sanitizeHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .trim();
}

export function RichTextSection({ title, description, image, imageAlt }) {
  if (!title && !description) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-[20px] min-[1440px]:px-[60px]">
      <div className="mx-auto w-full max-w-[912px]">
        <div className="flex flex-col gap-6 text-[#001122]">
          {title ? (
            <h2 className="font-serif text-[38px] font-medium leading-[1.2] max-[768px]:text-[36px]">
              {title}
            </h2>
          ) : null}
          {description ? (
            <div
              className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] leading-[1.5] [&_a]:hover:text-[#f63] [&_p]:mb-[24px] [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          ) : null}
          {image ? (
            <figure className="relative mx-auto mb-0 clear-both max-w-[60%]">
              <img
                loading="lazy"
                src={image}
                alt={String(imageAlt ?? "").trim() || "Jewelry"}
                className="inline-block w-full max-w-full"
              />
            </figure>
          ) : null}
        </div>
      </div>
    </div>
  );
}
