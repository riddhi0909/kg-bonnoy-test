"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  BASE_CURRENCY,
  staticRatesFromBase,
  supportedCurrencies,
} from "@/config/currency";
import { formatMoney } from "@/modules/common/utils/format-money";

/** @type {import('react').Context<null | { currency: string; setCurrency: (c: string) => void; convertFromBase: (n: number) => number; format: (n: number, locale?: string) => string; baseCurrency: string }>} */
const CurrencyContext = createContext(null);

/**
 * @param {{ children: import('react').ReactNode; initialCurrency?: string }} props
 */
export function CurrencyProvider({ children, initialCurrency = BASE_CURRENCY }) {
  const [currency, setCurrencyState] = useState(initialCurrency);

  const setCurrency = useCallback((code) => {
    if (supportedCurrencies.includes(code)) setCurrencyState(code);
  }, []);

  const convertFromBase = useCallback(
    (amountInBase) => {
      const rTarget = staticRatesFromBase[currency] ?? 1;
      const rBase = staticRatesFromBase[BASE_CURRENCY] ?? 1;
      return (amountInBase * rTarget) / rBase;
    },
    [currency],
  );

  const format = useCallback(
    (amountInBase, locale = "en-US") => {
      return formatMoney(convertFromBase(amountInBase), currency, locale);
    },
    [convertFromBase, currency],
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      convertFromBase,
      format,
      baseCurrency: BASE_CURRENCY,
    }),
    [currency, setCurrency, convertFromBase, format],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const v = useContext(CurrencyContext);
  if (!v) throw new Error("useCurrency must be used within CurrencyProvider");
  return v;
}
