"use client";

import Link from "next/link";

export function RealisationsSourcingSection({ imageSrc = "", imageAlt = "", title = "", subHeading = "", description = "", buttonTitle = "", buttonLink = "" }) {    
  
  return (
    <div
      className="flex min-h-screen items-center justify-end bg-cover max-[768px]:items-end max-[768px]:justify-end max-[768px]:overflow-hidden"
      style={{ backgroundImage: `url('${imageSrc}')` }}
    >
      <div className="py-[64px] w-full max-[768px]:pb-0">
        <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px] max-[768px]:pr-0 max-[768px]:pl-[64px]">
          <div className="ml-auto flex h-auto min-w-[428px] w-[25vw] flex-col gap-6 bg-[#000d29] p-[90px_60px] max-[768px]:w-full max-[768px]:min-w-0 max-[768px]:p-[32px_32px_64px] max-[479px]:min-w-auto">
            <h3 className="m-0 font-serif text-[38px] font-medium leading-[1.2] tracking-normal text-[#f4efe6] max-[768px]:text-[28px]">
              {title}
            </h3>

            <p className="font-jakarta text-[20px] font-normal leading-[1.5] tracking-normal text-[#f4efe6] max-[768px]:text-[16px]">
              {subHeading}
            </p>

            <p className="font-jakarta text-[18px] font-normal leading-[1.5] tracking-normal text-[#a4aab6]">
              {description}
            </p>

            <Link
              href={buttonLink}
              className="group flex min-h-10 min-w-[232px] w-max items-center justify-center gap-[15px] bg-[#f63] px-[15px] py-2 border border-[#f63] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-white hover:text-[#f63]"
            >
              {buttonTitle}
              {buttonLink && (
                <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path
                    d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                    stroke="currentColor"
                    strokeOpacity="0.85"
                    strokeMiterlimit="10"
                  />
                </svg>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
