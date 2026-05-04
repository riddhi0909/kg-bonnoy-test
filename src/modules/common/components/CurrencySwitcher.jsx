"use client";

import { supportedCurrencies } from "@/config/currency";
import { useCurrency } from "@/modules/common/providers/currency-context";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="rounded border border-zinc-300 bg-transparent px-2 py-1 dark:border-zinc-600"
      >
        {supportedCurrencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
