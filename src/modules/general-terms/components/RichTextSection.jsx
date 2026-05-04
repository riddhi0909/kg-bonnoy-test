"use client";

function sanitizeHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .trim();
}

export function RichTextSection({ title, description }) {
  if (!title && !description) return null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="mx-auto w-full max-w-[912px]">
        <div className="flex flex-col gap-6 text-[#001122]">
          {title ? (
            <h2 className="font-serif text-[38px] font-medium leading-[1.2] max-[768px]:text-[36px]">
              {title}
            </h2>
          ) : null}
          {description ? (
            <div
              className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] leading-[1.5] [&_a]:hover:text-[#f63] [&_p]:mb-[24px]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
