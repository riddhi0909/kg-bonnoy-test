import Image from "next/image";
import Link from "next/link";
import { homePath, productsPath } from "@/constants/routes";

const HP = "/figma/hp";

const SECTION_BG = "#000B1C";
const ACCENT = "#E84A36";
const BODY_MUTED = "rgba(255, 255, 255, 0.65)";
  
function SlideArrowLink({ children, href }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 text-sm font-semibold leading-snug text-white transition-opacity hover:opacity-90"
    >
      <span>{children}</span>
      <span className="inline-block h-2.5 w-2.5 shrink-0 rotate-45 border-r border-t border-white" aria-hidden />
    </Link>
  );
}

/**
 * Full-bleed horizontal scroll: three wide panels (craftsmanship, sourcing, ICA).
 * @param {{ locale: string }} props
 */
export function HomeMaisonHorizontalSection({ locale }) {
  const home = homePath(locale);
  const products = productsPath(locale);

  return (
    <section
      id="maison"
      className="relative w-full scroll-mt-4 py-0"
      style={{ backgroundColor: SECTION_BG }}
      aria-label="La Maison Bonnot Paris"
    >
      <div
        className="w-full overflow-x-auto scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Desktop track is intentionally extra wide to match Figma's horizontal journey. */}
        <div className="flex w-max min-w-full snap-x snap-mandatory gap-4 px-4 py-4 min-[1280px]:w-[4080px] min-[1280px]:gap-0 min-[1280px]:px-0 min-[1280px]:py-0">
        {/* Slide 1 — Fabrication */}
        <article
          className="flex w-[min(92vw,1120px)] shrink-0 snap-start flex-col gap-8 min-[900px]:min-h-[min(72vh,640px)] min-[900px]:flex-row min-[900px]:items-stretch min-[900px]:gap-10 min-[1280px]:h-[420px] min-[1280px]:w-[1360px] min-[1280px]:items-stretch min-[1280px]:gap-0"
        >
          <div className="relative min-h-[280px] w-full min-[900px]:min-h-0 min-[900px]:w-1/2 min-[1280px]:h-full min-[1280px]:w-[680px] min-[1280px]:shrink-0">
            <Image
              src={`${HP}/hp-fabrication-section.png`}
              alt=""
              fill
              sizes="(max-width: 899px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex w-full flex-col justify-center gap-6 min-[900px]:w-1/2 min-[900px]:py-4 min-[900px]:pl-2 min-[1280px]:h-full min-[1280px]:w-[680px] min-[1280px]:gap-5 min-[1280px]:px-[56px] min-[1280px]:py-0">
            <p className="text-sm font-semibold leading-[1.428]" style={{ color: ACCENT }}>
              Fabrication artisanale
            </p>
            <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] font-normal leading-tight text-white min-[1280px]:text-[28px] min-[1280px]:leading-[1.25]">
              Des créations uniques qui perpétuent la tradition de l&apos;artisanat joaillier français
            </h2>
            <div className="space-y-4 text-sm font-normal leading-[1.428]" style={{ color: BODY_MUTED }}>
              <p>
                Chaque pièce est pensée et réalisée dans nos ateliers à Paris et Lyon, avec le même souci du détail
                qu&apos;en haute joaillerie : proportions, sertissage et finitions.
              </p>
              <p>
                Du croquis à la livraison, nous accompagnons votre projet sur mesure pour donner vie à une création qui
                vous ressemble.
              </p>
            </div>
            <SlideArrowLink href={products}>Le sur-mesure Bonnot Paris</SlideArrowLink>
          </div>
        </article>

        {/* Slide 2 — Sourcing (two images) */}
        <article
          className="flex w-[min(92vw,1120px)] shrink-0 snap-start flex-col gap-8 min-[900px]:min-h-[min(72vh,640px)] min-[900px]:flex-row min-[900px]:items-stretch min-[900px]:gap-10 min-[1280px]:h-[420px] min-[1280px]:w-[1360px] min-[1280px]:items-stretch min-[1280px]:gap-0"
        >
          <div className="flex w-full shrink-0 gap-3 min-[900px]:w-[46%] min-[900px]:max-w-none min-[1280px]:h-full min-[1280px]:w-[680px] min-[1280px]:gap-0">
            <div className="relative min-h-[280px] flex-1 min-[900px]:min-h-0">
              <Image
                src={`${HP}/hp-fabrication-img-2.1.jpg`}
                alt=""
                fill
                sizes="(max-width: 899px) 50vw, 25vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative min-h-[280px] flex-1 min-[900px]:min-h-0">
              <Image
                src={`${HP}/hp-fabrication-img-2.2.jpg`}
                alt=""
                fill
                sizes="(max-width: 899px) 50vw, 25vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex w-full flex-col justify-center gap-6 min-[900px]:w-[54%] min-[900px]:py-4 min-[900px]:pl-2 min-[1280px]:h-full min-[1280px]:w-[680px] min-[1280px]:gap-5 min-[1280px]:px-[56px] min-[1280px]:py-0">
            <p className="text-sm font-semibold leading-[1.428]" style={{ color: ACCENT }}>
              Sourcing en direct
            </p>
            <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] font-normal leading-tight text-white min-[1280px]:text-[28px] min-[1280px]:leading-[1.25]">
              La première Maison de joaillerie française implantée au Sri Lanka, à Bangkok et à Jaipur
            </h2>
            <p className="text-sm font-normal leading-[1.428]" style={{ color: BODY_MUTED }}>
              Nos équipes sélectionnent les pierres au plus près des sources : pureté, couleur, taille et traçabilité —
              pour vous proposer des gemmes d&apos;exception au prix le plus juste.
            </p>
            <SlideArrowLink href={home}>Le sourcing Bonnot Paris</SlideArrowLink>
          </div>
        </article>

        {/* Slide 3 — ICA */}
        <article
          className="flex w-[min(92vw,1120px)] shrink-0 snap-start flex-col gap-8 min-[900px]:min-h-[min(72vh,640px)] min-[900px]:flex-row min-[900px]:items-stretch min-[900px]:gap-10 min-[1280px]:h-[420px] min-[1280px]:w-[1360px] min-[1280px]:items-stretch min-[1280px]:gap-0"
        >
          <div className="relative min-h-[280px] w-full min-[900px]:min-h-0 min-[900px]:w-1/2 min-[1280px]:h-full min-[1280px]:w-[680px] min-[1280px]:shrink-0">
            <Image
              src={`${HP}/hp-fabrication-img-3.jpg`}
              alt=""
              fill
              sizes="(max-width: 899px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div
              className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center border border-white/20 bg-[#000B1C]/90 text-[10px] font-bold uppercase leading-tight text-white backdrop-blur-sm"
              aria-label="Membre ICA"
            >
              ICA
            </div>
          </div>
          <div className="flex w-full flex-col justify-center gap-6 min-[900px]:w-1/2 min-[900px]:py-4 min-[900px]:pl-2 min-[1280px]:h-full min-[1280px]:w-[680px] min-[1280px]:gap-5 min-[1280px]:px-[56px] min-[1280px]:py-0">
            <p className="text-sm font-semibold leading-[1.428]" style={{ color: ACCENT }}>
              Membre de l&apos;ICA
            </p>
            <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] font-normal leading-tight text-white min-[1280px]:text-[28px] min-[1280px]:leading-[1.25]">
              Le seul joaillier français membre de l&apos;Association internationale des négociants en pierres de couleur
              (ICA)
            </h2>
            <p className="text-sm font-normal leading-[1.428]" style={{ color: BODY_MUTED }}>
              Cette affiliation témoigne de notre engagement envers l&apos;éthique, la traçabilité et l&apos;excellence
              dans le commerce des pierres de couleur — au service de votre confiance.
            </p>
            <SlideArrowLink href={home}>La Maison Bonnot Paris</SlideArrowLink>
          </div>
        </article>
        </div>
      </div>
    </section>
  );
}
