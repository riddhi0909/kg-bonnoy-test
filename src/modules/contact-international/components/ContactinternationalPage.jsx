import { ContactParisCalendlySection } from "@/modules/common/components/ContactParisCalendlySection";

/**
 * Contact International — page shell.
 */
export function ContactinternationalPage({ contactSection }) {
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
