import Link from "next/link";
import { homePath, realisationsPath } from "@/constants/routes";

/**
 * @param {{ locale: string; firstTitle?: string; firstLink?: string; secondTitle?: string; secondLink?: string }} props
 */
export function InvestirBreadcrumbSection({
  locale,
  firstTitle,
  firstLink,
  secondTitle,
  secondLink,
}) {
  const resolvedFirstLink = firstLink || homePath(locale);
  const resolvedSecondLink = secondLink || realisationsPath(locale);
  const showFirst = Boolean(String(firstTitle || "").trim());
  const showSecond = Boolean(String(secondTitle || "").trim());

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <nav>
        <ul className="list-none flex flex-wrap items-center justify-start gap-x-[17px] gap-y-[17px] text-[14px] font-normal text-[#001122]">
          {showFirst && (
            <li className="cursor-pointer text-[#001122] transition-colors duration-200 hover:text-[#FF6633]">
              <Link
                href={resolvedFirstLink}
                title="Home"
                className="font-medium tracking-normal text-[#001122] no-underline transition-colors duration-200 hover:text-[#FF6633]"
              >
                {firstTitle}
              </Link>
            </li>
          )}
          {showFirst && showSecond && (
            <span className="inline-flex items-center justify-center text-[#001122]" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7.5 4L13.5 10L7.5 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          {showSecond && (
            <li className="cursor-pointer text-[#001122] transition-colors duration-200 hover:text-[#FF6633]">
              <Link
                className="font-medium tracking-normal text-[#001122] underline underline-offset-[6px] transition-colors duration-200 hover:text-[#FF6633]"
                href={resolvedSecondLink}
              >
                {secondTitle}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
