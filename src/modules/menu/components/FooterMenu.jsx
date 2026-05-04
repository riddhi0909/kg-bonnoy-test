import Link from "next/link";
import { resolveMenuLink } from "@/modules/menu/utils/menu-link";

/**
 * @param {{ locale: string; items: object[]; endBadge?: import('react').ReactNode }} props
 */
export function FooterMenu({ locale, items, endBadge = null }) {
  if (!items?.length) return null;

  return (
    <nav
      aria-label="Footer"
      className="grid grid-cols-2 sm:gap-[30px] gap-[15px] sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div
            key={item.id}
            className={
              isLast && endBadge 
                ? "flex flex-col gap-[60px] max-lg:gap-[30px]"
                : "flex flex-col gap-[15px]"
            }
          >
            <div className="flex flex-col gap-[15px]">
              <FooterColumn locale={locale} item={item} />
            </div>
            {isLast && endBadge ? (
              <div className="">{endBadge}</div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * @param {{ locale: string; item: object }} props
 */
function FooterColumn({ locale, item }) {
  const { href, external } = resolveMenuLink(locale, item.url, item.path);
  // console.log("footer href = ", external);
  const children = item.childItems?.nodes ?? [];

  return (
    <>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold leading-[1.428] text-[#001122]"
        >
          {item.label}
        </a>
      ) : (
        <Link href={href} className="text-sm font-semibold leading-[1.428] text-[#001122]">
          {item.label}
        </Link>
      )}
      {children.length ? (
        <ul className="flex flex-col gap-0">
          {children.map((child) => (
            <li key={child.id}>
              <FooterChild locale={locale} item={child} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

/**
 * @param {{ locale: string; item: object }} props
 */
function FooterChild({ locale, item }) {
  const { href, external } = resolveMenuLink(locale, item.url, item.path);
  // console.log("item = ", item);
  const cls =
    "inline-block py-[3px] text-sm font-normal leading-[1.428] text-[rgba(0,17,34,0.75)] transition hover:text-[#f63312]";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {item.label}
    </Link>
  );
}
