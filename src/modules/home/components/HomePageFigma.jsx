import Image from "next/image";
import Link from "next/link";
import { homePath, productsPath, categoryPath } from "@/constants/routes";
import { HomeProductStrip } from "@/modules/home/components/HomeProductStrip";
import { HomeCategoryGridStrip } from "@/modules/home/components/HomeCategoryGridStrip";

import { HomeCategoryStrip } from "@/modules/home/components/HomeCategoryStrip";

import { PortfolioRevealCard } from "@/modules/home/components/PortfolioRevealCard";
import { RealisationsPortfolioTrack } from "@/modules/home/components/RealisationsPortfolioTrack";
import { HomeIntroKeywordsMobileSlider } from "@/modules/home/components/HomeIntroKeywordsMobileSlider";
import { HeroSectionWithVideo } from "@/modules/home/components/HeroSectionWithVideo";

import { ComparisonTable } from "@/modules/home/components/ComparisonTable";
import { HomeStoriesLightbox } from "@/modules/home/components/HomeStoriesLightbox";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { HomepageHorizontalSection } from "@/modules/home/components/HomepageHorizontalSection";
import { HomeAuthenticite } from "@/modules/home/components/HomeAuthenticite";
import {
  AUTH_VALUES_CENTER_RING_SRC,
  defaultFigmaValuesRings,
} from "@/modules/home/hooks/homeAuthenticiteConstants";
const HP = "/figma/hp";

/** Figma: page fill */
const PAGE_BG = "#FFFAF5";
const INK = "#001122";
const INK_20 = "rgba(0, 17, 34, 0.2)";
const INK_75 = "rgba(0, 17, 34, 0.75)";
const ACCENT = "#FF6633";

const INTRO_COPY =
  "Chaque jour, nous vous offrons de nouvelles gemmes directement depuis nos bureaux au Sri Lanka, à Bangkok et à Jaipur. Sélectionnées pour leur rareté et leur clarté, nos pierres sont choisies avec soin pour vous garantir les plus belles pierres du marché, au prix le plus juste.";

const INTRO_KEYWORDS = [
  { title: "Sourcing en direct", link: "Le sourcing", href: "#sourcing" },
  { title: "Pierres certifiées", link: "Les pierres précieuses", hrefKey: "products" },
  { title: "Créations 100% sur mesure", link: "La joaillerie", hrefKey: "products" },
  { title: "Prix justes et transparents", link: "Les réalisations", hrefKey: "products" },
  { title: "Membre de l'\nICA", link: "Maison Bonnot", href: "#maison" },
];

const SECTION_PAD_X = "px-4 min-[1440px]:px-[60px]";

/** Bottom vignette on portfolio cards: Figma uses #001122 from #00112200 (transparent) → solid; approximated with inset box-shadow. */
const PORTFOLIO_BOTTOM_INSET_SHADOW =
  "inset 0 -380px 260px -100px #00112238, inset 0 -220px 180px -70px #00112238, inset 0 -100px 100px -40px #00112238";

function Story270x480({ src, alt }) {
  return (
    <div className="relative h-[210px] w-full overflow-hidden min-[768px]:h-[280px] min-[768px]:w-[190px] min-[768px]:shrink-0 min-[1024px]:h-[360px] min-[1024px]:w-[210px] min-[1440px]:h-[480px] min-[1440px]:w-[320px]">
      <Image src={src} alt={alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 190px, (max-width: 1439px) 210px, 320px" className="object-cover" loading="lazy" />
    </div>
  );
}


function Story180x320({ src, alt, caption }) {
  return (
    <div className="relative h-[min(55vw,320px)] w-full min-[1440px]:h-[320px] min-[1440px]:w-[180px] min-[1440px]:shrink-0">
      <Image src={src} alt={alt} fill sizes="(max-width: 1439px) 55vw, 180px" className="object-cover" loading="lazy" />
      {caption ? (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#001122] to-transparent p-2.5 text-sm font-normal leading-[1.428] text-white">
          {caption}
        </div>
      ) : null}
    </div>
  );
}



function ArrowLink({ children, href }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-[15px] text-sm font-semibold leading-[1.428] text-white transition-opacity hover:text-[#FF6633] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
    >
      {children}
      <svg className="shrink-0" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeOpacity="0.85" strokeMiterlimit="10" />
      </svg>
    </Link>
  );
}

function DarkLink({ children, href }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-[15px] text-sm font-semibold leading-[1.428] text-[rgba(0,17,34,0.75)] transition-colors hover:text-[#001122]"
    >
      {children}
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeOpacity="0.75" strokeMiterlimit="10" />
      </svg>
    </Link>
  );
}

/** Figma Bt-Link → : thin shaft + sharp chevron, same color as label (currentColor = #001122 on parent) */
function ArrowRightLink({ className }) {
  return (
    <svg className="relative top-px shrink-0" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeOpacity="0.75" strokeMiterlimit="10" />
    </svg>
  );
}

function toCardText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashPickIndex(seed, len) {
  if (len <= 0) return 0;
  let h = 0;
  const s = String(seed);
  for (let i = 0; i < s.length; i += 1) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h) % len;
}

function getPortfolioImageUrls(item) {
  const nodes = item?.achievements?.portfolioImages?.nodes;
  if (!Array.isArray(nodes)) return [];
  return nodes.map((n) => n?.sourceUrl).filter(Boolean);
}

/** Inset (hover) image: one portfolio item; if possible, not the same URL as the main/featured. */
function pickInsetFromPortfolio(item, mainUrl) {
  const urls = getPortfolioImageUrls(item);
  if (urls.length === 0) return mainUrl;
  const seed = item?.uri || item?.title || "";
  let idx = hashPickIndex(seed, urls.length);
  let pick = urls[idx];
  if (mainUrl && urls.length > 1) {
    const different = urls.find((u) => u !== mainUrl);
    if (pick === mainUrl && different) pick = different;
  }
  return pick;
}

function buildAchievementCardsFromPosts(posts) {
  if (!Array.isArray(posts) || posts.length === 0) return [];
  const cleaned = posts.filter(
    (item) => item?.featuredImage?.node?.sourceUrl || item?.title || item?.achievements?.subTitle,
  );
  if (cleaned.length === 0) return [];

  const cards = [];
  for (let i = 0; i < cleaned.length; i += 1) {
    const post = cleaned[i];
    const featured = post?.featuredImage?.node?.sourceUrl;
    const portfolioFirst = getPortfolioImageUrls(post)[0];
    const mainUrl = featured || portfolioFirst;
    if (!mainUrl) continue;

    const insetUrl = pickInsetFromPortfolio(post, mainUrl) || mainUrl;

    cards.push({
      achivementImage: mainUrl,
      achivementHoverImage: insetUrl,
      achivementTitle: toCardText(post?.title) || undefined,
      achivementLinkText: toCardText(post?.achievements?.subTitle) || undefined,
      achivementLink: post?.uri || undefined,
    });
  }
  return cards;
}

function buildAchievementSliderCards(cards) {
  if (!Array.isArray(cards) || cards.length === 0) return [];
  if (cards.length <= 2 || cards.length % 2 === 0) return cards;

  const lastIndex = cards.length - 1;
  const previousCard = cards[lastIndex - 1];
  const lastCard = cards[lastIndex];
  return [
    ...cards.slice(0, lastIndex),
    { ...previousCard, desktopOnly: true },
    lastCard,
  ];
}

/**
 * Bonnot homepage — 1440 artboard, 60px gutters; WP supplies products + optional hero copy.
 * Hero widths at 1440: 270 + 60 + 180 + 60 + 420 + 60 + 180 + 60 + 270 = 1320 (inside 60px side padding).
 * @param {{ locale: string; heroTitle?: string; introCopy?: string; introBackground?: string; introKeywords?: { title: string; link: string; href?: string; hrefKey?: string; }[]; valuesKeywords?: { backgroundColor?: string; title1?: string; title3?: string; line2Plain?: string | null; excellenceBefore?: string; excellenceAfter?: string; excellenceRingSrc?: string | null; excellenceRingAlt?: string; excellenceRingDropShadow?: boolean; excellenceRingOverlayLeft?: string; excellenceRingOverlayTop?: string; body?: string | null; rings?: Array<Partial<{ src: string; alt: string; top: string; left: string; width: string; className: string; dropShadow: boolean }> | null | undefined>; } }} props
 */
export function HomePageFigma({
  locale,
  heroTitle,
  categories,
  introCopy,
  section2introtext,
  section2background_image,
  section2keywords,
  valuesKeywords,
  heroSectionData,
  weOfferSectionData,
  instagramFeeds,
  achivementSectionData,
  achivementPosts = [],
  brandStorySectionData,
  comparisonData,
  showBonnotParisProductSection = true,
  showBonnotSecondSection = true,
  showBonnotCategorySection = true,
  showProductCategorySection = true,
  bonnotCategoryTitle,
  bonnotCategoryButtonTitle,
  bonnotCategoryButtonHref,
  bonnotsCategorySlug,
  gridSectionTitle,
  gridSectionButtonText,
  gridSectionButtonUrl,
  gridCategoryColumns = [],
  bonnotCategoryNodes = [],
  selectedBonnotCategories = [],
  gridCategoryNodes = [],
  pierresProducts = [],
  pierresCategoryName,
  pierresCategorySlug,
  secondCategoryProducts = [],
  secondCategoryName,
  secondCategorySlug,
  storiesSectionData, // add line 
  secondStoriesSectionData
}) {
  const showWeOffer = weOfferSectionData?.showWeOfferGems !== false && weOfferSectionData?.showWeOfferGems !== 'No';
  const intro = weOfferSectionData?.weOfferText || section2introtext || introCopy || INTRO_COPY;
  const introBg = weOfferSectionData?.weOfferBackgroundImage || section2background_image || `${HP}/hp-hero-center.png`;
  const introKeywordsSource = weOfferSectionData?.featureList?.length
    ? weOfferSectionData.featureList
    : section2keywords?.length
      ? section2keywords
      : INTRO_KEYWORDS;

  const showAchivementSection = achivementSectionData?.showAchivementSection !== false && achivementSectionData?.showAchivementSection !== 'No';
  const effectiveBonnotCategories =
    bonnotCategoryNodes.length > 0 ? bonnotCategoryNodes : selectedBonnotCategories;
  const effectiveBonnotSlug =
    bonnotsCategorySlug || String(effectiveBonnotCategories?.[0]?.slug || "").trim() || undefined;
  const achivementHeading = achivementSectionData?.achivementHeading || undefined;
  const allAchivementLinkText = achivementSectionData?.allAchivementLinkText || undefined;
  const allAchivementLink = achivementSectionData?.allAchivementLink || undefined;
  const achivementCard = achivementSectionData?.achivementCard || undefined;
  const postBasedAchivementCards = buildAchievementCardsFromPosts(achivementPosts);
  const fallbackAchivementCards = Array.isArray(achivementCard)
    ? achivementCard.filter((card) => card?.achivementImage || card?.achivementHoverImage || card?.achivementTitle)
    : [];
  const achivementCards = postBasedAchivementCards.length > 0 ? postBasedAchivementCards : fallbackAchivementCards;
  const achivementSliderCards = buildAchievementSliderCards(achivementCards);

    const showStoriesSection = storiesSectionData?.showStoriesSection !== false && storiesSectionData?.showStoriesSection !== 'No';
    const showSecondStoriesSection = secondStoriesSectionData?.showSecondStoriesSection !== false && secondStoriesSectionData?.showSecondStoriesSection !== 'No';

    


    const pierresList = Array.isArray(pierresProducts) ? pierresProducts : [];
    const secondList = Array.isArray(secondCategoryProducts) ? secondCategoryProducts : [];

    const showPierresSection = showBonnotParisProductSection !== false && showBonnotParisProductSection !== "No";
    // console.log("achivementCards", achivementCard.filter);
  const hasAchivementCards = achivementCards.length > 0;
  const showBrandStorySection = brandStorySectionData?.showBrandStorySection !== false && brandStorySectionData?.showBrandStorySection !== 'No';
     
  const introKeywords = introKeywordsSource
    .map((row) => ({
      title: String(row?.title || "").trim(),
      link: String(row?.link || "").trim(),
      href: row?.href || undefined,
      hrefKey: row?.hrefKey || undefined,
    }))
    .filter((row) => row.title && row.link);

  function kwHref(row) {
    if (row.href) return row.href;
    if (row.hrefKey === "products") return productsPath(locale);
    return homePath(locale);
  }

  const introKeywordMobileRows = introKeywords.map((row) => ({
    title: row.title,
    link: row.link,
    href: kwHref(row),
  }));
  const introKeywordDesktopRows = introKeywords.map((row) => ({
    title: row.title,
    link: row.link,
    href: kwHref(row),
  }));

  const h1 =
    heroSectionData?.heroTitle ||
    heroTitle ||
    "L'expert de vos saphirs et des pierres de couleurs pour vos bijoux sur-mesure";

  const showHero = heroSectionData?.showHeroSection == 'Yes' ? true : false;


  return (
    <div className="w-full" style={{ backgroundColor: PAGE_BG }}>
      {/* Hero — 60px gaps between columns @ 1440 */}
      {showHero && (
        <>
          <HeroSectionWithVideo
            h1={h1}
            productsPath={productsPath(locale)}
            firstButtonText={heroSectionData?.heroFirstButtonText}
            firstButtonLink={heroSectionData?.heroFirstButtonLink}
            secondButtonText={heroSectionData?.heroSecondButtonText}
            secondButtonLink={heroSectionData?.heroSecondButtonLink}
            col1TopImage={heroSectionData?.col1TopImage}
            col1BottomImage={heroSectionData?.col1BottomImage}
            col2TopImage={heroSectionData?.col2TopImage}
            col2MiddleImage={heroSectionData?.col2MiddleImage}
            col3BottomImage={heroSectionData?.col3BottomImage}
            col2BottomImage={heroSectionData?.col2BottomImage}
            col4TopImage={heroSectionData?.col4TopImage}
            col4MiddleImage={heroSectionData?.col4MiddleImage}
            col4BottomImage={heroSectionData?.col4BottomImage}
            col5TopImage={heroSectionData?.col5TopImage}
            col5BottomImage={heroSectionData?.col5BottomImage}
            overlayIntroText={showWeOffer ? intro : undefined}
            overlayKeywords={showWeOffer ? introKeywordDesktopRows : []}
          />
          <div className="hero-height"></div>
        </>
      )}

      

      {/* Intro — 1440×900 */}
      {showWeOffer && (
        <section className={`relative mx-auto mt-[80px] h-[720px] w-full max-w-[1440px] md:h-[90vw] lg:h-[min(75vw,900px)] ${showHero ? "min-[1024px]:hidden" : ""}`}>
          <Image src={introBg} alt="" fill sizes="100vw" className="object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#001122]/25" />
          <div className="absolute inset-0 flex items-center justify-center px-6 ">
            <p className="max-w-[810px] text-center font-serif text-[21px] font-normal leading-[25px] text-white md:text-[28px] md:leading-[1.25]">
              {intro}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-4 py-6 min-[1440px]:px-[60px] min-[1440px]:py-[30px]">
            <div className="hidden min-[768px]:grid min-[768px]:grid-cols-5 min-[768px]:gap-3 min-[1024px]:gap-6 min-[1440px]:gap-[50px]">
              {introKeywords.map((row, idx) => (
                <div
                  key={`${row.title}-${row.link}-${idx}`}
                  className="flex min-h-[80px] min-w-0 w-full flex-col justify-between gap-4 border-l border-white/25 pl-3 min-[1024px]:gap-6 min-[1024px]:pl-5"
                >
                  <p className="max-w-full min-[1024px]:max-w-[12rem] whitespace-pre-line break-words font-serif text-[17px] font-normal uppercase leading-[1.19] text-white min-[1024px]:text-[21px]">
                    {row.title}
                  </p>
                  <div className="flex">
                    <ArrowLink href={kwHref(row)}>{row.link}</ArrowLink>
                  </div>
                </div>
              ))}
            </div>
            <HomeIntroKeywordsMobileSlider rows={introKeywordMobileRows} />
          </div>
        </section>
      )}

      {/* Maison — wide horizontal scroll (fabrication, sourcing, ICA) */}
      {/* <HomeMaisonHorizontalSection locale={locale} /> */}

      {/* Gem — Category */}
      {showPierresSection && pierresList.length > 0 ? (
        <section
          id="pierres"
          className={`mx-auto w-full max-w-[1440px] space-y-[30px] py-[60px]  min-[1440px]:pb-[90px] min-[1440px]:pt-[40px]`}
        >
          <HomeProductStrip
            products={pierresList}
            locale={locale}
            title={pierresCategoryName}
            viewAllHref={categoryPath(locale, pierresCategorySlug)}
            titleDisplayMode="pluralWithBrand"
          />
        </section>
      ) : null}




      {/* Réalisations — Figma: title row hidden below md (767px); inset + toggle only md+ */}
      {showAchivementSection && (
      <section id="realisations" className="mx-auto w-full max-w-[1440px] min-[1024px]:flex min-[1024px]:h-screen min-[1024px]:flex-col min-[1024px]:pb-4">
        <Link
          href={allAchivementLink || productsPath(locale)}
          className="sr-only md:hidden"
        >
          {allAchivementLinkText || "Toutes les réalisations"}
        </Link>
        <div
          className={`pb-[30px] ${SECTION_PAD_X}`}
        >
          <div className="flex flex-col justify-between md:flex-row md:items-center gap-[30px]">
            <h2 className="text-left font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122]">
              {achivementHeading || "RÉALISATIONS"}
            </h2>
            <Link
              href={allAchivementLink || productsPath(locale)}
              className="group inline-flex justify-end items-center gap-[12px] text-sm font-semibold leading-5 text-[#001122] hover:text-[#FF6633] transition-opacity hover:opacity-80"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {allAchivementLinkText || "Toutes les réalisations"}
              <ArrowRightLink />
            </Link>
          </div>
        </div>

        <RealisationsPortfolioTrack className="min-[1024px]:h-[calc(100vh-150px)] min-[1024px]:min-h-0">
          {hasAchivementCards ? (
            achivementSliderCards.map((card, index) => (
              <PortfolioRevealCard
                key={`achivement-card-${index}`}
                backgroundSrc={card.achivementImage}
                insetSrc={card.achivementHoverImage}
                achivementTitle={card.achivementTitle || ""}
                achivementLink={card.achivementLink || allAchivementLink || ""}
                achivementLinkText={card.achivementLinkText || ""}
                staticFooterOnHover
                desktopOnly={card.desktopOnly === true}
                bottomInsetShadow={PORTFOLIO_BOTTOM_INSET_SHADOW}
              />
            ))
          ) : (
            <>
              <PortfolioRevealCard
                backgroundSrc={`${HP}/hp-portfolio-blur.png`}
                insetSrc={`${HP}/hp-portfolio-1.png`}
                achivementTitle="Bague avec saphir violet de Madagascar"
                achivementLinkText="Bague de fiançailles pour Laureen"
                bottomInsetShadow={PORTFOLIO_BOTTOM_INSET_SHADOW}
              />
              <PortfolioRevealCard
                backgroundSrc={`${HP}/hp-hero-c2a.png`}
                insetSrc={`${HP}/hp-portfolio-2.png`}
                achivementTitle="Pendentif avec tourmaline bleue de Namibie"
                achivementLinkText="Pendentif par Isabelle"
                bottomInsetShadow={PORTFOLIO_BOTTOM_INSET_SHADOW}
              />
            </>
          )}
        </RealisationsPortfolioTrack>
      </section>
      )}

      {/* Authenticité — Figma: AUTHENTICITÉ / EXCELLENCE / SINGULARITÉ + rings (node 623-5615) */}
      <HomeAuthenticite
        backgroundColor={valuesKeywords?.backgroundColor}
        title1={valuesKeywords?.title1}
        title3={valuesKeywords?.title3}
        line2Plain={valuesKeywords?.line2Plain}
        excellenceBefore={valuesKeywords?.excellenceBefore}
        excellenceAfter={valuesKeywords?.excellenceAfter}
        excellenceRingSrc={
          valuesKeywords != null &&
            Object.prototype.hasOwnProperty.call(valuesKeywords, "excellenceRingSrc")
            ? valuesKeywords.excellenceRingSrc
            : AUTH_VALUES_CENTER_RING_SRC
        }
        excellenceRingAlt={valuesKeywords?.excellenceRingAlt}
        excellenceRingDropShadow={valuesKeywords?.excellenceRingDropShadow}
        excellenceRingOverlayLeft={valuesKeywords?.excellenceRingOverlayLeft}
        excellenceRingOverlayTop={valuesKeywords?.excellenceRingOverlayTop}
        body={valuesKeywords?.body}
        rings={defaultFigmaValuesRings()}
      />

         {/* Maison — wide horizontal scroll (fabrication, sourcing, ICA) */}
      {showBrandStorySection && (
        <HomepageHorizontalSection locale={locale} brandStorySectionData={brandStorySectionData} />
      )}
      
      {/* Gem — Category rail (same scroll controls as product strip) */}
      {showBonnotCategorySection ? (
        <section
          id="categories"
          className={`mx-auto w-full max-w-[1440px] space-y-[30px] py-[60px] min-[1440px]:pt-[120px] min-[1440px]:pb-[60px]`}
        >
          <HomeCategoryStrip
            categories={effectiveBonnotCategories}
            locale={locale}
            title={bonnotCategoryTitle}
            viewAllLabel={bonnotCategoryButtonTitle}
            viewAllHref={bonnotCategoryButtonHref || (effectiveBonnotSlug ? categoryPath(locale, effectiveBonnotSlug) : undefined)}
          />
        </section>
      ) : null}

      
      {/* Stories popup grid 2 */}
      {showStoriesSection && (
      <section className={`mx-auto w-full max-w-[1440px] py-16 min-[1440px]:py-[60px] px-[15px]`}>
          <HomeStoriesLightbox items={storiesSectionData} />
        </section>
      )}

      {/* Gem — Saphirs */}
      {showBonnotSecondSection && secondList.length > 0 ? (
        <section id="saphirs" className={`mx-auto w-full max-w-[1440px] space-y-[30px] py-[30px] min-[1440px]:py-[60px]`}>
          <HomeProductStrip
            products={secondList}
            locale={locale}
            title={secondCategoryName}
            viewAllHref={categoryPath(locale, secondCategorySlug)}
            titleDisplayMode="raw"
          />
        </section>
      ) : null}

   {/* Stories popup grid 2 */}
   {showSecondStoriesSection && (
      <section className={`mx-auto w-full max-w-[1440px] py-16 min-[1440px]:py-[60px] px-[15px]`}>
          <HomeStoriesLightbox items={secondStoriesSectionData} />
        </section>
      )}

      {showProductCategorySection ? (
        <section
          id="categories-grid"
          className={`mx-auto w-full max-w-[1440px] space-y-[30px] pt-[30px] pb-[60px] min-[1440px]:pt-[60px] min-[1440px]:pb-[120px]`}
        >
          <HomeCategoryGridStrip
            categories={gridCategoryNodes}
            columns={gridCategoryColumns}
            locale={locale}
            title={gridSectionTitle}
            viewAllLabel={gridSectionButtonText}
            viewAllHref={gridSectionButtonUrl}
          />
        </section>
      ) : null}

      <ComparisonTable comparisonData={comparisonData} locale={locale} />

      <TestimonialsSection pt={0} pb={0} />
      
      <BeforeFooterSection />

    </div>
  );
}
