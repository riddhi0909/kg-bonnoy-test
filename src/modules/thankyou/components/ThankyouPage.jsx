import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { ThanksSection } from "@/modules/thankyou/components/ThanksSection";

export function ThankyouPage({ locale, sectionConfig }) {
  void locale;

  return (
    <div className="w-full bg-[#fffaf5]">
      {sectionConfig?.thankYouSection?.show !== false && (
        <section className="py-[64px]">
          <ThanksSection
            title={sectionConfig?.thankYouSection?.title}
            description={sectionConfig?.thankYouSection?.description}
            buttonTitle={sectionConfig?.thankYouSection?.buttonTitle}
            buttonLink={sectionConfig?.thankYouSection?.buttonLink}
            imageSrc={sectionConfig?.thankYouSection?.imageSrc}
            imageAlt={sectionConfig?.thankYouSection?.imageAlt}
          />
        </section>
      )}

      {sectionConfig?.testimonialSection?.show !== false && (
        <section className="border-b border-white/10">
          <TestimonialsSection
            pt={20}
            pb={20}
            categoryReviewsSectionData={sectionConfig?.testimonialSection?.categoryReviewsSectionData}
          />
        </section>
      )}
    </div>
  );
}
