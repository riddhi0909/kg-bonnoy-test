"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { productsPath } from "@/constants/routes";

/**
 * @param {{ locale: string }} props
 */
export function SearchBar({ locale }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const term = q.trim();
      if (!term) return;
      router.push(`${productsPath(locale)}?q=${encodeURIComponent(term)}`);
    },
    [q, router, locale],
  );

  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-1 gap-2">
      <input
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products…"
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
        autoComplete="off"
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Search
      </button>
    </form>
  );
}
