"use client";

import { useLayoutEffect, useState } from "react";
import { HomeMaisonDesktopSection } from "@/modules/home/components/HomeMaisonDesktopSection";
import { HomeMaisonMobileSection } from "@/modules/home/components/HomeMaisonMobileSection";

export function HomepageHorizontalSection({ locale, brandStorySectionData }) {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (isMobile) return <HomeMaisonMobileSection locale={locale} brandStorySectionData={brandStorySectionData} />;
  return <HomeMaisonDesktopSection locale={locale} brandStorySectionData={brandStorySectionData} />;
}
