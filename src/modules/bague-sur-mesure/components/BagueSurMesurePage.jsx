import { CustomCreationSection } from "@/modules/bague-sur-mesure/components/CustomCreationSection";
import { StepOneAndThreeLeftImageWithTextSection } from "@/modules/bague-sur-mesure/components/Step1&3LeftImageWithTextSection";
import { StepTwoAndFourLeftImageWithTextSection } from "@/modules/bague-sur-mesure/components/Step2&4LeftImageWithTextSection";
import { RichTextSection } from "@/modules/bague-sur-mesure/components/RichTextSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
export function BagueSurMesurePage({ locale, sectionConfig }) {
  void locale;

  return (
      <div className="w-full bg-[#fffaf5]">

        {sectionConfig?.customCreationSection?.show !== false && (
        <section className="py-[64px]">
            <CustomCreationSection
                title={sectionConfig?.customCreationSection?.title}
                description={sectionConfig?.customCreationSection?.description}
                imageSrc={sectionConfig?.customCreationSection?.image}
                imageAlt={sectionConfig?.customCreationSection?.imageAlt}
            />
        </section>
        )}

        {sectionConfig?.theStoneSection?.show !== false && (
          <section className="py-[64px]">
            <StepOneAndThreeLeftImageWithTextSection
              title={sectionConfig?.theStoneSection?.title}
              description={sectionConfig?.theStoneSection?.description}
              imageSrc={sectionConfig?.theStoneSection?.image}
              imageAlt={sectionConfig?.theStoneSection?.imageAlt}
              buttonTitle={sectionConfig?.theStoneSection?.buttonTitle}
              buttonLink={sectionConfig?.theStoneSection?.buttonLink}
            />
          </section>
        )}

        {sectionConfig?.theCreationSection?.show !== false && (
          <section className="py-[64px]">
            <StepTwoAndFourLeftImageWithTextSection
              title={sectionConfig?.theCreationSection?.title}
              description={sectionConfig?.theCreationSection?.description}
              imageSrc={sectionConfig?.theCreationSection?.image}
              imageAlt={sectionConfig?.theCreationSection?.imageAlt}
              buttonTitle={sectionConfig?.theCreationSection?.buttonTitle}
              buttonLink={sectionConfig?.theCreationSection?.buttonLink}
            />
          </section>
        )}

        {sectionConfig?.theManufacturingSection?.show !== false && (
          <section className="py-[64px]">
            <StepOneAndThreeLeftImageWithTextSection
              title={sectionConfig?.theManufacturingSection?.title}
              description={sectionConfig?.theManufacturingSection?.description}
              imageSrc={sectionConfig?.theManufacturingSection?.image}
              imageAlt={sectionConfig?.theManufacturingSection?.imageAlt}
              buttonTitle={sectionConfig?.theManufacturingSection?.buttonTitle}
              buttonLink={sectionConfig?.theManufacturingSection?.buttonLink}
            />
          </section>
        )}

        {sectionConfig?.theDiscoverySection?.show !== false && (
          <section className="py-[64px]">
            <StepTwoAndFourLeftImageWithTextSection
              title={sectionConfig?.theDiscoverySection?.title}
              description={sectionConfig?.theDiscoverySection?.description}
              imageSrc={sectionConfig?.theDiscoverySection?.image}
              imageAlt={sectionConfig?.theDiscoverySection?.imageAlt}
              buttonTitle={sectionConfig?.theDiscoverySection?.buttonTitle}
              buttonLink={sectionConfig?.theDiscoverySection?.buttonLink}
            />
          </section>
        )}

        {sectionConfig?.customMadeSection?.show !== false && (
          <section className="py-[30px]">
            <RichTextSection
              title={sectionConfig?.customMadeSection?.title}
              description={sectionConfig?.customMadeSection?.description}
            />
          </section>
        )}

        {sectionConfig?.theProcessSection?.show !== false && (
          <section className="py-[30px]">
            <RichTextSection
              title={sectionConfig?.theProcessSection?.title}
              description={sectionConfig?.theProcessSection?.description}
            />
          </section>
        )}

        {sectionConfig?.whyBuySection?.show !== false && (
          <section className="py-[30px]">
            <RichTextSection
              title={sectionConfig?.whyBuySection?.title}
              description={sectionConfig?.whyBuySection?.description}
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

