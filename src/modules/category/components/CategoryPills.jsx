"use client";

import Link from "next/link";
import { cn } from "@/modules/common/utils/cn";

/**
 * @param {{ categories: object[]; activeSlug?: string | null; basePath: string }} props
 */
export function CategoryPills({ categories, activeSlug, basePath }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Categories">
      <Link
        href={basePath}
        className={cn(
          "rounded-full border px-3 py-1 text-sm",
          !activeSlug
            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
            : "border-zinc-300 dark:border-zinc-600",
        )}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`${basePath}?category=${encodeURIComponent(c.slug)}`}
          className={cn(
            "rounded-full border px-3 py-1 text-sm",
            activeSlug === c.slug
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-300 dark:border-zinc-600",
          )}
        >
          {c.name} {c.count != null ? `(${c.count})` : ""}
        </Link>
      ))}
    </nav>
  );
}
