import { getClient } from "@/apollo/register-client";
import { SiteHeader } from "@/modules/common/components/SiteHeader";
import { SiteFooter } from "@/modules/common/components/SiteFooter";
import {
  fetchHeaderAnnouncement,
  fetchFooterMenu,
  fetchHeaderMenu,
} from "@/modules/menu/services/menu-service";

/** @param {{ locale: string }} props */
export async function LocaleHeaderMenus({ locale }) {
  const client = getClient();
  const [menuItems, announcement] = await Promise.all([
    fetchHeaderMenu(client).catch(() => []),
    fetchHeaderAnnouncement(client).catch(() => null),
  ]);
  return (
    <SiteHeader
      locale={locale}
      menuItems={menuItems}
      announcement={announcement}
    />
  );
}

/** @param {{ locale: string }} props */
export async function LocaleFooterMenus({ locale }) {
  const client = getClient();
  let footerMenuItems = [];
  try {
    footerMenuItems = await fetchFooterMenu(client);
  } catch {
    footerMenuItems = [];
  }
  return <SiteFooter locale={locale} menuItems={footerMenuItems} />;
}

export function LocaleHeaderMenusFallback() {
  return (
    <header
      className="sticky top-0 z-50 h-[90px] w-full animate-pulse border-b border-[rgba(0,17,34,0.2)] bg-[#fffaf5] motion-reduce:animate-none"
      aria-hidden
    />
  );
}

export function LocaleFooterMenusFallback() {
  return (
    <div
      className="mt-0 min-h-[200px] w-full animate-pulse bg-[#fffaf5] motion-reduce:animate-none"
      aria-hidden
    />
  );
}
