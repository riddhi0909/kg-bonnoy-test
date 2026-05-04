import { achievementSlugFromUri } from "@/constants/routes";
import { SingleRealisationsHeroSection } from "@/modules/realisations/components/SingleRealisationsHeroSection";
import { SingleRealisationsSlider } from "@/modules/realisations/components/SingleRealisationsSlider";
import { RealisationsFeaturesSection } from "@/modules/realisations/components/RealisationsFeaturesSection";
import { RealisationsReadyToShipSection } from "@/modules/realisations/components/RealisationsReadyToShipSection";
import { CenterVideoSection } from "@/modules/common/components/CenterVideoSection";
import { RealisationsSourcingSection } from "@/modules/realisations/components/RealisationsSourcingSection";
import { FaqSection } from "@/modules/common/components/FaqSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";

function collectPortfolioImageUrls(post) {
  const portfolio = post?.achievements?.portfolioImages?.nodes ?? [];
  const urls = portfolio.map((n) => String(n?.sourceUrl ?? "").trim()).filter(Boolean);
  const featured = String(post?.featuredImage?.node?.sourceUrl ?? "").trim();
  if (!urls.length && featured) urls.push(featured);
  return urls;
}

function stripHtmlSnippet(value, maxLen) {
  const plain = String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!maxLen || plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen)}…`;
}

/**
 * @param {object} props
 * @param {string} props.locale
 * @param {object} props.post CMS achievements post node
 * @param {Array<{ href: string; image: string; title: string; subtitle: string }>} props.relatedItems
 * @param {object} [props.sectionConfig] same shape as main Réalisations listing (features, FAQ, etc.)  
 */
export function SingleRealisationPage({ locale, post, relatedItems, sectionConfig }) {
  const titleHtml = String(post?.title ?? "").trim();
  const subTitle = String(post?.achievements?.subTitle ?? "").trim();
  const shortDescription = String(post?.achievements?.shortDescription ?? "").trim();
  const contentHtml = String(post?.content ?? "").trim();
  const imageUrls = collectPortfolioImageUrls(post);
  const imageAltBase = String(post?.featuredImage?.node?.altText ?? "").trim() || stripHtmlSnippet(titleHtml, 120);
  const ach = post?.achievements ?? {};
  const achievementSpecs = {
    clarity: String(ach.clarity ?? "").trim(),
    measurement: String(ach.measurement ?? "").trim(),
    origin: String(ach.origin ?? "").trim(),
    treatment: String(ach.treatment ?? "").trim(),
  };

  const contactLabel = locale === "en" ? "Contact us" : "Nous contacter";
  const contactHint =
    locale === "en"
      ? "Do you like this creation? Don't hesitate to contact us to create your own."
      : "Vous aimez cette création ? N'hésitez pas à nous contacter pour créer la votre.";
  const relatedTitle = locale === "en" ? "You will also enjoy" : "Vous aimerez aussi";
  const slug =
    String(post?.slug ?? "").trim() || achievementSlugFromUri(post?.uri);

  return (
    <div className="w-full bg-[#fffaf5]">
      <section className="relative z-[3] min-h-screen max-[768px]:pt-28">
        <SingleRealisationsHeroSection
          locale={locale}
          slug={slug}
          titleHtml={titleHtml}
          imageUrls={imageUrls}
          imageAltBase={imageAltBase}
          subTitle={subTitle}
          shortDescription={shortDescription}
          descriptionHtml={contentHtml}
          achievementSpecs={achievementSpecs}
          contactLabel={contactLabel}
          contactHint={contactHint}
        />
      </section>

      {sectionConfig?.featuresSection?.show !== false && (
        <section className="relative z-[2] overflow-hidden py-[64px]">
          <RealisationsFeaturesSection
            features={sectionConfig?.featuresSection?.features}
          />
        </section>
      )}
      <section className="relative py-[128px] max-[992]:py-[96px] max-[768px]:py-[64px] overflow-hidden">
        <SingleRealisationsSlider
          items={relatedItems}
          sectionTitle={relatedTitle}
          locale={locale}
        />
      </section>


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
            categoryReviewsSectionData={
              sectionConfig?.testimonialsSection?.categoryReviewsSectionData
            }
          />
        </section>
      )}
      <BeforeFooterSection />
    </div>
  );
}
