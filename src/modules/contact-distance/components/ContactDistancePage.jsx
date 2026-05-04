import { ContactParisCalendlySection } from "@/modules/common/components/ContactParisCalendlySection";

/**
 * Contact Distance — page shell.
 */
export function ContactDistancePage({ contactSection }) {
  return (
    <div className="w-full bg-[#fffaf5]">

  {contactSection?.showContactSection !== false && (
        <section className="">
        <ContactParisCalendlySection
          prefix={contactSection?.contactPrefix}
          title={contactSection?.contactTitle}
          description={contactSection?.contactDescription}
          iframe={contactSection?.contactIframe}
        />
        </section>
      )}
    </div>
  );
}