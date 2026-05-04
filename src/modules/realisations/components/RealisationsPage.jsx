import { realisationsPath } from "@/constants/routes";
import { RealisationsBreadcrumbSection } from "@/modules/realisations/components/RealisationsBreadcrumbSection";
import { RealisationsAchievementSection } from "@/modules/realisations/components/RealisationsAchievementSection";
import { RealisationsFeaturesSection } from "@/modules/realisations/components/RealisationsFeaturesSection";
import { RealisationsReadyToShipSection } from "@/modules/realisations/components/RealisationsReadyToShipSection";
import { CenterVideoSection } from "@/modules/common/components/CenterVideoSection";
import { RealisationsSourcingSection } from "@/modules/realisations/components/RealisationsSourcingSection";
import { FaqSection } from "@/modules/common/components/FaqSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";

export function RealisationsPage({ locale, sectionConfig }) {

    return (
        <div className="w-full bg-[#fffaf5]">

            {sectionConfig?.breadcrumb?.show !== false && (
                <section className="relative pt-[30px]">
                    <RealisationsBreadcrumbSection
                        locale={locale}
                        firstTitle={sectionConfig?.breadcrumb?.firstTitle}
                        firstLink={sectionConfig?.breadcrumb?.firstLink}
                        secondTitle={sectionConfig?.breadcrumb?.secondTitle}
                        secondLink={sectionConfig?.breadcrumb?.secondLink}
                    />
                </section>
            )}

            {sectionConfig?.achievementSection?.show !== false && (
                <section className="relative pb-[128px]">
                    <RealisationsAchievementSection
                        achievements={sectionConfig?.achievementSection?.achievements}
                        pageInfo={sectionConfig?.achievementSection?.achievementsPageInfo}
                        achievementTags={sectionConfig?.achievementSection?.achievementTags}
                        activeTagSlugFromUrl={sectionConfig?.achievementSection?.activeAchievementTagSlug}
                        realisationsBasePath={realisationsPath(locale)}
                    />
                </section>
            )}

            {sectionConfig?.featuresSection?.show !== false && (
                <section className="relative z-[2] overflow-hidden py-[64px]">
                    <RealisationsFeaturesSection
                        features={sectionConfig?.featuresSection?.features}
                    />
                </section>
            )}

            {sectionConfig?.readyToShipSection?.show !== false && (
                <section className="flex min-h-screen items-center justify-end bg-[#fffbf4] bg-cover py-[64px]">
                    <RealisationsReadyToShipSection
                        imageSrc={sectionConfig?.readyToShipSection?.imageSrc}
                        imageAlt={sectionConfig?.readyToShipSection?.imageAlt}
                        title={sectionConfig?.readyToShipSection?.title}
                        description={sectionConfig?.readyToShipSection?.description}
                        buttonTitle={sectionConfig?.readyToShipSection?.buttonTitle}
                        buttonLink={sectionConfig?.readyToShipSection?.buttonLink}
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
            {sectionConfig?.sourcingSection?.show !== false && (
                <section className="relative">
                    <RealisationsSourcingSection
                        imageSrc={sectionConfig?.sourcingSection?.imageSrc}
                        imageAlt={sectionConfig?.sourcingSection?.imageAlt}
                        title={sectionConfig?.sourcingSection?.title}
                        subHeading={sectionConfig?.sourcingSection?.subHeading}
                        description={sectionConfig?.sourcingSection?.description}
                        buttonTitle={sectionConfig?.sourcingSection?.buttonTitle}
                        buttonLink={sectionConfig?.sourcingSection?.buttonLink}
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