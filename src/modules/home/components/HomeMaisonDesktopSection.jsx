"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { homePath, productsPath } from "@/constants/routes";
import { useMaisonHorizontalScrub } from "@/modules/home/hooks/useMaisonHorizontalScrub";

const HP = "/figma/hp";

const SECTION_BG = "#001122";
const SECTION_BG_RGB = "0, 11, 24";
const ACCENT = "#FF6633";
const BODY_MUTED = "rgba(255, 255, 255, 0.55)";

const MAISON_DESKTOP_MQ = "(max-width: 900px)";

/** SSR + first paint = mobile; then matchMedia before browser paint (avoids hydration mismatch). */
function useMaisonDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(MAISON_DESKTOP_MQ);
    setIsDesktop(mq.matches);
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

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

function SlideTextBlock({ kicker, title, children, ctaHref, ctaLabel, contentClassName }) {
  return (
    <div
      className={
        contentClassName ??
        "flex w-full flex-col justify-center gap-6 min-[900px]:w-1/2 min-[900px]:py-4 min-[900px]:pl-2 lg:h-full lg:w-[30%] lg:gap-[30px] lg:px-10 lg:py-0"
      }
    >
      <p
        className="text-sm font-semibold leading-[1.428] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
        style={{ color: ACCENT }}
      >
        {kicker}
      </p>
      <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] font-normal leading-tight text-white lg:text-[28px] lg:leading-[1.25]">
        {title}
      </h2>
      <div
        className="space-y-4 text-sm font-normal leading-[1.428] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
        style={{ color: BODY_MUTED }}
      >
        {children}
      </div>
      <SlideArrowLink href={ctaHref}>{ctaLabel}</SlideArrowLink>
    </div>
  );
}

const SLIDE_ARTICLE =
  "flex w-[min(92vw,1120px)] shrink-0 snap-start flex-col gap-8 min-[900px]:min-h-[min(72vh,640px)] min-[900px]:flex-row min-[900px]:items-stretch min-[900px]:gap-10 lg:w-full lg:max-w-[1440px] lg:items-stretch lg:gap-0";

/**
 * Desktop / tablet: pinned horizontal scrub (GSAP) or native overflow when reduced motion.
 *
 * @param {{ locale: string }} props
 */
function HomepageMaisonDesktop({ locale, brandStorySectionData }) {
  const home = homePath(locale);
  const products = productsPath(locale);
  const { sectionRef, viewportRef, trackRef, preferNativeScroll } = useMaisonHorizontalScrub();
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

  useEffect(() => {
    if (!preferNativeScroll) return;
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth + 1) return;
      if (e.ctrlKey) return;
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;

      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= el.clientHeight;

      el.scrollLeft += dy;
      e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [preferNativeScroll]);

  const viewportClass = preferNativeScroll
    ? "w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    : "w-full min-w-0 overflow-x-hidden overflow-y-hidden";

  return (
    <section
      ref={sectionRef}
      id="maison"
      className="relative w-full scroll-mt-4 py-0"
      style={{ backgroundColor: SECTION_BG }}
      aria-label="La Maison Bonnot Paris"
    >
      <div
        ref={viewportRef}
        className={viewportClass}
        style={preferNativeScroll ? { WebkitOverflowScrolling: "touch" } : undefined}
      >
        <div
          ref={trackRef}
          className="flex w-max min-w-full flex-row flex-nowrap gap-4 px-4 py-4 will-change-[transform] [transform:translateZ(0)] [backface-visibility:hidden] lg:w-1080 lg:gap-0 lg:px-0 lg:py-0"
        >
          <article className={SLIDE_ARTICLE}>
            <div className="relative min-h-[280px] w-full min-[900px]:aspect-square min-[900px]:min-h-0 min-[900px]:w-1/2 lg:aspect-4/3 lg:w-[75%] lg:shrink-0">
              <Image
                src={storyLeft?.storyLeftImage || `${HP}/hp-fabrication-section.png`}
                alt=""
                fill
                sizes="(max-width: 899px) 100vw, (max-width: 1279px) 50vw, 70vw"
                className="object-cover"
                loading="eager"
                priority
              />
            </div>
            <SlideTextBlock
              kicker={storyLeft?.storyLeftPrefix || "Fabrication artisanale"}
              title={storyLeft?.storyLeftTitle || "Des créations uniques qui perpétuent la tradition de l'artisanat joaillier français"}
              ctaHref={storyLeft?.storyLeftButtonLink || home}
              ctaLabel={storyLeft?.storyLeftButtonText || "La maison Bonnot Paris"}
            >
              {(leftParagraphs.length ? leftParagraphs : [
                "Chaque pièce est pensée et réalisée dans nos ateliers à Paris et Lyon, avec le même souci du détail qu'en haute joaillerie : proportions, sertissage et finitions.",
                "Du croquis à la livraison, nous accompagnons votre projet sur mesure pour donner vie à une création qui vous ressemble.",
              ]).map((paragraph, idx) => (
                <p key={`left-story-desktop-${idx}`}>{paragraph}</p>
              ))}
            </SlideTextBlock>
          </article>

          <article className={SLIDE_ARTICLE}>
            <div className="flex w-full shrink-0 gap-3 min-[900px]:aspect-square min-[900px]:w-1/2 min-[900px]:max-w-none lg:aspect-4/3 lg:w-[70%] lg:gap-[30px] lg:py-32.5">
              <div className="relative min-h-[280px] flex-1 min-[900px]:min-h-0">
                <Image
                  src={storyCenter?.storyCenterFirstImage || `${HP}/hp-fabrication-img-2.1.png`}
                  alt=""
                  fill
                  sizes="(max-width: 899px) 50vw, (max-width: 1279px) 25vw, 35vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="relative min-h-[280px] flex-1 min-[900px]:min-h-0">
                <Image
                  src={storyCenter?.storyCenterSecondImage || `${HP}/hp-fabrication-img-2.2.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 899px) 50vw, (max-width: 1279px) 25vw, 35vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <SlideTextBlock
              kicker={storyCenter?.storyCenterPrefix || "Sourcing et Savoir-faire"}
              title={storyCenter?.storyCenterTitle || "La première Maison de joaillerie française implantée au Sri Lanka, à Bangkok et à Jaipur"}
              ctaHref={storyCenter?.storyCenterButtonLink || home}
              ctaLabel={storyCenter?.storyCenterButtonText || "Les ateliers Bonnot Paris"}
              contentClassName="flex w-full flex-col justify-center gap-6 min-[900px]:w-1/2 min-[900px]:py-4 min-[900px]:pl-2 lg:h-full lg:w-[30%] lg:gap-5 lg:px-10 lg:py-0"
            >
              {(centerParagraphs.length
                ? centerParagraphs
                : ["Nos équipes sélectionnent les pierres au plus près des sources : pureté, couleur, taille et traçabilité — pour vous proposer des gemmes d'exception au prix le plus juste."]).map((paragraph, idx) => (
                <p key={`center-story-desktop-${idx}`}>{paragraph}</p>
              ))}
            </SlideTextBlock>
          </article>

          <article className={SLIDE_ARTICLE}>
            <div className="relative min-h-[280px] w-full min-[900px]:aspect-square min-[900px]:min-h-0 min-[900px]:w-1/2 lg:h-full lg:w-auto lg:aspect-square lg:shrink-0">
              <Image
                src={storyRight?.storyRightImage || `${HP}/hp-fabrication-img-3.jpg`}
                alt=""
                fill
                sizes="(max-width: 899px) 100vw, (max-width: 1279px) 50vw, 70vw"
                className="object-cover"
                loading="lazy"
              />
             
            </div>
            <SlideTextBlock
              kicker={storyRight?.storyRightPrefix || "Membre de l'ICA"}
              title={storyRight?.storyRightTitle || "Le seul joaillier français membre de l'Association internationale des négociants en pierres de couleur (ICA)"}
              ctaHref={storyRight?.storyRightButtonLink || products}
              ctaLabel={storyRight?.storyRightButtonText || "Les Pierres Bonnot Paris"}
            >
              {(rightParagraphs.length
                ? rightParagraphs
                : ["Cette affiliation témoigne de notre engagement envers l'éthique, la traçabilité et l'excellence dans le commerce des pierres de couleur — au service de votre confiance."]).map((paragraph, idx) => (
                <p key={`right-story-desktop-${idx}`}>{paragraph}</p>
              ))}
            </SlideTextBlock>
          </article>
        </div>
      </div>
    </section>
  );
}

/**
 * Maison — &lt;900px: vertical stack. ≥900px: horizontal scrub (GSAP) or native strip if reduced motion.
 *
 * @param {{ locale: string }} props
 */
export function HomeMaisonDesktopSection({ locale, brandStorySectionData }) {

  return <HomepageMaisonDesktop locale={locale} brandStorySectionData={brandStorySectionData} />;

  
}
