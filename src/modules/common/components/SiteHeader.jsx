"use client";

import { BonnotHeaderBar } from "@/modules/menu/components/BonnotHeaderBar";

/**
 * @param {{ locale: string; menuItems?: object[]; announcement?: string | null }} props
 */
export function SiteHeader({ locale, menuItems = [], announcement = null }) {
  return (
    <BonnotHeaderBar
      locale={locale}
      menuItems={menuItems}
      announcement={announcement}
    />
  );
}
