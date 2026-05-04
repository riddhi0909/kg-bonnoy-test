"use client";

import Link from "next/link";

function sanitizeHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .trim();
}

export function PageHeroSection({ title, backUrl }) {

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      {
        backUrl && (
          <Link href={backUrl.url} target={backUrl.target} className="flex w-[fit-content] h-10 items-center justify-center gap-[15px] bg-[#001122] px-[15px] border border-[rgba(0,17,34,0.2)] text-sm font-semibold leading-[1.428] text-white transition-all duration-300 hover:bg-[#00112298] hover:text-white">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5">
                            <path d="M0 6.35H12M12 6.35L6 0.35M12 6.35L6 12.35" stroke="currentColor"></path>
                        </svg>   
            {backUrl.title}
          </Link>
        )
      }
      <div className="pt-[80px] pb-[65px] w-full">
        <div className="flex flex-col gap-6 text-[#f4efe6]">
          {title ? (
            <h2 className="font-serif text-[38px] text-center font-medium leading-[1.2] max-[768px]:text-[36px]">
              {title}
            </h2>
          ) : null}
        </div>
      </div>
    </div>
  );
}
