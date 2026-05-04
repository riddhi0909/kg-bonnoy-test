import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { StepTwoAndFourRightImageWithTextSection } from "@/modules/joaillier-angers/components/Step2&4RightImageWithTextSection";
import { StepOneAndThreeLeftImageWithTextSection } from "@/modules/joaillier-paris/components/Step1&3LeftImageWithTextSection";
import { RichTextSection } from "@/modules/joaillier-paris/components/RichTextSection";

export function JoaillierParisPage({ locale, sectionConfig }) {
  void locale;

  return (
      <div className="w-full bg-[#fffaf5]">
        {sectionConfig?.bonnotJewelerSection?.show !== false && (
          <section className="py-[64px]">
            <StepTwoAndFourRightImageWithTextSection
              title={sectionConfig?.bonnotJewelerSection?.title}
              subHeading={sectionConfig?.bonnotJewelerSection?.subHeading}
              description={sectionConfig?.bonnotJewelerSection?.description}
              imageSrc={sectionConfig?.bonnotJewelerSection?.image}
              imageAlt={sectionConfig?.bonnotJewelerSection?.imageAlt}
              buttonTitle={null}
              buttonLink={null}
            />
          </section>
        )}
        {sectionConfig?.uniqueCreationsSection?.show !== false && (
          <section className="py-[64px]">
            <StepOneAndThreeLeftImageWithTextSection
              title={sectionConfig?.uniqueCreationsSection?.title}
              subHeading={sectionConfig?.uniqueCreationsSection?.subHeading}
              description={sectionConfig?.uniqueCreationsSection?.description}
              imageSrc={sectionConfig?.uniqueCreationsSection?.image}
              imageAlt={sectionConfig?.uniqueCreationsSection?.imageAlt}
              buttonTitle={sectionConfig?.uniqueCreationsSection?.buttonTitle}
              buttonLink={sectionConfig?.uniqueCreationsSection?.buttonLink}
            />
          </section>
        )}
        {sectionConfig?.ringsCreatedSection?.show !== false && (
          <section className="py-[64px]">
            <StepTwoAndFourRightImageWithTextSection
              title={sectionConfig?.ringsCreatedSection?.title}
              subHeading={sectionConfig?.ringsCreatedSection?.subHeading}
              description={sectionConfig?.ringsCreatedSection?.description}
              imageSrc={sectionConfig?.ringsCreatedSection?.image}
              imageAlt={sectionConfig?.ringsCreatedSection?.imageAlt}
              buttonTitle={sectionConfig?.ringsCreatedSection?.buttonTitle}
              buttonLink={sectionConfig?.ringsCreatedSection?.buttonLink}
            />
          </section>
        )}
        {sectionConfig?.bonnotParisJewelerSection?.show !== false && (
          <section className="py-[40px]">
            <RichTextSection
              title={sectionConfig?.bonnotParisJewelerSection?.title}
              description={sectionConfig?.bonnotParisJewelerSection?.description}
              image={sectionConfig?.bonnotParisJewelerSection?.image}
              imageAlt={sectionConfig?.bonnotParisJewelerSection?.imageAlt}
            />
          </section>
        )}
        {sectionConfig?.theStagesSection?.show !== false && (
          <section className="py-[40px]">
            <RichTextSection
              title={sectionConfig?.theStagesSection?.title}
              description={sectionConfig?.theStagesSection?.description}
            />
          </section>
        )}
        {sectionConfig?.historySection?.show !== false && (
          <section className="py-[40px]">
            <RichTextSection
              title={sectionConfig?.historySection?.title}
              description={sectionConfig?.historySection?.description}
            />
          </section>
        )}
        {sectionConfig?.discoverOurStonesSection?.show !== false && (
          <section className="py-[40px]">
            <RichTextSection
              title={sectionConfig?.discoverOurStonesSection?.title}
              description={sectionConfig?.discoverOurStonesSection?.description}
            />
          </section>
        )}
        {sectionConfig?.testimonialSection?.show !== false && (
            <section className="border-b border-white/10">
                <TestimonialsSection
                    pt={20}
                    categoryReviewsSectionData={sectionConfig?.testimonialSection?.categoryReviewsSectionData}
                />
            </section>
        )}
        <BeforeFooterSection />
    </div>
  );
}

