"use client";

import { useAppointmentModal } from "@/modules/menu/providers/appointment-modal-context";

export function CategoryContactButton() {
  const { open: openAppointmentModal } = useAppointmentModal();

  return (
    <button
      type="button"
      className="group cursor-pointer min-h-10 inline-flex w-fit self-start items-center gap-3 border border-[#00112233] bg-transparent px-6 py-2 text-sm font-medium leading-[1.428] text-[#001122] transition-all duration-300 hover:bg-[#001122] hover:text-white hover:border-[#001122]"
      onClick={() => openAppointmentModal()}
    >
      Nous contacter
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        <svg
          className="relative top-px shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
            stroke="currentColor"
            strokeOpacity="0.75"
            strokeMiterlimit="10"
          />
        </svg>
      </span>
    </button>
  );
}
