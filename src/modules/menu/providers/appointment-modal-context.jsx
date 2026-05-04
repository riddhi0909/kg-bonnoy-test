"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_FOOTER_APPOINTMENT_POPUP } from "@/modules/cms/api/queries";
import { BonnotAppointmentModal } from "@/modules/menu/components/BonnotAppointmentModal";

const AppointmentModalContext = createContext(
  /** @type {{ open: () => void; close: () => void } | null} */ (null),
);

/** Opens the same “Prendre rendez-vous” sheet as the footer (global ACF + modal). Requires ApolloProvider. */
export function useAppointmentModal() {
  const ctx = useContext(AppointmentModalContext);
  if (!ctx) {
    return { open: () => {}, close: () => {} };
  }
  return ctx;
}

/**
 * @param {{ locale: string; children: import("react").ReactNode }} props
 */
export function AppointmentModalProvider({ locale, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const { data: appointmentPopupData } = useQuery(GET_FOOTER_APPOINTMENT_POPUP, {
    fetchPolicy: "cache-and-network",
  });
  const footerAppointmentPopup = appointmentPopupData?.themeSettings?.footerAppointmentPopup ?? null;

  const rdv =
    process.env.NEXT_PUBLIC_RDV_PATH ||
    process.env.NEXT_PUBLIC_CONTACT_PATH ||
    "/contact";
  const rdvPath = rdv.startsWith("/") ? rdv : `/${rdv}`;

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <AppointmentModalContext.Provider value={value}>
      {children}
      <BonnotAppointmentModal
        isOpen={isOpen}
        onClose={close}
        locale={locale}
        bookingPath={rdvPath}
        footerAppointmentPopup={footerAppointmentPopup}
      />
    </AppointmentModalContext.Provider>
  );
}
