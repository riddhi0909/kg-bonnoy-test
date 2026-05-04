import { CustomMadeHeroSection } from "@/modules/custom-made/components/CustomMadeHeroSection";
import { CustommadeBreadcrumbSection } from "@/modules/custom-made/components/CustommadeBreadcrumbSection";
import { JewelryInfoSection } from "@/modules/custom-made/components/JewelryInfoSection";
import { ProcessingStepsSection } from "@/modules/custom-made/components/ProcessingStepsSection";
import { CenterVideoSection } from "@/modules/common/components/CenterVideoSection";
import { OurAchievementsSection } from "@/modules/custom-made/components/OurAchievementsSection";
import { BonnotHouseParisSection } from "@/modules/custom-made/components/BonnotHouseParisSection";
import { OurExpertiseSection } from "@/modules/custom-made/components/OurExpertiseSection";
import { CertificationBySection } from "@/modules/custom-made/components/CertificationBySection";
import { FaqSection } from "@/modules/common/components/FaqSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";

export function CustomMadePage({ locale, sectionConfig}) {

  return (
    <div className="w-full bg-[#fffaf5]">
      {sectionConfig?.hero?.show !== false && (
        <CustomMadeHeroSection
          title1={sectionConfig?.hero?.title1}
          title2={sectionConfig?.hero?.title2}
          heroImage={sectionConfig?.hero?.image || ""}
        />
      )}

      {sectionConfig?.breadcrumb?.show !== false && (
      <section className="pt-[46px]">
        <CustommadeBreadcrumbSection
          locale={locale}
          firstTitle={sectionConfig?.breadcrumb?.firstTitle}
          firstLink={sectionConfig?.breadcrumb?.firstLink}
          secondTitle={sectionConfig?.breadcrumb?.secondTitle}
          secondLink={sectionConfig?.breadcrumb?.secondLink}
        />
      </section>
      )}
      {sectionConfig?.jewelryInfo?.show !== false && (
        <section className="py-[64px] mt-[48px]">
          <JewelryInfoSection
            title={sectionConfig?.jewelryInfo?.title}
            subHeading={sectionConfig?.jewelryInfo?.subHeading}
            description={sectionConfig?.jewelryInfo?.description}
            highlightedText={sectionConfig?.jewelryInfo?.highlightedText}
            buttonTitle={sectionConfig?.jewelryInfo?.buttonTitle}
            buttonLink={sectionConfig?.jewelryInfo?.buttonLink}
            imageSrc={sectionConfig?.jewelryInfo?.imageSrc}
            imageAlt={sectionConfig?.jewelryInfo?.imageAlt}
          />
        </section>
      )}
      {sectionConfig?.stepSection?.show !== false && (
        <ProcessingStepsSection
          steps={sectionConfig?.stepSection?.steps}
        />
      )}
      {sectionConfig?.centerVideo?.show !== false && (
        <section className="relative z-[2] bg-[#f4efe6] py-[64px]">
        <CenterVideoSection
          video={sectionConfig?.centerVideo?.video}
          videoAlt={sectionConfig?.centerVideo?.videoAlt}
        />
        </section>
      )}
      {sectionConfig?.ourAchievements?.show !== false && (
        <section className="overflow-hidden bg-[#000d29] py-[64px]">
        <OurAchievementsSection
          title={sectionConfig?.ourAchievements?.title}
          subHeading={sectionConfig?.ourAchievements?.subHeading}
          buttonTitle={sectionConfig?.ourAchievements?.buttonTitle}
          buttonLink={sectionConfig?.ourAchievements?.buttonLink}
          items={sectionConfig?.ourAchievements?.items}
        />
        </section>
      )}
      {sectionConfig?.bonnotHouseParis?.show !== false && (
      <section className="relative z-[2] flex w-full items-center justify-center overflow-hidden bg-[#fffbf4]">
        <BonnotHouseParisSection
          image={sectionConfig?.bonnotHouseParis?.image}
          imageAlt={sectionConfig?.bonnotHouseParis?.imageAlt}
          title={sectionConfig?.bonnotHouseParis?.title}
          description={sectionConfig?.bonnotHouseParis?.description}
          highlightedText={sectionConfig?.bonnotHouseParis?.highlightedText}
          buttonTitle={sectionConfig?.bonnotHouseParis?.buttonTitle}
          buttonLink={sectionConfig?.bonnotHouseParis?.buttonLink}
        />
      </section>
      )}
      {sectionConfig?.ourKnowSection?.show !== false && (
        <section className="overflow-clip bg-[#faf5ef]">
          <OurExpertiseSection
            leftImage={sectionConfig?.ourKnowSection?.leftImage}
            leftImageAlt={sectionConfig?.ourKnowSection?.leftImageAlt}
            leftMasterImage={sectionConfig?.ourKnowSection?.leftMasterImage}
            leftMasterImageAlt={sectionConfig?.ourKnowSection?.leftMasterImageAlt}
            title={sectionConfig?.ourKnowSection?.title}
            description={sectionConfig?.ourKnowSection?.description}
            contentList={sectionConfig?.ourKnowSection?.contentList}
            subHeading={sectionConfig?.ourKnowSection?.subHeading}
            buttonTitle={sectionConfig?.ourKnowSection?.buttonTitle}
            buttonLink={sectionConfig?.ourKnowSection?.buttonLink}
          />
        </section>
      )}
      {sectionConfig?.certificationBySection?.show !== false && (
        <section className="py-[64px] mt-[48px]">
          <CertificationBySection
            image={sectionConfig?.certificationBySection?.image}
            imageAlt={sectionConfig?.certificationBySection?.imageAlt}
            title={sectionConfig?.certificationBySection?.title}
            subHeading={sectionConfig?.certificationBySection?.subHeading}
            description={sectionConfig?.certificationBySection?.description}
            buttonTitle={sectionConfig?.certificationBySection?.buttonTitle}
            buttonLink={sectionConfig?.certificationBySection?.buttonLink}
          />
        </section>
      )}
      {sectionConfig?.faqSection?.show !== false && (
        <section className="relative z-[3]">
          <FaqSection
            faqDetails={sectionConfig?.faqSection?.faqDetails}
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
