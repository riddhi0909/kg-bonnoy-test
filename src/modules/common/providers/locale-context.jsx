"use client";

import { createContext, useContext } from "react";

/** @type {import('react').Context<{ locale: string; wpLocale: string } | null>} */
const LocaleContext = createContext(null);

/**
 * @param {{ locale: string; wpLocale: string; children: import('react').ReactNode }} props
 */
export function LocaleProvider({ locale, wpLocale, children }) {
  return (
    <LocaleContext.Provider value={{ locale, wpLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** @returns {{ locale: string; wpLocale: string }} */
export function useLocaleContext() {
  const v = useContext(LocaleContext);
  if (!v) throw new Error("useLocaleContext must be used within LocaleProvider");
  return v;
}
