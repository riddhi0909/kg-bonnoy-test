"use client";

import Link from "next/link";
import Image from "next/image";

export function RealisationsReadyToShipSection({ imageSrc = "", imageAlt = "", title = "", description = "", buttonTitle = "", buttonLink = "" }) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex h-[600px] items-end bg-cover bg-center bg-no-repeat max-[768px]:h-auto max-[768px]:flex-col max-[768px]:bg-none" style={{ backgroundImage: `url('${imageSrc}')` }}>
          <Image
            width={500}
            height={500}
            src={imageSrc}
            alt={imageAlt}
            className="hidden h-[500px] w-full object-cover max-[768px]:block"
            loading="lazy"
          />

          <div className="ml-auto flex w-full max-w-[444px] flex-col gap-6 bg-[#000d29] p-[60px] max-[768px]:relative max-[768px]:max-w-full max-[768px]:p-[48px_32px_64px] max-[479px]:min-w-0">
            <h3 className="m-0 font-serif text-[38px] font-medium leading-[1.2] tracking-normal text-[#f4efe6] max-[768px]:text-[24px]">
              {title}
            </h3>

            <p className="font-jakarta text-[16px] font-normal leading-[1.5] tracking-normal text-[#f4efe6]">
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
