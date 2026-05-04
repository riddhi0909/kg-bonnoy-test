"use client";

import Image from "next/image";
import Link from "next/link";
import { LocaleCurrencyCompact } from "@/modules/common/components/LocaleCurrencyCompact";
import { useEffect, useMemo, useState } from "react";
import { resolveMenuLink } from "@/modules/menu/utils/menu-link";
import { menuItemHasClass } from "@/modules/menu/utils/menu-classes";

const GLOBAL_FALLBACK_IMG =
  "/hp/Pierres_precieuses.jpg";

function menuItemImageUrl(menuItem) {
  const co = menuItem?.connectedObject;
  if (!co) return null;

  // ProductCategory
  const category = co?.image?.sourceUrl;
  if (category) return category;

  // MediaItem
  const media = co?.sourceUrl;
  if (media) return media;

  // Page/Post featured image
  const featured = co?.featuredImage?.node?.sourceUrl;
  if (featured) return featured;

  return null;
}

function firstChildImageUrl(children) {
  if (!Array.isArray(children) || children.length === 0) return null;
  for (const child of children) {
    const url = menuItemImageUrl(child);
    if (url) return url;
  }
  return null;
}

function BurgerIcon({ className }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDown({ className }) {
  return (
    <svg
      className={className}
      width="8"
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      aria-hidden
    >
      <path
        d="M0.5 0.5L4 3L7.5 0.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * @param {{ locale: string; item: object }} props
 */
function MegaLink({ locale, item, onHover, fallbackImg, onNavigate }) {
  const { href, external } = resolveMenuLink(locale, item.url, item.path);

  // console.log("mega href = ", external);

  // console.log("item = ", item);

  const imageUrl = menuItemImageUrl(item);

  const handleHover = () => {
    onHover?.(imageUrl || fallbackImg);
  };

  const handleLeave = () => {
    if (fallbackImg) onHover?.(fallbackImg);
  };
  const cls =
    "block break-inside-avoid py-1.5 text-sm font-normal leading-[1.428] text-[rgba(0,17,34,0.75)] transition hover:text-[#001122]";
  if (external) {
    return (
      <a
        href={href}
        target={item.target === "_blank" ? "_blank" : undefined}
        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
        className={cls}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link
      // href={href}
      href={href}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onClick={onNavigate}
      className={cls}
    >
      {/* {JSON.stringify(item)} */}
      {item.label}
      </Link>
  );
}

/**
 * @param {{ locale: string; item: object }} props
 */
function NavRowItem({ locale, item }) {
  const kids = item.childItems?.nodes ?? [];
  const hasMega = kids.length > 0;
  const accent = menuItemHasClass(item, "menu-accent");
  const { href, external } = resolveMenuLink(locale, item.url, item.path);
  // const img = hasMega ? megaMenuImageFromItem(item) : null;
  // const img = "https://bonotnew.getkgkrunch.com/wp-content/uploads/2026/04/625d47a85e56d0d197dbd8ed0045f7ca3f251df0.png";
  // const [hoverImg, setHoverImg] = useState(img?.src || null);
  
  // If category image is null, use the first available mega-menu child image.
  const fallbackFromChild = firstChildImageUrl(kids);
  const categoryImg = menuItemImageUrl(item);

    // const FALLBACK_IMG1 = item.childItems?.nodes?.[1]?.connectedObject?.image?.sourceUrl || "";
  // final image priority:
  // 1) category image
  // 2) first child item image
  // 3) global hardcoded fallback
  const FALLBACK_IMG = fallbackFromChild || GLOBAL_FALLBACK_IMG;
  // final image
  const finalImg = categoryImg || FALLBACK_IMG;
  const defaultImg = finalImg;
  // state
  const [hoverImg, setHoverImg] = useState(finalImg); 
  const [lockClosed, setLockClosed] = useState(false);
  
  useEffect(() => {
    setHoverImg(finalImg);
  }, [finalImg]); 

  const labelCls = [
    "flex items-center gap-[5px] whitespace-nowrap px-0 py-8 max-[1200px]:py-2 text-sm font-normal leading-[1.428] transition-colors hover:opacity-80",
    accent ? "text-[#a67c52]" : "text-[#001122]",
  ].join(" ");

  if (!hasMega) {
    if (external) {
      return (
        <a
          href={href}
          className={labelCls}
          target={item.target === "_blank" ? "_blank" : undefined}
          rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link href={href} className={labelCls}>
        {item.label}
      </Link>
    );
  }
  return (
    <div
      className="group/mega px-[7px]"
      onMouseLeave={() => setLockClosed(false)}
    >
      <button
        type="button"
        className={`${labelCls} cursor-default border-0 bg-transparent font-[inherit]`}
        aria-expanded={false}
        aria-haspopup="true"
        data-image={item?.connectedObject?.image?.sourceUrl || ""}
      >
        {item.label}
        <ChevronDown className="shrink-0 text-[#001122]" />
      </button>
      <div
        className={[
          "pointer-events-none invisible absolute left-0 right-0 top-full z-50 mx-auto w-[min(1360px,calc(100vw-1.5rem))] opacity-0 transition duration-200 ease-out",
          lockClosed
            ? ""
            : "group-hover/mega:pointer-events-auto group-hover/mega:visible group-hover/mega:opacity-100",
        ].join(" ")}
        role="region"
        aria-label={item.label}
        onMouseLeave={() => setHoverImg(defaultImg)}
      >
        <div className="max-h-[min(28rem,78vh)] overflow-auto border border-[#0011221f] bg-[#fffaf5] px-6 py-7 shadow-[0_8px_30px_rgb(0,0,0,0.08)] md:px-9 md:py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[374px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[374px_minmax(0,1fr)] lg:gap-14">
            <div className="flex justify-center md:justify-start">
              <div className="relative w-full max-w-[374px]">
                <div className="relative w-full overflow-hidden" style={{ width: "374px", height: "272px" }}>
                  <div className="bg-[#fffaf5] absolute z-50 top-0 right-0" style={{ width: "70px", height: "70px" }}></div>
                  <Image
                    src={hoverImg || FALLBACK_IMG}
                    alt={item.label}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 374px"
                  />
                  <div className="bg-[#fffaf5] absolute z-50 bottom-0 left-0" style={{ width: "70px", height: "70px" }}></div>
                </div>
              </div>
            </div>
           
            <div className="min-w-0 pt-1">
              <p className="font-serif text-[1.75rem] font-medium leading-tight tracking-tight text-zinc-900 md:text-[2rem]">
                {item.label}
              </p>
              <div className="mt-6 columns-1 gap-x-14 gap-y-0.5 sm:columns-2">
                {kids.map((c) => (
                  <MegaLink
                    key={c.id}
                    locale={locale}
                    item={c}
                    onHover={setHoverImg}
                    fallbackImg={defaultImg}
                    onNavigate={() => setLockClosed(true)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{ locale: string; item: object; open: boolean; onToggle: () => void; onNavigate: () => void }} props
 */
function MobileNavItem({ locale, item, open, onToggle, onNavigate }) {
  const kids = item.childItems?.nodes ?? [];
  const hasKids = kids.length > 0;
  const accent = menuItemHasClass(item, "menu-accent");
  const { href, external } = resolveMenuLink(locale, item.url, item.path);

  const fallbackImg = firstChildImageUrl(kids) || GLOBAL_FALLBACK_IMG;

  const labelCls = [
    "flex w-full items-center justify-between gap-3 py-3 text-left text-[15px] font-normal leading-[1.35] tracking-[0.01em]",
    accent ? "text-[#a67c52]" : "text-[#001122]",
  ].join(" ");

  if (!hasKids) {
    if (external) {
      return (
        <a
          href={href}
          className={labelCls}
          onClick={onNavigate}
          target={item.target === "_blank" ? "_blank" : undefined}
          rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
        >
          <span>{item.label}</span>
        </a>
      );
    }
    return (
      <Link href={href} className={labelCls} onClick={onNavigate}>
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <div className="border-b border-[#0011221a]">
      <button
        type="button"
        className={labelCls}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{item.label}</span>
        <ChevronDown
          className={[
            "shrink-0 text-[#001122] transition-transform",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>
      {open ? (
        <div className="pb-3 pl-3">
          {kids.map((c) => (
            <MegaLink key={c.id} locale={locale} item={c} fallbackImg={fallbackImg} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * @param {{ locale: string; items: object[] }} props
 */
export function BonnotMegaNav({ locale, items }) {
  if (!items?.length) return null;

  const visible = useMemo(
    () =>
      items.filter(
        (item) =>
          !menuItemHasClass(item, "is-contact") &&
          !menuItemHasClass(item, "contact-cta"),
      ),
    [items],
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openId, setOpenId] = useState(null);

  return (
    <div className="min-w-0 lg:flex-1 flex order-2 lg:order-1">
      {/* Mobile burger */}
      <div className="flex lg:justify-center justify-end lg:hidden">
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#00112233] bg-[#fffaf5] px-4 text-sm font-medium text-[#001122] transition hover:bg-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="bonnot-mobile-nav"
        >
          {mobileOpen ? (
            <CloseIcon className="text-[#001122]" />
          ) : (
            <BurgerIcon className="text-[#001122]" />
          )}
        </button>
      </div>

      {/* Desktop mega nav */}
      <nav
        className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-x-[15px] gap-y-2 overflow-visible lg:flex"
        aria-label="Primary"
      >
        {visible.map((item) => (
          <NavRowItem key={item.id} locale={locale} item={item} />
        ))}
      </nav>

      {/* Mobile panel */}
      {mobileOpen ? (
        <div
          id="bonnot-mobile-nav"
          className="mt-3 rounded-2xl border border-[#0011221f] bg-[#fffaf5] px-4 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] lg:hidden w-[95%] fixed left-[2.5%] right-auto"
          role="dialog"
          aria-label="Menu"
        >
          <LocaleCurrencyCompact current={locale} />
          {visible.map((item) => (
            <MobileNavItem
              key={item.id}
              locale={locale}
              item={item}
              open={openId === item.id}
              onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
              onNavigate={() => {
                setMobileOpen(false);
                setOpenId(null);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
