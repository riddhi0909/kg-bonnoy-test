"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/modules/common/utils/cn";

const KEYWORDS = [
  {
    title: "Sans intermédiaire",
    body: "Des pierres précieuses d'exception à des prix justes et transparents.",
  },
  {
    title: "Pierre naturelle",
    body: "Nos gemmes uniques reflètent la pureté et l'élégance de la nature.",
  },
  {
    title: "Livrée avec certificat",
    body: "Exclusivement par des laboratoires indépendants renommés.",
  },
];

const FAQ_ITEMS = [
  {
    title: "Expertise en joaillerie française",
    body: "Notre équipe maîtrise la sélection de pierres et la conception sur mesure, avec un accompagnement personnalisé à chaque étape.",
  },
  {
    title: "Gemmes rares et exclusives",
    body: "Nous sourçons des pierres d'exception grâce à notre réseau de négociants certifiés, pour des pièces souvent introuvables ailleurs.",
  },
  {
    title: "Bijoux sur mesure",
    body: "De l'esquisse à la livraison, nous créons des bijoux uniques adaptés à votre pierre et à votre style.",
  },
];

const TESTIMONIALS = [
  {
    name: "Pauline P.",
    date: "Il y a 2 mois",
    text: "Nous avons été extrêmement bien conseillés par Bastien. Il a su être réactif, à l'écoute, et surtout a pu nous expliquer tout le fonctionnement de Bonnot et de la filière.",
    image: "/figma/testimonial-1.png",
  },
  {
    name: "Barthelemy G.",
    date: "Il y a 2 mois",
    text: "Bonnot Paris nous a permis de réaliser une bague qui correspondait parfaitement à nos attentes. Bastien nous a accompagnés avec de précieux conseils et explications.",
  },
  {
    name: "Pauline P.",
    date: "Il y a 2 mois",
    text: "Nous avons été extrêmement bien conseillés par Bastien. Il a su être réactif, à l'écoute, et surtout a pu nous expliquer tout le fonctionnement de Bonnot et de la filière.",
  },
  {
    name: "Pauline P.",
    date: "Il y a 2 mois",
    text: "Nous avons été extrêmement bien conseillés par Bastien. Il a su être réactif, à l'écoute, et surtout a pu nous expliquer tout le fonctionnement de Bonnot et de la filière.",
    image: "/figma/testimonial-2.png",
  },
];

const EXPLORER_LINKS = [
  { label: "Pierres précieuses", slug: "pierres-precieuses" },
  { label: "Sourcing", slug: "sourcing" },
  { label: "Joaillerie", slug: "joaillerie" },
  { label: "Sur mesure", slug: "sur-mesure" },
  { label: "Réalisations", slug: "realisations" },
  { label: "Maison Bonnot Paris", slug: "maison-bonnot-paris" },
  { label: "Showroom", slug: "showroom" },
];

function TestimonialCard({ item }) {
  return (
    <article className="flex h-full flex-col gap-[50px] border border-transparent bg-[#f5eee5] p-[15px] transition-[border-color,box-shadow]">
      <div className="flex min-h-[135px] items-start justify-between">
        <p className="font-serif text-[42px] leading-[1.19] text-[#001122]">5/5</p>
        {item.image ? (
          <div className="h-[135px] w-[135px] overflow-hidden bg-[#fffaf5]">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
          </div>
        ) : null}
      </div>
      <div className="space-y-2">
        <p className="font-serif text-[21px] leading-[1.19] text-[#001122] max-[767px]:text-[17px]">{item.name}</p>
        <div className="flex items-center gap-[6px]">
          <img src="/figma/hp/star-rate.svg" alt="5 stars" className="h-[10px] w-[58px]" loading="lazy" />
          <p className="text-[11px] leading-[1.36] text-[rgba(0,17,34,0.5)]">{item.date}</p>
        </div>
        <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">{item.text}</p>
      </div>
    </article>
  );
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#001122]" aria-hidden="true">
      <path d="M24 3l14 14-14 28L10 17 24 3z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 17h28M17 10l7 35m7-35L24 45" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" className={cn("h-3 w-3 shrink-0 text-[#001122]", className)} aria-hidden="true">
      <path d="M6 1v10M1 6h10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CategoryFaqAccordion() {
  const [openKeys, setOpenKeys] = useState(() => new Set());

  const toggle = useCallback((key) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <div className="border-t border-[rgba(0,17,34,0.2)]">
      {FAQ_ITEMS.map((item) => {
        const isOpen = openKeys.has(item.title);
        return (
          <div key={item.title} className="border-b border-[rgba(0,17,34,0.2)]">
            <button
              type="button"
              onClick={() => toggle(item.title)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-[30px] pl-1 pr-2 text-left transition-colors hover:bg-[rgba(0,17,34,0.04)] min-[1440px]:-mx-1 min-[1440px]:rounded-sm min-[1440px]:px-3"
            >
              <span className="font-serif text-[21px] font-normal leading-[1.19] text-[#001122]">
                {item.title}
              </span>
              <PlusIcon
                className={cn("transition-transform duration-200 ease-out", isOpen && "rotate-45")}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="pb-[30px] pr-4 text-sm font-normal leading-[1.428] text-[rgba(0,17,34,0.75)] min-[1440px]:pr-8">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CategoryBottomSections() {
  const params = useParams();
  const localeParam = params?.locale;
  const locale = Array.isArray(localeParam) ? localeParam[0] : localeParam;
  const categoryBasePath = locale ? `/${locale}/category` : "/category";

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const mobileSliderRef = useRef(null);

  const canSlidePrev = activeTestimonial > 0;
  const canSlideNext = activeTestimonial < TESTIMONIALS.length - 1;

  const handleSlidePrev = useCallback(() => {
    const slider = mobileSliderRef.current;
    if (!slider) return;
    const firstCard = slider.children[0];
    const step = (firstCard?.clientWidth || 0) + 12;
    slider.scrollBy({ left: -step, behavior: "smooth" });
  }, []);

  const handleSlideNext = useCallback(() => {
    const slider = mobileSliderRef.current;
    if (!slider) return;
    const firstCard = slider.children[0];
    const step = (firstCard?.clientWidth || 0) + 12;
    slider.scrollBy({ left: step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const slider = mobileSliderRef.current;
    if (!slider) return;

    const syncActiveSlide = () => {
      const firstCard = slider.children[0];
      const step = (firstCard?.clientWidth || 0) + 12;
      if (!step) return;
      const index = Math.round(slider.scrollLeft / step);
      const bounded = Math.max(0, Math.min(index, TESTIMONIALS.length - 1));
      setActiveTestimonial(bounded);
    };

    slider.addEventListener("scroll", syncActiveSlide, { passive: true });
    syncActiveSlide();

    return () => {
      slider.removeEventListener("scroll", syncActiveSlide);
    };
  }, []);

  return (
    <div className="mt-[60px] md:mt-[120px]">
      <section className="px-4 pb-14 md:px-[60px] md:pb-[120px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-[30px]">
          {KEYWORDS.map((item) => (
            <article
              key={item.title}
              className="border-l border-[rgba(0,17,34,0.2)] pl-[15px] pr-4 transition-colors hover:border-[#001122]"
            >
              <div className="space-y-[30px]">
                <DiamondIcon />
                <h2 className="font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122]">
                  {item.title}
                </h2>
                <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 bg-[#001122] md:grid-cols-[1fr_2fr] md:pl-[60px]">
        <div className="flex flex-col justify-center gap-[30px] p-6 md:p-0 md:pr-4">
          <p className="text-sm font-semibold leading-[1.428] text-[#ff6633]">Sourcing d'exception</p>
          <h3 className="font-serif text-[28px] font-normal leading-[1.25] text-white">
            Notre réseau mondial nous permet de répondre à toutes vos demandes de pierres traditionnelles ou rares
          </h3>
          <p className="text-sm leading-[1.428] text-white/75">
            Chez Bonnot Paris, chaque pierre est sélectionnée pour sa rareté, sa clarté et son éthique, garantissant
            traçabilité, qualité exceptionnelle et prix justes.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 text-sm font-semibold leading-[1.428] text-white/75 transition-colors hover:text-white"
          >
            Le sourcing Bonnot Paris <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="h-[320px] md:h-[620px]">
          <img src="/figma/bottom-sourcing.png" alt="Sourcing" className="h-full w-full object-cover" loading="lazy" />
        </div>
      </section>

      <section className="px-4 py-14 md:px-[60px] md:py-[120px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[315px_1fr] md:gap-5">
          <div className="py-2 md:py-[30px]">
            <h3 className="font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122]">FAQ</h3>
          </div>
          <CategoryFaqAccordion />
        </div>
      </section>

      <section className="mx-auto grid w-full min-[768px]:w-full max-w-[1440px] max-[767px]:w-full grid-cols-1 pb-16 md:grid-cols-[50%_minmax(0,1fr)] md:pb-[120px]">
        <div
          className="h-[520px] flex flex-col justify-end gap-[30px] bg-[#001122] bg-cover bg-center px-9 py-10 max-[767px]:px-[15px] md:h-auto md:max-h-[900px] md:px-[60px] md:py-[60px]"
          style={{ backgroundImage: "url('/figma/sitemap-bg.png')" }}
        >
          <p className="text-sm font-semibold leading-[1.428] text-white">Explorer</p>
          <nav className="grid gap-2 font-serif text-[21px] font-normal leading-[1.19]">
            {EXPLORER_LINKS.map((item) => (
              <Link
                key={item.slug}
                href={`${categoryBasePath}/${item.slug}`}
                className="text-white/50 transition-colors hover:text-white max-[767px]:text-[17px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-[30px] md:px-[20px] md:h-auto md:max-h-[900px] md:overflow-hidden ">
          <div className="max-[767px]:px-[15px] flex flex-col gap-[30px] pt-[60px] min-[768px]:max-[1023px]:gap-[20px] min-[768px]:max-[1023px]:py-[50px] lg:gap-[30px] lg:py-[100px]">
              <p className="font-serif text-[42px] leading-[1.19] text-[#001122] min-[768px]:max-[1200px]:text-[32px]">5/5</p>
            <h3 className="w-full min-[1024px]:w-[520px] font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122] max-[767px]:text-[17px]">
                Des milliers de clients dans le monde nous font confiance
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">
                  Excellent
                </p>
                <img
                  src="/figma/hp/star-rate.svg"
                  alt="5 stars"
                  className="h-[10px] w-[58px]"
                  loading="lazy"
                />
                <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)] max-[767px]:basis-full">
                  Note basée sur 12 500 avis de clients
                </p>
              </div>
          </div>

          <div className="md:hidden">
            <div
              ref={mobileSliderRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto pl-[15px] pr-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {TESTIMONIALS.map((item, index) => (
                <div key={`${item.name}-${index}`} className="w-[calc(100%-72px)] shrink-0 snap-start first:pl-[15px] last:mr-[15px]">
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-4 px-[15px]">
              <div className="h-px flex-1 bg-[rgba(0,17,34,0.25)]">
                <span
                  className="block h-full bg-[rgba(0,17,34,1)] transition-[width] duration-300 ease-out"
                  style={{ width: `${((activeTestimonial + 1) / Math.max(TESTIMONIALS.length, 1)) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Previous review"
                  disabled={!canSlidePrev}
                  onClick={handleSlidePrev}
                  className={cn(
                    "px-1 text-[28px] leading-none transition-colors",
                    canSlidePrev
                      ? "text-[rgba(0,17,34,0.7)] hover:text-[#001122]"
                      : "cursor-not-allowed text-[rgba(0,17,34,0.25)]",
                  )}
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  aria-label="Next review"
                  disabled={!canSlideNext}
                  onClick={handleSlideNext}
                  className={cn(
                    "px-1 text-[28px] leading-none transition-colors",
                    canSlideNext
                      ? "text-[rgba(0,17,34,0.7)] hover:text-[#001122]"
                      : "cursor-not-allowed text-[rgba(0,17,34,0.25)]",
                  )}
                >
                  &#8250;
                </button>
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-1 gap-5 md:mt-[45px] md:grid md:grid-cols-2">
            {TESTIMONIALS.map((item, index) => (
              <TestimonialCard key={`${item.name}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-[60px] md:pb-[120px]">
        <div className="mx-auto max-w-[690px] space-y-[30px] text-center">
          <h3 className="font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122]">
            Rejoignez la communauté Bonnot Paris et partageons notre passion pour les bijoux d'exception
          </h3>
          <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">
            Suivez-nous sur les réseaux pour découvrir nos dernières créations, les coulisses de notre atelier et des
            aperçus exclusifs de nos pierres précieuses uniques.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-[30px] gap-y-2 text-sm font-semibold leading-[1.428]">
            <a href="#" className="text-[#001122] transition-colors hover:text-[#ff6633]">
              Instagram ↗
            </a>
            <a href="#" className="text-[#001122] transition-colors hover:text-[#ff6633]">
              Youtube ↗
            </a>
            <a href="#" className="text-[#001122] transition-colors hover:text-[#ff6633]">
              Linkedin ↗
            </a>
          </div>
        </div>

        <div className="mt-[30px] grid grid-cols-2 gap-3 md:grid-cols-7 md:gap-[30px]">
          <img src="/figma/social-1.png" alt="Social 1" className="h-[220px] w-full object-cover md:h-[240px]" loading="lazy" />
          <img src="/figma/social-2.png" alt="Social 2" className="h-[220px] w-full object-cover md:h-[320px]" loading="lazy" />
          <img src="/figma/social-3.png" alt="Social 3" className="h-[220px] w-full object-cover md:h-[240px]" loading="lazy" />
          <img src="/figma/social-4.png" alt="Social 4" className="h-[220px] w-full object-cover md:h-[320px]" loading="lazy" />
          <img src="/figma/social-5.png" alt="Social 5" className="h-[220px] w-full object-cover md:h-[240px]" loading="lazy" />
          <img src="/figma/social-6.png" alt="Social 6" className="h-[220px] w-full object-cover md:h-[320px]" loading="lazy" />
          <img src="/figma/social-7.png" alt="Social 7" className="h-[220px] w-full object-cover md:h-[240px]" loading="lazy" />
        </div>
      </section>
    </div>
  );
}
