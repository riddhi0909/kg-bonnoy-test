import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { TalkingAboutSection } from "@/modules/presse/components/TalkingAboutSection";
import { BrandSection } from "@/modules/presse/components/BrandSection";
import { PressSection } from "@/modules/presse/components/PressSection";

export function PressePage({ locale, sectionConfig }) {
  void locale;

  return (
      <div className="w-full bg-[#fffaf5]">
        {sectionConfig?.talkingAboutSection?.show !== false && (
          <section className="py-[64px]">
            <TalkingAboutSection
              title={sectionConfig?.talkingAboutSection?.title}
              subHeading={sectionConfig?.talkingAboutSection?.subHeading}
              articleList={sectionConfig?.talkingAboutSection?.articleList}
            />
          </section>
        )}
        {sectionConfig?.pressSection?.show !== false && (
          <section className="py-[64px] mt-[30px]">
            <PressSection
              title={sectionConfig?.pressSection?.title}
              subHeading={sectionConfig?.pressSection?.subHeading}
              description={sectionConfig?.pressSection?.description}
              imageSrc={sectionConfig?.pressSection?.image}
              imageAlt={sectionConfig?.pressSection?.imageAlt}
            />
          </section>
        )}

        {sectionConfig?.theBrandSection?.show !== false && (
          <section className="py-[64px]">
            <BrandSection
              title={sectionConfig?.theBrandSection?.title}
              subHeading={sectionConfig?.theBrandSection?.subHeading}
              description={sectionConfig?.theBrandSection?.description}
              imageSrc={sectionConfig?.theBrandSection?.image}
              imageAlt={sectionConfig?.theBrandSection?.imageAlt}
              buttonTitle={sectionConfig?.theBrandSection?.buttonTitle}
              buttonLink={sectionConfig?.theBrandSection?.buttonLink}
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

export default PressePage;

