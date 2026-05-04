"use client";

import Link from "next/link";
import { resolveMenuLink } from "@/modules/menu/utils/menu-link";
import {
  cartPath,
  loginPath,
  productsPath,
} from "@/constants/routes";

/**
 * @param {{ locale: string; items: object[] }} props
 */
export function MenuNavClient({ locale, items }) {
  if (!items?.length) {
    return (
      <nav className="flex flex-wrap gap-4 text-sm font-medium" aria-label="Main">
        <Link href={productsPath(locale)} className="hover:underline">
          Produits
        </Link>
        <Link href={cartPath(locale)} className="hover:underline">
          Panier
        </Link>
        <Link href={loginPath(locale)} className="hover:underline">
          Connexion
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex flex-wrap gap-4 text-sm font-medium" aria-label="Main">
      {items.map((item) => (
        <MenuNavItem key={item.id} locale={locale} item={item} />
      ))}
    </nav>
  );
}

/**
 * @param {{ locale: string; item: object }} props
 */
function MenuNavItem({ locale, item }) {
  const { href, external } = resolveMenuLink(locale, item.url, item.path);
  const target = item.target === "_blank" && external ? "_blank" : undefined;
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;
  const children = item.childItems?.nodes?.length ? (
    <span className="group relative inline-block">
      {external ? (
        <a
          href={href}
          target={target}
          rel={rel}
          className="hover:underline"
        >
          {item.label}
        </a>
      ) : (
        <Link href={href} className="hover:underline">
          {item.label}
        </Link>
      )}
      <ul className="absolute left-0 top-full z-20 mt-1 hidden min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg group-hover:block dark:border-zinc-700 dark:bg-zinc-900">
        {item.childItems.nodes.map((c) => (
          <li key={c.id}>
            <ChildLink locale={locale} item={c} />
          </li>
        ))}
      </ul>
    </span>
  ) : external ? (
    <a href={href} target={target} rel={rel} className="hover:underline">
      {item.label}
    </a>
  ) : (
    <Link href={href} className="hover:underline">
      {item.label}
    </Link>
  );

  return <span className="inline-flex items-center">{children}</span>;
}

/**
 * @param {{ locale: string; item: object }} props
 */
function ChildLink({ locale, item }) {
  const { href, external } = resolveMenuLink(locale, item.url, item.path);
  const target = item.target === "_blank" && external ? "_blank" : undefined;
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;
  if (external) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className="block px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {item.label}
    </Link>
  );
}
