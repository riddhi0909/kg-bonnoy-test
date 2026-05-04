"use client";

import Image from "next/image";
import Link from "next/link";
import { homePath, productsPath } from "@/constants/routes";

const HP = "/figma/hp";

const SECTION_BG = "#001122";
const SECTION_BG_RGB = "0, 11, 24";
const ACCENT = "#FF6633";
const BODY_MUTED = "rgba(255, 255, 255, 0.55)";

function SlideArrowLink({ children, href }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-[15px] text-sm font-semibold leading-[1.428] text-white transition-opacity hover:opacity-90 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
      
    >
      <span>{children}</span>
      <svg
        className="relative top-px shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
          stroke="white"
          strokeOpacity="0.9"
          strokeMiterlimit="10"
        />
      </svg>
    </Link>
  );
}

const MOBILE_TEXT_BLOCK =
  "flex w-full flex-col gap-5 px-4 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]";

/**
 * Vertical stack — same three stories as desktop; no horizontal scrub (matches mobile design).
 *
 * @param {{ locale: string }} props
 */
function HomepageMaisonMobile({ locale, brandStorySectionData }) {
  const home = homePath(locale);
  const products = productsPath(locale);
  const storyLeft = brandStorySectionData?.storyLeftCard || null;
  const storyCenter = brandStorySectionData?.storyCenterCard || null;
  const storyRight = brandStorySectionData?.storyRightCard || null;
  const leftDescription = String(storyLeft?.storyLeftDescription || "");
  const centerDescription = String(storyCenter?.storyCenterDescription || "");
  const rightDescription = String(storyRight?.storyRightDescription || "");
  const leftParagraphs = leftDescription
    .split(/\r?\n\r?\n/g)
    .map((part) => part.trim())
    .filter(Boolean);
  const centerParagraphs = centerDescription
    .split(/\r?\n\r?\n/g)
    .map((part) => part.trim())
    .filter(Boolean);
  const rightParagraphs = rightDescription
    .split(/\r?\n\r?\n/g)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section
      id="maison"
      className="relative w-full scroll-mt-4 py-10"
      style={{ backgroundColor: SECTION_BG }}
      aria-label="La Maison Bonnot Paris"
    >
      <div className="mx-auto w-full max-w-[1440px] space-y-14 pb-4">
        {/* Block 1 — image → text */}
        <article className="flex flex-col gap-8">
          <div className="relative aspect-4/3 w-full overflow-hidden">
            <Image
              src={storyLeft?.storyLeftImage || `${HP}/hp-main-thumb1.png`}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className={MOBILE_TEXT_BLOCK}>
            <p className="text-sm font-semibold leading-[1.428]" style={{ color: ACCENT }}>
              {storyLeft?.storyLeftPrefix || "Fabrication artisanale"}
            </p>
            <h2 className="font-serif text-[1.375rem] font-normal leading-tight text-white min-[480px]:text-[1.5rem]">
              {storyLeft?.storyLeftTitle || "Des créations uniques qui perpétuent la tradition de l'artisanat joaillier français"}
            </h2>
            <div className="space-y-4 text-sm font-normal leading-[1.428]" style={{ color: BODY_MUTED }}>
              {(leftParagraphs.length ? leftParagraphs : [
                "Chaque pièce est pensée et réalisée dans nos ateliers à Paris et Lyon, avec le même souci du détail qu'en haute joaillerie : proportions, sertissage et finitions.",
                "Du croquis à la livraison, nous accompagnons votre projet sur mesure pour donner vie à une création qui vous ressemble.",
              ]).map((paragraph, idx) => (
                <p key={`left-story-mobile-${idx}`}>{paragraph}</p>
              ))}
            </div>
            <SlideArrowLink href={storyLeft?.storyLeftButtonLink || home}>
              {storyLeft?.storyLeftButtonText || "La maison Bonnot Paris"}
            </SlideArrowLink>
          </div>
        </article>

        {/* Block 2 — two portrait images → text */}
        <article className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-2 px-4 sm:gap-3">
            <div className="relative aspect-3/4 overflow-hidden rounded-sm">
              <Image
                src={storyCenter?.storyCenterFirstImage || `${HP}/hp-fabrication-img-2.1.png`}
                alt=""
                fill
                sizes="50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-sm">
              <Image
                src={storyCenter?.storyCenterSecondImage || `${HP}/hp-fabrication-img-2.2.jpg`}
                alt=""
                fill
                sizes="50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className={MOBILE_TEXT_BLOCK}>
            <p className="text-sm font-semibold leading-[1.428]" style={{ color: ACCENT }}>
              {storyCenter?.storyCenterPrefix || "Sourcing en direct"}
            </p>
            <h2 className="font-serif text-[1.375rem] font-normal leading-tight text-white min-[480px]:text-[1.5rem]">
              {storyCenter?.storyCenterTitle || "La première Maison de joaillerie française implantée au Sri Lanka, à Bangkok et à Jaïpur"}
            </h2>
            <div className="space-y-4 text-sm font-normal leading-[1.428]" style={{ color: BODY_MUTED }}>
              {(centerParagraphs.length
                ? centerParagraphs
                : ["Chez Bonnot Paris, chaque pierre est sélectionnée pour sa rareté, sa clarté et son éthique, garantissant traçabilité, qualité exceptionnelle et prix justes."]).map((paragraph, idx) => (
                <p key={`center-story-mobile-${idx}`}>{paragraph}</p>
              ))}
            </div>
            <SlideArrowLink href={storyCenter?.storyCenterButtonLink || home}>
              {storyCenter?.storyCenterButtonText || "Le sourcing Bonnot Paris"}
            </SlideArrowLink>
          </div>
        </article>

        {/* Block 3 — full-width image (with ICA badge) → text */}
        <article className="flex flex-col gap-8">
          <div className="relative aspect-4/3 w-full overflow-hidden">
            <Image
              src={storyRight?.storyRightImage || `${HP}/hp-fabrication-img-3.jpg`}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              loading="lazy"
            />
           
          </div>
          <div className={MOBILE_TEXT_BLOCK}>
            <p className="text-sm font-semibold leading-[1.428]" style={{ color: ACCENT }}>
              {storyRight?.storyRightPrefix || "Sourcing d’exception"}
            </p>
            <h2 className="font-serif text-[1.375rem] font-normal leading-tight text-white min-[480px]:text-[1.5rem]">
              {storyRight?.storyRightTitle || "Le seul joaillier français membre de l’association internationale des négociants en pierres de couleur (ICA)"}
            </h2>
            <div className="space-y-4 text-sm font-normal leading-[1.428]" style={{ color: BODY_MUTED }}>
              {(rightParagraphs.length
                ? rightParagraphs
                : ["Témoignant notre expertise et notre engagement envers les pierres de couleur, cette affiliation nous permet de nouer des relations durables avec nos fournisseurs lapidaires et nos ateliers, nous garantissant ainsi une qualité de pierre irréprochable."]).map((paragraph, idx) => (
                <p key={`right-story-mobile-${idx}`}>{paragraph}</p>
              ))}
            </div>
            <SlideArrowLink href={storyRight?.storyRightButtonLink || products}>
              {storyRight?.storyRightButtonText || "La Maison Bonnot Paris"}
            </SlideArrowLink>
          </div>
        </article>
      </div>
    </section>
  );
}


/**
 * Maison — &lt;900px: vertical stack. ≥900px: horizontal scrub (GSAP) or native strip if reduced motion.
 *
 * @param {{ locale: string }} props
 */
export function HomeMaisonMobileSection({ locale, brandStorySectionData }) {
 
    return <HomepageMaisonMobile locale={locale} brandStorySectionData={brandStorySectionData} />;
  
}
