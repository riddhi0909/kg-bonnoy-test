import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { CustomCreationSection } from "@/modules/joaillier-angers/components/CustomCreationSection";
import { RichTextSection } from "@/modules/joaillier-angers/components/RichTextSection";
import { StepOneAndThreeLeftImageWithTextSection } from "@/modules/joaillier-angers/components/Step1&3LeftImageWithTextSection";
import { StepTwoAndFourRightImageWithTextSection } from "@/modules/joaillier-angers/components/Step2&4RightImageWithTextSection";

export function AngersJewelerPage({ locale, sectionConfig }) {
  void locale;

  return (
      <div className="w-full bg-[#fffaf5]">

        {sectionConfig?.joaillierAngersSection?.show !== false && (
            <section className="py-[64px]">
                <CustomCreationSection
                    title={sectionConfig?.joaillierAngersSection?.title}
                    subHeading={sectionConfig?.joaillierAngersSection?.subHeading}
                    description={sectionConfig?.joaillierAngersSection?.description}
                    buttonTitle={sectionConfig?.joaillierAngersSection?.buttonTitle}
                    buttonLink={sectionConfig?.joaillierAngersSection?.buttonLink}
                    imageSrc={sectionConfig?.joaillierAngersSection?.image}
                    imageAlt={sectionConfig?.joaillierAngersSection?.imageAlt}
                />
            </section>
        )}

        {sectionConfig?.customCreationSection?.show !== false && (
          <section className="py-[64px]">
            <StepOneAndThreeLeftImageWithTextSection
              title={sectionConfig?.customCreationSection?.title}
              subHeading={sectionConfig?.customCreationSection?.subHeading}
              description={sectionConfig?.customCreationSection?.description}
              imageSrc={sectionConfig?.customCreationSection?.image}
              imageAlt={sectionConfig?.customCreationSection?.imageAlt}
              buttonTitle={sectionConfig?.customCreationSection?.buttonTitle}
              buttonLink={sectionConfig?.customCreationSection?.buttonLink}
            />
          </section>
        )}

        {sectionConfig?.theStudioSection?.show !== false && (
          <section className="py-[64px]">
            <StepTwoAndFourRightImageWithTextSection
              title={sectionConfig?.theStudioSection?.title}
              subHeading={sectionConfig?.theStudioSection?.subHeading}
              description={sectionConfig?.theStudioSection?.description}
              imageSrc={sectionConfig?.theStudioSection?.image}
              imageAlt={sectionConfig?.theStudioSection?.imageAlt}
              buttonTitle={sectionConfig?.theStudioSection?.buttonTitle}
              buttonLink={sectionConfig?.theStudioSection?.buttonLink}
            />
          </section>
        )}

        {sectionConfig?.maisonBonnotSection?.show !== false && (
          <section className="py-[40px]">
            <RichTextSection
              title={sectionConfig?.maisonBonnotSection?.title}
              description={sectionConfig?.maisonBonnotSection?.description}
              image={sectionConfig?.maisonBonnotSection?.image}
              imageAlt={sectionConfig?.maisonBonnotSection?.imageAlt}
            />
          </section>
        )}

        {sectionConfig?.theOriginsSection?.show !== false && (
          <section className="py-[40px]">
            <RichTextSection
              title={sectionConfig?.theOriginsSection?.title}
              description={sectionConfig?.theOriginsSection?.description}
              image={sectionConfig?.theOriginsSection?.image}
              imageAlt={sectionConfig?.theOriginsSection?.imageAlt}
            />
          </section>
        )}

        {sectionConfig?.yourTailorSection?.show !== false && (
          <section className="py-[40px]">
            <RichTextSection
              title={sectionConfig?.yourTailorSection?.title}
              description={sectionConfig?.yourTailorSection?.description}
            />
          </section>
        )}

        {sectionConfig?.innovativeCreativitySection?.show !== false && (
          <section className="py-[40px]">
            <RichTextSection
              title={sectionConfig?.innovativeCreativitySection?.title}
              description={sectionConfig?.innovativeCreativitySection?.description}
            />
          </section>
        )}

        {sectionConfig?.bonnotJewelerSection?.show !== false && (
          <section className="py-[64px] mt-[30px]">
            <StepTwoAndFourRightImageWithTextSection
              title={sectionConfig?.bonnotJewelerSection?.title}
              subHeading={sectionConfig?.bonnotJewelerSection?.subHeading}
              description={sectionConfig?.bonnotJewelerSection?.description}
              imageSrc={sectionConfig?.bonnotJewelerSection?.image}
              imageAlt={sectionConfig?.bonnotJewelerSection?.imageAlt}
              buttonTitle={sectionConfig?.bonnotJewelerSection?.buttonTitle}
              buttonLink={sectionConfig?.bonnotJewelerSection?.buttonLink}
            />
          </section>
        )}

        {sectionConfig?.testimonialsSection?.show !== false && (
            <section className="border-b border-white/10">
                <TestimonialsSection
                    pt={20}
                    categoryReviewsSectionData={sectionConfig?.testimonialsSection?.categoryReviewsSectionData}
                />
            </section>
        )}
        <BeforeFooterSection />

    </div>
  );
}

