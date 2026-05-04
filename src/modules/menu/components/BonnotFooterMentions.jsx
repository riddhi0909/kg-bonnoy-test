"use client";

import Image from "next/image";
import Link from "next/link";
import { homePath, localizedPath } from "@/constants/routes";
import { LocaleCurrencyCompact } from "@/modules/common/components/LocaleCurrencyCompact";

function FooterSocialLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-3 items-center gap-[15px] text-sm font-semibold leading-[1.428] text-[#001122] hover:text-[#ff6633]"
    >
      {label}
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"></path></svg>
    </a>
  );
}

/**
 * Figma Footer / Mentions row: logo, socials (center), devise + legal links.
 * @param {{ locale: string }} props
 */
export function BonnotFooterMentions({ locale }) {
  
  const ig = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL;
  const yt = process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL;
  const li = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL;

  const cgv = process.env.NEXT_PUBLIC_CGV_PATH;
  const legal = process.env.NEXT_PUBLIC_LEGAL_PATH;
  
  return (
    <div className="border-b border-[rgba(0,17,34,0.2)] bg-[#f5eee5]">
      <div className="mx-auto flex h-auto min-h-[90px] w-full max-w-[1440px] flex-col items-stretch gap-6 px-4 py-6 min-[1440px]:h-[90px] min-[1440px]:flex-row min-[1440px]:items-center min-[1440px]:gap-[30px] min-[1440px]:px-[60px] min-[1440px]:py-0">
        <Link
          href={homePath(locale)}
          className="flex shrink-0 items-center gap-[10px] no-underline min-[1440px]:flex-1"
        >
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[25px]">
            <Image
              src="/figma/monogram.png"
              alt="Bonnot Paris"
              width={40}
              height={40}
              sizes="40px"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-[8px] leading-none">
            <p className="font-serif text-[28px] font-normal leading-[1.25] text-[#001122]">BONNOT</p>
            <p className="text-[11px] uppercase leading-[1.36] tracking-[0.1em] text-[#001122]">Paris</p>
          </div>
        </Link>

        <div className="flex sm:flex-wrap items-center justify-center gap-x-[15px] min-[768px]:gap-x-[30px] gap-y-3 min-[1440px]:flex-1 min-[1440px]:justify-center">
          <FooterSocialLink href={ig} label="Instagram" />
          <FooterSocialLink href={yt} label="Youtube" />
          <FooterSocialLink href={li} label="Linkedin" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-[30px] gap-y-2 min-[1440px]:flex-1 min-[1440px]:justify-end">
          <LocaleCurrencyCompact current={locale} />
          <Link
            href={localizedPath(locale, cgv.startsWith("/") ? cgv : `/${cgv}`)}
            className="text-sm font-normal leading-[1.428] text-[rgba(0,17,34,0.5)] hover:text-[#001122]"
          >
            CGV
          </Link>
          <Link
            href={localizedPath(locale, legal.startsWith("/") ? legal : `/${legal}`)}
            className="text-sm font-normal leading-[1.428] text-[rgba(0,17,34,0.5)] hover:text-[#001122]"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </div>
  );
}
