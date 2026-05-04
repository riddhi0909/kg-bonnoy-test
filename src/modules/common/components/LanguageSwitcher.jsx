"use client";

import { usePathname, useRouter } from "next/navigation";
import { defaultLocale, localeCodes } from "@/config/i18n";

/**
 * @param {{ current: string }} props
 */
export function LanguageSwitcher({ current }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next) {
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    const parts = pathname.split("/").filter(Boolean);
    const hasLocalePrefix = parts.length && localeCodes.includes(parts[0]);

    if (hasLocalePrefix) {
      if (next === defaultLocale) {
        parts.shift();
      } else {
        parts[0] = next;
      }
    } else {
      if (next !== defaultLocale) {
        parts.unshift(next);
      }
    }
    const nextPath = `/${parts.join("/")}` || "/";
    router.push(nextPath === "//" ? "/" : nextPath);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">Langue</span>
      <select
        value={current}
        onChange={(e) => switchLocale(e.target.value)}
        className="rounded border border-zinc-300 bg-transparent px-2 py-1 dark:border-zinc-600"
      >
        {localeCodes.map((code) => (
          <option key={code} value={code}>
            {code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
