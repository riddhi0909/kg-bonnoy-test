import { InvestirBreadcrumbSection } from "@/modules/investir/components/InvestirBreadcrumbSection";
import { InvestirHeroSection } from "@/modules/investir/components/InvestirHeroSection";
import { InvestirThePotentialSection } from "@/modules/investir/components/InvestirThePotentialSection";
import { ProcessingStepsSection } from "@/modules/investir/components/ProcessingStepsSection";
import { InvestmentAccordionSection } from "@/modules/investir/components/InvestmentAccordionSection";
import { OurExpertiseSection } from "@/modules/investir/components/OurExpertiseSection";
import { FaqSection } from "@/modules/common/components/FaqSection";
import { InvestirSourcingSection } from "@/modules/investir/components/InvestirSourcingSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { InvestirPerformanceSection } from "@/modules/investir/components/InvestirPerformanceSection";
import { InvestirOurOffersSection } from "@/modules/investir/components/InvestirOurOffersSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";

export function InvestirPage({ locale, sectionConfig }) {

  return <div className="w-full bg-[#fffaf5]">

    {sectionConfig?.hero?.show !== false && (
      <InvestirHeroSection
        title1={sectionConfig?.hero?.title1}
        title2={sectionConfig?.hero?.title2}
        heroImage={sectionConfig?.hero?.image || ""}
      />
    )}

    {sectionConfig?.breadcrumb?.show !== false && (
      <section className="pt-[46px]">
        <InvestirBreadcrumbSection
          locale={locale}
          firstTitle={sectionConfig?.breadcrumb?.firstTitle}
          firstLink={sectionConfig?.breadcrumb?.firstLink}
          secondTitle={sectionConfig?.breadcrumb?.secondTitle}
          secondLink={sectionConfig?.breadcrumb?.secondLink}
        />
      </section>
    )}

    {sectionConfig?.thePotentialSection?.show !== false && (
      <section className="py-[64px]">
        <InvestirThePotentialSection
          title={sectionConfig?.thePotentialSection?.title}
          subHeading={sectionConfig?.thePotentialSection?.subHeading}
          description={sectionConfig?.thePotentialSection?.description}
          highlightedText={sectionConfig?.thePotentialSection?.highlightedText}
          button={sectionConfig?.thePotentialSection?.button}
          image={sectionConfig?.thePotentialSection?.image}
          imageAlt={sectionConfig?.thePotentialSection?.imageAlt}
        />
      </section>
    )}


    {sectionConfig?.stepSection?.show !== false && (
      <section className="py-[64px]">
        <ProcessingStepsSection
          title={sectionConfig?.stepSection?.title}
          description={sectionConfig?.stepSection?.description}
          steps={sectionConfig?.stepSection?.steps}
        />
      </section>
    )}
    {sectionConfig?.performanceSection?.show !== false && (
      <section className="py-[128px] bg-[#f4efe6] bg-cover bg-center overflow-hidden position-relative z-[2] max-[768px]:py-[64px] " style={{ backgroundImage: `url(${sectionConfig?.performanceSection?.backgroundImage || ""})` }}>
        <InvestirPerformanceSection
          title={sectionConfig?.performanceSection?.title}
          description={sectionConfig?.performanceSection?.description}
          performanceTab={sectionConfig?.performanceSection?.performanceTab}
        />
      </section>
    )}
    {sectionConfig?.ourOffersSection?.show !== false && (
      <section className="py-[64px]">
        <InvestirOurOffersSection
          title={sectionConfig?.ourOffersSection?.heading}
          description={sectionConfig?.ourOffersSection?.subHeading}
          managementTabHeading={sectionConfig?.ourOffersSection?.managementTabHeading}
          managementTabTitle={sectionConfig?.ourOffersSection?.managementTabTitle}
          managementTabSubHeading={sectionConfig?.ourOffersSection?.managementTabSubHeading}
          managementTabHighlightText={sectionConfig?.ourOffersSection?.managementTabHighlightText}
          managementTabImage={sectionConfig?.ourOffersSection?.managementTabImage}
          managementTabImageAlt={sectionConfig?.ourOffersSection?.managementTabImageAlt}
          managementTabDescription={sectionConfig?.ourOffersSection?.managementTabDescription}
          managementTabButton={sectionConfig?.ourOffersSection?.managementTabButton}
          portfolioTabHeading={sectionConfig?.ourOffersSection?.portfolioTabHeading}
          portfolioTabTitle={sectionConfig?.ourOffersSection?.portfolioTabTitle}
          portfolioTabSubHeading={sectionConfig?.ourOffersSection?.portfolioTabSubHeading}
          portfolioTabHighlightText={sectionConfig?.ourOffersSection?.portfolioTabHighlightText}
          portfolioTabImage={sectionConfig?.ourOffersSection?.portfolioTabImage}
          portfolioTabImageAlt={sectionConfig?.ourOffersSection?.portfolioTabImageAlt}
          portfolioTabDescription={sectionConfig?.ourOffersSection?.portfolioTabDescription}
          portfolioTabButton={sectionConfig?.ourOffersSection?.portfolioTabButton}
        />
      </section>
    )}

    {sectionConfig?.investmentSection?.show !== false && (
      <section className="relative overflow-hidden bg-[#faf5ef] max-[767px]:bg-[#f0e9e0] py-[64px]">
        <InvestmentAccordionSection
          title={sectionConfig?.investmentSection?.title}
          description={sectionConfig?.investmentSection?.subtitle}
          image={sectionConfig?.investmentSection?.image}
          imageAlt={sectionConfig?.investmentSection?.imageAlt}
          accordion={sectionConfig?.investmentSection?.accordion}
        />
      </section>
    )}
    {sectionConfig?.exceptionalSourcing?.show !== false && (
      <section className="overflow-clip bg-[#faf5ef]">
        <OurExpertiseSection
          leftImage={sectionConfig?.exceptionalSourcing?.leftImage}
          leftImageAlt={sectionConfig?.exceptionalSourcing?.leftImageAlt}
          leftMasterImage={sectionConfig?.exceptionalSourcing?.leftMasterImage}
          leftMasterImageAlt={sectionConfig?.exceptionalSourcing?.leftMasterImageAlt}
          title={sectionConfig?.exceptionalSourcing?.title}
          description={sectionConfig?.exceptionalSourcing?.description}
          contentList={sectionConfig?.exceptionalSourcing?.contentList}
          subHeading={sectionConfig?.exceptionalSourcing?.subHeading}
          button={sectionConfig?.exceptionalSourcing?.button}
        />
      </section>
    )}

    {sectionConfig?.faqSection?.show !== false && (
      <section className="relative z-[3]">
        <FaqSection faqDetails={sectionConfig?.faqSection?.faqDetails} />
      </section>
    )}
    {sectionConfig?.sourcingSection?.show !== false && (
      <section className="py-[64px]">
        <InvestirSourcingSection
          imageSrc={sectionConfig?.sourcingSection?.image}
          imageAlt={sectionConfig?.sourcingSection?.imageAlt}
          title={sectionConfig?.sourcingSection?.title}
          subHeading={sectionConfig?.sourcingSection?.subHeading}
          description={sectionConfig?.sourcingSection?.description}
          button={sectionConfig?.sourcingSection?.button}
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


  </div>;
} 