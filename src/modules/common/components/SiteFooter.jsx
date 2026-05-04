import Image from "next/image";
import { BonnotFooterCredits } from "@/modules/menu/components/BonnotFooterCredits";
import { BonnotFooterMentions } from "@/modules/menu/components/BonnotFooterMentions";
import { FooterMenu } from "@/modules/menu/components/FooterMenu";

/**
 * @param {{ locale: string; menuItems?: object[] }} props
 */
export function SiteFooter({ locale, menuItems = [] }) {
  return (
    <footer className="mt-0 w-full bg-[#fffaf5]">
      {/* Newsletter — Figma 452:2647 */}
      <div className="border-y border-[rgba(0,17,34,0.2)] bg-[#001122]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col flex-wrap items-stretch gap-[15px] px-4 py-[25px] min-[1440px]:flex-row min-[1440px]:items-center min-[1440px]:px-[60px] justify-between">
          <div className="flex flex-col gap-1">
            <p className="shrink-0 text-sm font-normal leading-[1.428] text-[#ff6633] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">Newsletter</p>
            <p className="min-w-0 flex-1 text-sm font-normal leading-[1.428] text-white [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
              Recevez nos dernières actualités et invitations à des évènements exclusifs.
            </p>
          </div>
          <div className="flex w-full flex-row gap-2 items-center min-[1440px]:w-auto min-[1440px]:shrink-0 justify-between">
            <div className="relative w-full flex items-center justify-center">
            <input
              type="email"
              placeholder="Email"
              className="flex h-10 w-full items-center gap-[15px] border border-[rgba(255,255,255,0.25)] px-[15px] text-left text-sm font-normal leading-[1.428] text-[rgba(255,255,255,1)] min-[1440px]:w-[465px] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
            />
            </div>
            <button
              type="button"
              className="group cursor-pointer inline-flex h-10 shrink-0 items-center justify-center gap-[15px]
                border border-[rgba(255,255,255,0.25)]
                bg-[#ff6633]
                px-[15px]

                text-sm font-semibold leading-[1.428] text-white

                transition-all duration-300

                hover:bg-white
                hover:text-[#001122]
                hover:border-[#001122]

                min-[525px]:w-[210px] w-auto
                [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
              >
              Envoyer
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M0 6.35H12M12 6.35L6 0.35M12 6.35L6 12.35" stroke="currentColor" >
                </path></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu columns — Figma 452:2652 */}
      <div className="border-b border-[rgba(0,17,34,0.2)] bg-[#f5eee5]">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-[30px] min-[1440px]:px-[60px]">
          <FooterMenu
            locale={locale}
            items={menuItems}
            endBadge={ 
                <Image
                  src="/figma/footer-trust-badge.png"
                  alt=""
                  width={210}
                  height={108}
                  sizes="210px"
                  className="min-[768px]h-[108px] min-[768px]:w-[210px] max-w-full min-[768px]:object-cover w-auto h-auto object-contain"
                  loading="lazy"
                />
            }
          />
        </div>
      </div>

      <BonnotFooterMentions locale={locale} />
      <BonnotFooterCredits locale={locale} />
    </footer>
  );
}
