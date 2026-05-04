
import { PageHeroSection } from "@/modules/terms-of-use/components/PageHeroSection";
import { TermsInformationSection } from "@/modules/terms-of-use/components/TermsInformationSection";

export function TermsOfUsePage({ locale, sectionConfig}) {

  return (
    <div className="w-full bg-[#fffaf5]">
      {sectionConfig?.pageHeroSection?.show !== false && (
        <section className="pb-[65px] pt-[10px] bg-cover bg-center" style={{ backgroundImage: `url(${sectionConfig?.pageHeroSection?.image})` }}>
          <PageHeroSection
            title={sectionConfig?.pageHeroSection?.title}
            backUrl={sectionConfig?.pageHeroSection?.backUrl}
          />
        </section>
      )}
      {sectionConfig?.termsInformationSection?.show !== false && (
        <section className="py-[64px]">
         <TermsInformationSection
            termsInformation={sectionConfig?.termsInformationSection?.termsInformation}
            lastUpdateDate={sectionConfig?.termsInformationSection?.lastUpdateDate}
          />
        </section>
      )}
    </div>
  );
}