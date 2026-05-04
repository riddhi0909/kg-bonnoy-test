import { MaisonBonnotHeroSection } from "@/modules/maison-bonnot/components/MaisonBonnotHeroSection";
import { MaisonBonnotBreadcrumbSection } from "@/modules/maison-bonnot/components/MaisonBonnotBreadcrumbSection";
import { JewelryInfoSection } from "@/modules/maison-bonnot/components/JewelryInfoSection";
import { CenterVideoSection } from "@/modules/common/components/CenterVideoSection";
import { PassionSection } from "@/modules/maison-bonnot/components/SplitImageWithTextSection";
import { OurExpertiseSection } from "@/modules/maison-bonnot/components/OurExpertiseSection";
import { ExceptionalSourcingSection } from "@/modules/maison-bonnot/components/ExceptionalSourcingSection";
import { PhilosophyAccordionSection } from "@/modules/maison-bonnot/components/PhilosophyAccordionSection";
import { CertificationBySection } from "@/modules/maison-bonnot/components/CertificationBySection";
import { FaqSection } from "@/modules/common/components/FaqSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";

export function MaisonBonnotPage({ locale, sectionConfig}) {

  return (
    <div className="w-full bg-[#fffaf5]">
      {sectionConfig?.hero?.show !== false && (
        <MaisonBonnotHeroSection
          title1={sectionConfig?.hero?.title1}
          title2={sectionConfig?.hero?.title2}
          heroImage={sectionConfig?.hero?.image || ""}
        />
      )}

      {sectionConfig?.breadcrumb?.show !== false && (
      <section className="pt-[46px]">
        <MaisonBonnotBreadcrumbSection
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
       {sectionConfig?.centerVideo?.show !== false && (
        <section className="relative z-[2] bg-[#f4efe6] py-[64px]">
        <CenterVideoSection
          video={sectionConfig?.centerVideo?.video}
          videoAlt={sectionConfig?.centerVideo?.videoAlt}
        />
        </section>
      )}
      {sectionConfig?.passionSection?.show !== false && (
        <section className="relative z-[2] py-[64px] mt-[30px]">
          <PassionSection
            title={sectionConfig?.passionSection?.title}
            description={sectionConfig?.passionSection?.description}
            subDescription={sectionConfig?.passionSection?.subDescription}
            buttonTitle={sectionConfig?.passionSection?.buttonTitle}
            buttonLink={sectionConfig?.passionSection?.buttonLink}
            leftImage={sectionConfig?.passionSection?.leftImage}
            leftImageAlt={sectionConfig?.passionSection?.leftImageAlt}
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
      {sectionConfig?.exceptionalSourcing?.show !== false && (
        <section className="relative z-[2] py-[64px] mt-[30px]">
          <ExceptionalSourcingSection
            imageSrc={sectionConfig?.exceptionalSourcing?.imageSrc}
            imageAlt={sectionConfig?.exceptionalSourcing?.imageAlt}
            title={sectionConfig?.exceptionalSourcing?.title}
            subHeading={sectionConfig?.exceptionalSourcing?.subHeading}
            description={sectionConfig?.exceptionalSourcing?.description}
            highlightedText={sectionConfig?.exceptionalSourcing?.highlightedText}
            buttonTitle={sectionConfig?.exceptionalSourcing?.buttonTitle}
            buttonLink={sectionConfig?.exceptionalSourcing?.buttonLink}
          />
        </section>
      )}
      {sectionConfig?.ourPhilosophy?.show !== false && (
        <section className="relative overflow-hidden bg-[#faf5ef] max-[767px]:bg-[#f0e9e0] py-[64px]">
          <PhilosophyAccordionSection
            title={sectionConfig?.ourPhilosophy?.title}
            description={sectionConfig?.ourPhilosophy?.description}
            accordion={sectionConfig?.ourPhilosophy?.accordion}
            image={sectionConfig?.ourPhilosophy?.image}
            imageAlt={sectionConfig?.ourPhilosophy?.imageAlt}
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
          <FaqSection faqDetails={sectionConfig?.faqSection?.faqDetails} />
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
