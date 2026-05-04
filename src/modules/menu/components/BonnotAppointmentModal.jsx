"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { localizedPath } from "@/constants/routes";

const ANIMATION_MS = 300;

function IconPhone({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.35 1.6.7 2.31a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.77-1.27a2 2 0 012.11-.45c.71.35 1.5.57 2.31.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMail({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconWhatsApp({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5a8.5 8.5 0 01-8.5 8.5c-1.5 0-2.9-.4-4.1-1.1L3 21l1.9-5.2A8.4 8.4 0 013 11.5 8.5 8.5 0 0111.5 3 8.5 8.5 0 0121 11.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowThin() {
  return (
    <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"></path>
    </svg>
  );
}

/** @param {unknown} field */
function normalizeRepeater(field) {
  if (field == null) return [];
  if (Array.isArray(field)) return field.filter(Boolean);
  return [field];
}

/**
 * Same rule as gems `showWeOffer`: `value !== false && value !== 'No'` (undefined → visible).
 * @param {unknown} value
 */
function isFooterAppointmentColumnVisible(value) {
  return value !== false && value !== "No";
}

function isExternalHref(href) {
  const t = (href || "").trim();
  return (
    /^https?:\/\//i.test(t) ||
    t.startsWith("mailto:") ||
    t.startsWith("tel:") ||
    t.startsWith("//")
  );
}

/**
 * @param {{
 *   href: string;
 *   locale: string;
 *   fallbackHref: string;
 *   onClose: () => void;
 *   className: string;
 *   children: import('react').ReactNode;
 * }} props
 */
function AppointmentActionLink({ href, locale, fallbackHref, onClose, className, children }) {
  const raw = (href || "").trim();
  const target = raw || fallbackHref;
  if (isExternalHref(target)) {
    const ext = target.startsWith("//") ? `https:${target}` : target;
    const openNew = /^https?:\/\//i.test(ext);
    return (
      <a
        href={ext}
        onClick={onClose}
        className={className}
        {...(openNew ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  const path = target.startsWith("/") ? target : `/${target}`;
  return (
    <Link href={localizedPath(locale, path)} onClick={onClose} className={className}>
      {children}
    </Link>
  );
}

/**
 * Full-width bottom-sheet rendez-vous chooser (Paris / à distance / email & WhatsApp).
 * Opens from the bottom of the viewport. Control with `isOpen` / `onClose`.
 * Optional `footerAppointmentPopup` maps WP ACF theme fields (see GetFooterAppointmentPopup).
 *
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   locale: string;
 *   bookingPath?: string;
 *   footerAppointmentPopup?: object | null;
 *   parisImageSrc?: string;
 *   parisMobileImageSrc?: string;
 *   distanceImageSrc?: string;
 *   distanceMobileImageSrc?: string;
 *   phoneDisplay?: string;
 *   phoneHref?: string;
 *   email?: string;
 *   whatsappHref?: string;
 * }} props
 */
export function BonnotAppointmentModal({
  isOpen,
  onClose,
  locale,
  bookingPath: bookingPathProp,
  footerAppointmentPopup = null,
  parisImageSrc,
  parisMobileImageSrc,
  distanceImageSrc,
  distanceMobileImageSrc,
  phoneDisplay,
  phoneHref,
  email,
  whatsappHref,
}) {
  const rdv =
    process.env.NEXT_PUBLIC_RDV_PATH ||
    process.env.NEXT_PUBLIC_CONTACT_PATH ||
    "/contact";
  const fallbackPath = rdv.startsWith("/") ? rdv : `/${rdv}`;
  const path = bookingPathProp ?? fallbackPath;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const bookingHref = localizedPath(locale, normalized);

  const [isVisible, setIsVisible] = useState(isOpen);
  const [entered, setEntered] = useState(false);

  const columns = useMemo(() => {
    const acf = footerAppointmentPopup && typeof footerAppointmentPopup === "object" ? footerAppointmentPopup : null;
    const hasAcf = Boolean(acf);

    const socialRaw = hasAcf ? normalizeRepeater(acf.column3SocialIcon) : [];
    const socialIcons = socialRaw
      .map((row) => ({
        src: row?.icon?.node?.sourceUrl,
        alt: row?.icon?.node?.altText || row?.title || "",
        href: (row?.link || "").trim(),
        title: row?.title || "",
      }))
      .filter((row) => row.href);

    const showColumn1 = !hasAcf || isFooterAppointmentColumnVisible(acf.showColumn1);
    const showColumn2 = !hasAcf || isFooterAppointmentColumnVisible(acf.showColumn2);
    const showColumn3 = !hasAcf || isFooterAppointmentColumnVisible(acf.showColumn3);

    let showC1 = showColumn1;
    let showC2 = showColumn2;
    let showC3 = showColumn3;
    if (hasAcf && !showC1 && !showC2 && !showC3) {
      showC1 = showC2 = showC3 = true;
    }

    /** @type {Array<{ kind: 'media' | 'contact'; id: string; title: string; description: string | null; desktopSrc?: string; mobileSrc?: string; desktopAlt?: string; mobileAlt?: string; buttonTitle: string; buttonUrl: string; mobileImageSide?: 'left' | 'right'; mobileHeadingIndent?: boolean; socialIcons?: typeof socialIcons }>} */
    const out = [];

    if (showC1) {
      out.push({
        kind: "media",
        id: "c1",
        title: (hasAcf && acf.column1Title) || "Paris",
        description:
          hasAcf && acf.column1Description?.trim()
            ? acf.column1Description
            : !hasAcf
              ? "Adresse précisée à la réservation"
              : null,
        desktopSrc: (hasAcf && acf.column1DesktopImage?.node?.sourceUrl) || parisImageSrc,
        mobileSrc: (hasAcf && acf.column1MobileImage?.node?.sourceUrl) || parisMobileImageSrc,
        desktopAlt: (hasAcf && acf.column1DesktopImage?.node?.altText) || "",
        mobileAlt: (hasAcf && acf.column1MobileImage?.node?.altText) || "",
        buttonTitle: (hasAcf && acf.column1ButtonTitle?.trim()) || "Prendre rendez-vous",
        buttonUrl: (hasAcf && acf.column1ButtonUrl?.trim()) || normalized,
        mobileImageSide: "right",
        mobileHeadingIndent: false,
      });
    }

    if (showC2) {
      out.push({
        kind: "media",
        id: "c2",
        title: (hasAcf && acf.column2Title) || "À distance",
        description:
          hasAcf && acf.column2Description?.trim()
            ? acf.column2Description
            : !hasAcf
              ? "Visio ou téléphone"
              : null,
        desktopSrc: (hasAcf && acf.column2DesktopImage?.node?.sourceUrl) || distanceImageSrc,
        mobileSrc: (hasAcf && acf.column2MobileImage?.node?.sourceUrl) || distanceMobileImageSrc,
        desktopAlt: (hasAcf && acf.column2DesktopImage?.node?.altText) || "",
        mobileAlt: (hasAcf && acf.column2MobileImage?.node?.altText) || "",
        buttonTitle: (hasAcf && acf.column2ButtonTitle?.trim()) || "Prendre rendez-vous",
        buttonUrl: (hasAcf && acf.column2ButtonUrl?.trim()) || normalized,
        mobileImageSide: "left",
        mobileHeadingIndent: true,
      });
    }

    if (showC3) {
      out.push({
        kind: "contact",
        id: "c3",
        title: (hasAcf && acf.column3Title) || "Email & WhatsApp",
        description:
          hasAcf && acf.column3Description?.trim()
            ? acf.column3Description
            : !hasAcf
              ? "Nous vous accompagnons où que vous soyez en ligne et nous déplaçons à la demande pour les projet les plus exclusifs."
              : null,
        buttonTitle: (hasAcf && acf.column3ButtonTitle?.trim()) || "Prendre rendez-vous",
        buttonUrl: (hasAcf && acf.column3ButtonUrl?.trim()) || normalized,
        socialIcons,
        mobileHeadingIndent: false,
      });
    }

    return out;
  }, [
    footerAppointmentPopup,
    parisImageSrc,
    parisMobileImageSrc,
    distanceImageSrc,
    distanceMobileImageSrc,
    normalized,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isVisible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isVisible]);

  useEffect(() => {
    let cancelled = false;

    if (isOpen) {
      Promise.resolve().then(() => {
        if (cancelled) return;
        setIsVisible(true);
        setEntered(false);
      });
      let raf1 = 0;
      let raf2 = 0;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          if (!cancelled) setEntered(true);
        });
      });
      return () => {
        cancelled = true;
        if (raf1) cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    }

    Promise.resolve().then(() => {
      if (cancelled) return;
      setEntered(false);
    });
    const timeout = setTimeout(() => {
      if (!cancelled) setIsVisible(false);
    }, ANIMATION_MS);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isOpen]);

  if (!isVisible) return null;

  const btnClass =
    "group inline-flex h-10 w-full max-w-full items-center justify-center gap-3 rounded-none px-[16px] text-sm font-semibold tracking-wide border border-[rgba(0,17,34,0.2)] bg-[#001122] text-white transition-colors hover:bg-transparent hover:text-[#001122] hover:border-[#001122]";

  const headingClass =
    "max-w-[230px] font-jakarta text-[28px] font-medium leading-[1.2] tracking-[0] text-[#000d29] max-[768px]:text-[20px]";

  const bodyClass = "font-jakarta text-[12px] font-normal leading-[1.55] text-[#0A1626]/85";

  const n = columns.length;
  const gridColsClass =
    n === 1 ? "grid-cols-1" : n === 2 ? "grid-cols-2 max-[768px]:grid-cols-1" : "grid-cols-3 max-[768px]:grid-cols-1";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-[16px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bonnot-rdv-modal-title"
    >
      <button
        type="button"
        className={`absolute inset-0 cursor-pointer bg-[#0A1626]/45 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Fermer"
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex max-h-[88vh] w-full flex-col overflow-hidden bg-[#fffbf4] shadow-2xl transition-transform duration-300 ease-out will-change-transform px-[40px] max-[992px]:px-[16px] ${
          entered ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[16px] bottom-[16px] z-20 flex h-12 w-12 items-center justify-center rounded-none text-[#fff] bg-[#f63] hover:bg-[#001122] transition max-[992px]:bottom-0 max-[992px]:right-0 cursor-pointer"
          aria-label="Fermer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div
          className={`relative grid grid-rows-[auto] ${gridColsClass} auto-cols-fr w-full h-full min-h-[400px] max-w-[1280px] m-auto gap-[120px] py-[32px] max-[992px]:gap-[16px] max-[992px]:min-h-[450px] max-[768px]:gap-[32px]`}
        >
          {columns.map((col, index) => {
            const isLast = index === columns.length - 1;
            const afterDivider =
              !isLast
                ? "after:absolute after:content-[''] after:bg-[#ddd4c6] after:block min-[992px]:after:right-[-60px] min-[992px]:after:top-0 min-[992px]:after:h-full min-[992px]:after:w-px max-[768px]:after:right-0 max-[768px]:after:bottom-[-16px] max-[768px]:after:h-px max-[768px]:after:w-full max-[768px]:after:top-auto"
                : "";

            if (col.kind === "media") {
              const mobileRight = col.mobileImageSide === "right";
              return (
                <section
                  key={col.id}
                  className={`relative flex flex-col items-start justify-start gap-[16px] ${afterDivider} max-[768px]:gap-[8px]`}
                >
                  <h4
                    id={index === 0 ? "bonnot-rdv-modal-title" : undefined}
                    className={`${headingClass} ${col.mobileHeadingIndent ? "max-[768px]:ml-[120px]" : ""}`}
                  >
                    {col.title}
                  </h4>
                  {col.desktopSrc ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element -- remote marketing photos; CMS or props */}
                      <img
                        src={col.desktopSrc}
                        alt={col.desktopAlt || ""}
                        className="h-auto w-full max-w-full object-cover hidden md:block"
                        width={900}
                        height={619}
                        loading="lazy"
                      />
                    </>
                  ) : null}
                  {col.mobileSrc ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element -- remote marketing photos; CMS or props */}
                      <img
                        src={col.mobileSrc}
                        alt={col.mobileAlt || ""}
                        className={`absolute top-0 bottom-0 mb-8 h-auto w-[103px] object-cover object-[50%_50%] block md:hidden ${
                          mobileRight ? "right-0 left-auto" : "right-auto left-0"
                        }`}
                        width={900}
                        height={619}
                        loading="lazy"
                      />
                    </>
                  ) : null}
                  {col.description ? (
                    <p
                      className={`font-jakarta text-[14px] font-bold leading-[1.5] text-[#000d29] ${col.mobileHeadingIndent ? "max-[768px]:ml-[120px]" : ""}`}
                    >
                      {col.description}
                    </p>
                  ) : null}
                  <div className="mt-auto z-[1] max-[768px]:w-full max-[768px]:mt-[60px] max-[480px]:mt-[20px]">
                    <AppointmentActionLink
                      href={col.buttonUrl}
                      locale={locale}
                      fallbackHref={bookingHref}
                      onClose={onClose}
                      className={btnClass}
                    >
                      {col.buttonTitle}
                      <ArrowThin />
                    </AppointmentActionLink>
                  </div>
                </section>
              );
            }

            const icons = col.socialIcons?.length ? col.socialIcons : null;

            return (
              <section
                key={col.id}
                className={`relative flex flex-col items-start justify-start gap-[16px] max-[768px]:gap-[8px] ${afterDivider}`}
              >
                <h4 className={headingClass}>{col.title}</h4>
                {col.description ? (
                  <p className={`${bodyClass} hidden md:block`}>{col.description}</p>
                ) : null}
                <ul className="mt-4 flex list-none flex-col gap-3 p-0 text-[#0A1626]">
                  {icons ? (
                    icons.map((row, i) => {
                      const href = row.href.startsWith("//") ? `https:${row.href}` : row.href;
                      const openNew =
                        isExternalHref(row.href) &&
                        !row.href.startsWith("mailto:") &&
                        !row.href.startsWith("tel:");
                      return (
                        <li key={`${row.href}-${i}`}>
                          <a
                            href={href}
                            target={openNew ? "_blank" : undefined}
                            rel={openNew ? "noopener noreferrer" : undefined}
                            className="footer-appointment-modal-icon group flex items-center justify-start gap-3 font-jakarta text-[14px] font-medium leading-[1.5] tracking-[0] text-[#000d29] no-underline transition-colors hover:text-[#f63] active:text-[#f63] focus-visible:text-[#f63]"
                          >
                            {row.src ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element -- CMS icons; opacity=Tailwind, tint=#f63 in globals.css */}
                                <img
                                  src={row.src}
                                  alt={row.alt || ""}
                                  className="footer-appointment-modal-icon-img shrink-0 object-contain transition-[opacity,filter] group-hover:opacity-75 active:opacity-90"
                                  loading="lazy"
                                />
                              </>
                            ) : (
                              <span className="h-[24px] w-[24px] shrink-0 rounded bg-[#0A1626]/10 transition-colors group-hover:bg-[#f63]/20" aria-hidden />
                            )}
                            <span>{row.title || row.href}</span>
                          </a>
                        </li>
                      );
                    })
                  ) : (
                    <>
                      {phoneHref ? (
                        <li>
                          <a
                            href={phoneHref}
                            className="group flex items-center justify-start gap-3 font-jakarta text-[14px] font-medium leading-[1.5] tracking-[0] text-[#000d29] no-underline transition-colors hover:text-[#f63]"
                          >
                            <IconPhone className="shrink-0 bg-[#0A1626] text-white transition-colors group-hover:bg-[#f63] group-hover:text-white w-[29px] h-[29px] p-[5px] md:bg-transparent md:group-hover:bg-transparent md:p-0 md:w-auto md:h-auto md:text-current" />
                            <span>{phoneDisplay || phoneHref}</span>
                          </a>
                        </li>
                      ) : null}
                      {email ? (
                        <li>
                          <a
                            href={`mailto:${email}`}
                            className="group flex items-center justify-start gap-3 font-jakarta text-[14px] font-medium leading-[1.5] tracking-[0] text-[#000d29] no-underline transition-colors hover:text-[#f63]"
                          >
                            <IconMail className="shrink-0 bg-[#0A1626] text-white transition-colors group-hover:bg-[#f63] group-hover:text-white w-[29px] h-[29px] p-[5px] md:bg-transparent md:group-hover:bg-transparent md:p-0 md:w-auto md:h-auto md:text-current" />
                            <span>{email}</span>
                          </a>
                        </li>
                      ) : null}
                      {whatsappHref ? (
                        <li>
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-start gap-3 font-jakarta text-[14px] font-medium leading-[1.5] tracking-[0] text-[#000d29] no-underline transition-colors hover:text-[#f63]"
                          >
                            <IconWhatsApp className="shrink-0 bg-[#0A1626] text-white transition-colors group-hover:bg-[#f63] group-hover:text-white w-[29px] h-[29px] p-[5px] md:bg-transparent md:group-hover:bg-transparent md:p-0 md:w-auto md:h-auto md:text-current" />
                            <span>Échanger sur Whatsapp</span>
                          </a>
                        </li>
                      ) : null}
                    </>
                  )}
                </ul>
                <div className="mt-auto max-[768px]:w-full max-[768px]:mt-[20px] hidden md:block">
                  <AppointmentActionLink
                    href={col.buttonUrl}
                    locale={locale}
                    fallbackHref={bookingHref}
                    onClose={onClose}
                    className={btnClass}
                  >
                    {col.buttonTitle}
                    <ArrowThin />
                  </AppointmentActionLink>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
