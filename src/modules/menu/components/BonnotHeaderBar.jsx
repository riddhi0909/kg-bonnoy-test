"use client";

import Image from "next/image";
import Link from "next/link";
import { homePath, localizedPath } from "@/constants/routes";
import { LocaleCurrencyCompact } from "@/modules/common/components/LocaleCurrencyCompact";
import { CartDrawer } from "@/modules/cart/components/CartDrawer";
import { useCart } from "@/modules/cart/hooks/useCart";
import { BonnotMegaNav } from "@/modules/menu/components/BonnotMegaNav";
import { MenuNavClient } from "@/modules/menu/components/MenuNavClient";
import { resolveMenuLink } from "@/modules/menu/utils/menu-link";
import { menuItemHasClass } from "@/modules/menu/utils/menu-classes";

/**
 * @param {object[]} items
 * @param {string} locale
 */
function contactHrefFromMenu(items, locale) {
  for (const it of items) {
    if (
      menuItemHasClass(it, "is-contact") ||
      menuItemHasClass(it, "contact-cta")
    ) {
      return resolveMenuLink(locale, it.url, it.path);
    }
  }
  const p = process.env.NEXT_PUBLIC_CONTACT_PATH;
  if (p) {
    return {
      href: localizedPath(locale, p.startsWith("/") ? p : `/${p}`),
      external: false,
    };
  }
  return { href: homePath(locale), external: false };
}

/**
 * @param {{ locale: string; menuItems: object[]; announcement: string | null }} props
 */
export function BonnotHeaderBar({ locale, menuItems, announcement: _announcement }) {
  const contact = contactHrefFromMenu(menuItems || [], locale);
  const { lines, drawerOpen, openDrawer, closeDrawer } = useCart();
  const lineCount = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <>
      <header
        className="sticky top-0 z-[120] overflow-visible border-b border-[rgba(0,17,34,0.2)] bg-[#fffaf5]"
        suppressHydrationWarning
      >
        <div className="mx-auto flex h-[90px] w-full max-w-[1440px] items-center gap-4 overflow-visible px-4 min-[1440px]:gap-[30px] min-[1440px]:px-[60px]">
          <Link
            href={homePath(locale)}
            className="flex h-10 w-[240px] shrink-0 items-center gap-[10px] no-underline max-[1439px]:w-auto"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[25px]">
              <Image
                src="/figma/monogram.png"
                alt="Bonnot"
                width={40}
                height={40}
                sizes="40px"
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="min-w-0 flex-col justify-center gap-[6px] leading-none min-[768px]:flex">
              <p className="font-serif text-[18px] md:text-[28px] font-normal leading-[1.25] text-[#001122]">BONNOT</p>
              <p className="md:text-[10px] text-[11px] uppercase leading-[1.36] tracking-[0.1em] text-[#001122]">Paris</p>
            </div>
          </Link>

          {menuItems?.length ? (
            <BonnotMegaNav locale={locale} items={menuItems} />
          ) : (
            <div className="flex min-w-0 flex-1 justify-center order-2 lg:order-1">
              <MenuNavClient locale={locale} items={[]} />
            </div>
          )}

          <div className="ml-auto flex w-fix max-w-[360px] shrink-0 flex-wrap items-center justify-end gap-[10px] max-[767px]:max-w-none  order-1 lg:order-2">
            <div className="min-w-0 hidden lg:flex flex-1 justify-end pr-0">
              <LocaleCurrencyCompact current={locale} />
            </div>

            <button
              type="button"
              onClick={openDrawer}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center text-[#001122] transition hover:opacity-70 cursor-pointer"
              aria-label="Panier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
                <path d="M10 0.25C12.6244 0.25 14.75 2.37557 14.75 5V5.25H17.5C18.7369 5.25 19.75 6.26307 19.75 7.5V21.5C19.75 22.7369 18.7369 23.75 17.5 23.75H2.5C1.26307 23.75 0.25 22.7369 0.25 21.5V7.5C0.25 6.26307 1.26307 5.25 2.5 5.25H5.25V5C5.25 2.37557 7.37557 0.25 10 0.25ZM2.25 21.75H17.75V7.25H14.75V9.75H12.75V7.25H7.25V9.75H5.25V7.25H2.25V21.75ZM10 2.25C8.48693 2.25 7.25 3.48693 7.25 5V5.25H12.75V5C12.75 3.48693 11.5131 2.25 10 2.25Z" fill="#001122" stroke="white" strokeWidth="0.5"/>
              </svg>
              {lineCount > 0 ? (
                <span className="absolute ml-5 -mt-5 rounded-full bg-[#001122] px-1.5 text-[10px] text-white">
                  {lineCount}
                </span>
              ) : null}
            </button>

          {contact.external ? (
              <a
                href={contact.href}
                className="inline-flex h-10 w-[240px] max-w-full shrink-0 items-center justify-center gap-[15px] border border-[rgba(0,17,34,0.2)] bg-[#001122] px-[15px] text-sm font-semibold leading-[1.428] text-white transition hover:bg-[#0a2038]"
              >
                Créer avec Bonnot AI
                <span className="text-base leading-none" aria-hidden>
                  ✦
                </span>
              </a>
            ) : (
              <Link
              href="#"
              className="group inline-flex h-10 w-[40px] lg:w-[240px] max-w-full shrink-0 items-center justify-center gap-[0px] lg:gap-[15px] border border-[#00112233] px-1.5 lg:px-[15px] text-sm font-semibold leading-[1.428] text-white bg-[#001122] hover:text-[#001122] hover:bg-transparent transition-all duration-300"
              >
              {/* <Link
              href={contact.href}
              className="inline-flex h-10 w-[40px] lg:w-[240px] max-w-full shrink-0 items-center justify-center gap-[0px] lg:gap-[15px] border border-[#00112233] px-1.5 lg:px-[15px] text-sm font-semibold leading-[1.428] text-white bg-[#001122] hover:text-[#001122] hover:bg-transparent transition-all duration-300"
              > */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" className="transition-transform duration-300 group-hover:rotate-12" >
              <path d="M18.03 2.51C16.36 1.12 14.29 0.21 12 0V2.01C13.73 2.2 15.31 2.89 16.61 3.93L18.03 2.51Z" fill="currentColor"/>
              <path d="M10.0007 2.01V0C7.7107 0.2 5.6407 1.12 3.9707 2.51L5.3907 3.93C6.6907 2.89 8.2707 2.2 10.0007 2.01Z" fill="currentColor"/>
              <path d="M3.98078 5.34L2.56078 3.92C1.17078 5.59 0.260781 7.66 0.0507812 9.95H2.06078C2.25078 8.22 2.94078 6.64 3.98078 5.34Z" fill="currentColor"/>
              <path d="M19.9395 9.95H21.9495C21.7395 7.66 20.8295 5.59 19.4395 3.92L18.0195 5.34C19.0595 6.64 19.7495 8.22 19.9395 9.95Z" fill="currentColor"/>
              <path d="M6 10.95L9.44 12.51L11 15.95L12.56 12.51L16 10.95L12.56 9.39L11 5.95L9.44 9.39L6 10.95Z" fill="currentColor"/>
              <path d="M11 19.95C7.89 19.95 5.15 18.36 3.54 15.95H6V13.95H0V19.95H2V17.25C3.99 20.09 7.27 21.95 11 21.95C15.87 21.95 20 18.78 21.44 14.39L19.48 13.94C18.25 17.43 14.92 19.95 11 19.95Z" fill="currentColor"/>
              </svg>
              <span className=" hidden lg:inline-flex ">Créer avec Bonnot AI</span>
            </Link>


            )}
          </div>
        </div>
      </header>
      <CartDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        locale={locale}
      />
    </>
  );
}
