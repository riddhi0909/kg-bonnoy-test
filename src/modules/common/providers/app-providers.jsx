"use client";

import { ApolloProvider } from "@/apollo/apollo-provider";
import { CurrencyProvider } from "@/modules/common/providers/currency-context";
import { LocaleProvider } from "@/modules/common/providers/locale-context";
import { AppointmentModalProvider } from "@/modules/menu/providers/appointment-modal-context";

/**
 * @param {{ locale: string; wpLocale: string; children: import('react').ReactNode }} props
 */
export function AppProviders({ locale, wpLocale, children }) {
  return (
    <LocaleProvider locale={locale} wpLocale={wpLocale}>
      <CurrencyProvider>
        <ApolloProvider>
          <AppointmentModalProvider locale={locale}>{children}</AppointmentModalProvider>
        </ApolloProvider>
      </CurrencyProvider>
    </LocaleProvider>
  );
}
