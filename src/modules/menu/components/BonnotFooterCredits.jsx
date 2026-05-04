"use client";

import Link from "next/link";
import { localizedPath } from "@/constants/routes";
import { useAppointmentModal } from "@/modules/menu/providers/appointment-modal-context";

/**
 * Figma Footer / Credits: navy bar, copyright + RDV CTA.
 * @param {{ locale: string }} props
 */
export function BonnotFooterCredits({ locale }) {
  const { open: openAppointmentModal } = useAppointmentModal();

  const rdv =
    process.env.NEXT_PUBLIC_RDV_PATH ||
    process.env.NEXT_PUBLIC_CONTACT_PATH ||
    "/contact";
  const rdvPath = rdv.startsWith("/") ? rdv : `/${rdv}`;

  return (
    <div className="bg-[#001122]">
      <div className="mx-auto flex h-auto min-h-[90px] w-full max-w-[1440px] justify-center gap-0 px-4 py-5 min-[1440px]:h-[90px] flex-row items-center min-[1440px]:px-[60px] min-[1440px]:py-0">
        <p className="flex-1 text-sm font-normal leading-[1.428] text-[rgba(255,255,255,0.5)]">
          © {new Date().getFullYear()} Bonnot Paris. Joaillerie sur mesure avec des pierres d’exception.
        </p>
        <div className="flex shrink-0 items-center gap-[15px]">
        </div>
      </div>
      <button
        type="button"
        onClick={() => openAppointmentModal()}
        className="group fixed bottom-[26px] right-[93px] z-[99] flex h-10 w-[210px] items-center justify-center gap-2 border border-[#fffaf5] px-[15px] text-sm font-semibold leading-[1.428] bg-[#001122] text-[#fffaf5] transition hover:bg-[#f63] cursor-pointer"
      >
        Prendre rendez-vous
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M0 6.35H12M12 6.35L6 0.35M12 6.35L6 12.35" stroke="currentColor"></path></svg>
      </button>
    </div>
  );
}
