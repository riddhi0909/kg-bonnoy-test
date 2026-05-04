"use client";

import Image from "next/image";
import { homePath } from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { useAppointmentModal } from "@/modules/menu/providers/appointment-modal-context";

export function ComparisonTable({ comparisonData, locale }) {
  const { open: openAppointmentModal } = useAppointmentModal();
  const rows = Array.isArray(comparisonData?.rows) ? comparisonData.rows : [];
  const showCompressionSection = comparisonData?.showCompressionSection !== false && comparisonData?.showCompressionSection !== 'No';
  const bonnotParisTitle = comparisonData?.bonnotParisTitle || "Bonnot Paris";
  const traditionalJewelersTitle = comparisonData?.traditionalJewelersTitle || "Joailliers Traditionnels";
  const compressionBackgroundImage = comparisonData?.compressionBackgroundImage || "/figma/bonnot-paris.jpg";
  const appointmentButtonText = comparisonData?.appointmentButtonText || "Prendre rendez-vous";
  const exchangeButtonText = comparisonData?.exchangeButtonText || "Échanger sur Whatsapp";
  const exchangeButtonLink = comparisonData?.exchangeButtonLink || homePath(locale);
  const heading = comparisonData?.compressionTitle || "Malesuada imperdiet faucibus turpis est integer turpis lectus morbi.";
  return (
    showCompressionSection && (
    <section className="relative w-full">
      <div className="relative mx-auto min-[768px]:h-[900px] w-full min-[1440px]:max-w-[1440px] pt-[113px] pb-[30px] min-[768px]:pt-[120px] min-[768px]:pb-[60px]">
        <Image src={compressionBackgroundImage} alt="" fill sizes="100vw" className="object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[#00112240]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-between min-[1440px]:px-[60px]">
          <div className="mx-auto w-full max-w-[930px] hidden min-[768px]:inline">
            <p className="mx-auto w-full min-[768px]:max-w-[30%] text-center font-serif text-[20px] font-normal leading-[1.2] tracking-[0.02em] text-white min-[1440px]:text-[28px]">
              {heading}
            </p>
          </div>

          <div className="mx-auto mt-8 w-full min-[768px]:max-w-[90%] overflow-hidden text-white">
            <div className="grid grid-cols-[0.9fr_1fr_1fr]  min-[768px]:grid-cols-[1fr_1.15fr_1.15fr]">
              <div className="bg-transparent" />
              <div className="border-b border-white/25 bg-[#001122] content-center p-[10px] min-[768px]:p-[15px] min-[768px]:text-[14px] text-[11px] font-semibold leading-[1.35] min-[768px]:text-sm [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]" >
                <span className="mr-2 text-[10px] text-[#ff6633]">◆</span>
                {bonnotParisTitle}
              </div>
              <div className="border-b border-white/25 bg-[#00112240] content-center p-[10px] min-[768px]:p-[15px] min-[768px]:text-[14px] text-[11px] font-semibold leading-[1.35] backdrop-blur-[14px] min-[768px]:text-sm [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]" >
                {traditionalJewelersTitle}
              </div>

                    {rows.map((row , index) => (
                      <React.Fragment key={index}>
                        <p className="bg-[#00112240] border-b border-white/25 last:border-b-0 content-center p-[10px] min-[768px]:p-[15px] min-[768px]:text-[14px] text-[11px] font-light leading-[1.35] text-white min-[768px]:text-sm backdrop-blur-[14px] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                          {row.title}
                        </p>
                        <p className="bg-[#001122] p-[10px] min-[768px]:p-[15px] min-[768px]:text-[14px] text-[11px] content-center border-b border-white/25 last:border-b-0 font-light leading-[1.35] text-white min-[768px]:text-sm [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                          <span className="mr-2 text-[10px] text-white hidden min-[768px]:inline">◆</span>
                          {row.bonnot}
                        </p>
                        <p className="bg-[#00112240] border-b border-white/25 last:border-b-0 content-center p-[10px] min-[768px]:p-[15px] min-[768px]:text-[14px] text-[11px] font-light leading-[1.35] text-white backdrop-blur-[14px]  min-[768px]:text-sm [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                          {row.classic}
                        </p>
                      </React.Fragment>
                    ))}

                <div className="bg-transparent" />
                <div  className="flex flex-col min-[768px]:flex-row min-[768px]:gap-1 gap-2 bg-[#001122] p-[10px] justify-center">
                  <button
                    type="button"
                    onClick={() => openAppointmentModal()}
                    className="flex items-center justify-center
                      min-[768px]:h-10
                      bg-white
                      border border-transparent

                      px-[10px] py-[10px]
                      min-[768px]:px-[12px]

                      text-[11px] min-[768px]:text-sm
                      font-semibold leading-[1.35]
                      text-[#001122]

                      transition-all duration-300

                      hover:bg-transparent
                      hover:text-white
                      hover:border-white/25
                      cursor-pointer
                      [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
                  >
                    {appointmentButtonText}
                  </button>
                  <Link
                    href={exchangeButtonLink}
                    className="group flex items-center justify-center gap-2
                      min-[768px]:h-10

                      border border-white/25
                      bg-[#001122]/78

                      px-[10px] py-[10px]
                      min-[768px]:px-[12px]

                      text-[11px] min-[768px]:text-sm
                      font-semibold leading-[1.35]
                      text-white

                      transition-all duration-300

                      hover:text-[#001122]
                      hover:bg-white
                      hover:border-white/25

                      [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
                    >
                    {exchangeButtonText}
                    <span
                      aria-hidden
                      className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#001122]"
                    >
                      <svg
                        className="relative top-px shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                          stroke="currentColor"
                          strokeOpacity="0.9"
                          strokeMiterlimit="10"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    )
  );
}