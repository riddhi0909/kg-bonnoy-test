import { RichTextSection } from "@/modules/general-terms/components/RichTextSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";

export function GeneralTermsPage({ locale, sectionConfig}) {

  return (
    <div className="w-full bg-[#fffaf5]">
   
      {sectionConfig?.generalTermsSection?.show !== false && (
        <section className="py-[30px]">
        <RichTextSection
          title={sectionConfig?.generalTermsSection?.title}
          description={sectionConfig?.generalTermsSection?.description}
        />
        </section>
      )}

      {sectionConfig?.testimonialsSection?.show !== false && (
        <TestimonialsSection
          pt={20}
          categoryReviewsSectionData={sectionConfig?.testimonialsSection?.categoryReviewsSectionData}
        />
      )}
      
      <BeforeFooterSection />
    </div>
  );
}
