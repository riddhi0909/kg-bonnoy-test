"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { cn } from "@/modules/common/utils/cn";

import {
  GET_CATEGORY_REVIEWS_SETTINGS
} from "@/modules/cms/api/queries";

function decodeHtmlEntities(value) {
  const s = String(value || "");
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
    ndash: "-",
    mdash: "-",
    hellip: "...",
  };
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, code) => {
    if (!code) return m;
    if (code[0] === "#") {
      const isHex = code[1]?.toLowerCase() === "x";
      const n = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    const k = code.toLowerCase();
    return Object.prototype.hasOwnProperty.call(named, k) ? named[k] : m;
  });
}

function cleanReviewText(value) {
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeExplorerItems(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.nodes)) return raw.nodes;
  if (Array.isArray(raw?.edges)) return raw.edges.map((edge) => edge?.node).filter(Boolean);
  return [];
}

function mediaUrl(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return (
      value?.node?.sourceUrl ||
      value?.sourceUrl ||
      ""
    );
  }
  return "";
}
export async function fetchCategoryReviewsSettings(client) {
  const { data, errors } = await client.query({
    query: GET_CATEGORY_REVIEWS_SETTINGS,
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.themeSettings?.globalAcfFields ?? null;
}


/** Split reviews into two columns (same visual order as former 2-col grid: L=even, R=odd). */
function splitTestimonialsForColumns(items) {
  if (!items?.length) return [[], []];
  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);
  if (left.length && right.length) return [left, right];
  const mid = Math.ceil(items.length / 2);
  const l = items.slice(0, mid);
  const r = items.slice(mid);
  if (r.length === 0) return [items, items];
  return [l, r];
}

  function TestimonialCard({ item }) {
    return (
      <article className="flex shrink-0 flex-col gap-[90px] border border-transparent bg-[#f5eee5] p-[15px] transition-[border-color,box-shadow]">
        <div className="flex min-h-[135px] items-start justify-between gap-[15px]">
          <p className="font-serif text-[42px] leading-[1.19] text-[#001122]">5/5</p>
          {item.image ? (
            <div className="h-[135px] w-[135px] overflow-hidden bg-[#fffaf5]">
              <Image
                src={item.image}
                alt={item.name}
                width={135}
                height={135}
                sizes="135px"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <p className="font-serif text-[21px] leading-[1.19] text-[#001122] max-[767px]:text-[17px]">{item.name}</p>
          <div className="flex items-center gap-[15px]">
            <Image
              src="/figma/hp/star-rate.svg"
              alt="5 stars"
              width={58}
              height={10}
              sizes="58px"
              className="h-[10px] w-[58px]"
              loading="lazy"
            />
            <p className="text-[11px] leading-[1.36] text-[rgba(0,17,34,0.5)]">{item.date}</p>
          </div>
          <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">{item.text}</p>
        </div>
      </article>
    );
  }

export function TestimonialsSection({ pt, pb, className, categoryReviewsSectionData }) {
  const { data: categoryReviewsQueryData } = useQuery(GET_CATEGORY_REVIEWS_SETTINGS, {
    fetchPolicy: "cache-and-network",
  });
  const CategoryReviewsSectionData =
    categoryReviewsSectionData ??
    categoryReviewsQueryData?.themeSettings?.globalAcfFields ??
    null;

  const params = useParams();
  const localeParam = params?.locale;
  const locale = Array.isArray(localeParam) ? localeParam[0] : localeParam;
  const categoryBasePath = locale ? `/${locale}/category` : "/category";
  const mapProductCategoryUriToCategoryPath = (uri, slug) => {
    if (slug) return `${categoryBasePath}/${slug}`;
    const clean = String(uri || "").trim();
    if (!clean) return "";
    if (/^https?:\/\//i.test(clean)) return clean;
    const path = clean.startsWith("/") ? clean : `/${clean}`;
    const m = path.match(/^\/product-category\/(.+?)\/?$/i);
    if (m?.[1]) {
      const segments = m[1].split("/").filter(Boolean);
      const leaf = segments[segments.length - 1];
      if (leaf) return `${categoryBasePath}/${leaf}`;
    }
    return path;
  };
  const showSection =
    CategoryReviewsSectionData?.showCategoryReviewsSection !== false &&
    CategoryReviewsSectionData?.showCategoryReviewsSection !== "No";

  const testimonials = Array.isArray(CategoryReviewsSectionData?.reviews) && CategoryReviewsSectionData.reviews.length
    ? CategoryReviewsSectionData.reviews.map((item, index) => ({
        name: item?.reviewTitle || `Avis ${index + 1}`,
        date: item?.reviewDateText || "",
        text: cleanReviewText(item?.reviewDescription || ""),
        image: mediaUrl(item?.reviewImage),
      }))
    : [];

  const rawExplorer = normalizeExplorerItems(CategoryReviewsSectionData?.selectCategoryExplorer);
  const explorerLinks = rawExplorer.length
    ? rawExplorer
        .map((item, index) => {
          const slug = String(item?.slug || "").trim();
          const label = String(item?.name || item?.title || "").trim();
          const uri = String(item?.uri || "").trim();
          const href = mapProductCategoryUriToCategoryPath(uri, slug);
          return href && label ? { slug: slug || `explorer-${index}`, label, href } : null;
        })
        .filter(Boolean)
    : [];

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const mobileSliderRef = useRef(null);

  const canSlidePrev = activeTestimonial > 0;
  const canSlideNext = activeTestimonial < testimonials.length - 1;

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
      const bounded = Math.max(0, Math.min(index, testimonials.length - 1));
      setActiveTestimonial(bounded);
    };

    slider.addEventListener("scroll", syncActiveSlide, { passive: true });
    syncActiveSlide();

    return () => {
      slider.removeEventListener("scroll", syncActiveSlide);
    };
  }, [testimonials.length]);
  function spacingStep(value) {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "number") {
      return Number.isNaN(value) ? undefined : value;
    }
    if (typeof value === "string" && value.trim() !== "") {
      const n = Number(value);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  }
  const ptStep = spacingStep(pt);
  const pbStep = spacingStep(pb);

  const [columnLeft, columnRight] = splitTestimonialsForColumns(testimonials);

  const outerStyle = {};
  if (ptStep !== undefined) {
    outerStyle.paddingTop = ptStep === 0 ? "0px" : `${ptStep * 0.25}rem`;
  }
  if (pbStep !== undefined) {
    outerStyle.paddingBottom = `${pbStep * 0.25}rem`;
  }
  if (!showSection || testimonials.length === 0) return null;

  return (
    <div className={className} style={outerStyle}>
        <section className="mx-auto grid w-full min-[768px]:w-full max-w-[1440px] max-[767px]:w-full grid-cols-1 md:min-h-0 md:grid-cols-[50%_minmax(0,1fr)]">
          <div
            className="h-[650px] flex flex-col justify-end gap-[30px] bg-[#001122] bg-cover bg-center px-9 py-10 max-[767px]:px-[15px] md:h-auto md:max-h-[900px] md:px-[60px] md:py-[60px]"
            style={{
              backgroundImage: mediaUrl(CategoryReviewsSectionData?.reviewMainImage)
                ? `linear-gradient(180deg, rgba(0,17,34,0) 0%, rgba(0,17,34,0.40) 100%), url('${mediaUrl(CategoryReviewsSectionData?.reviewMainImage)}')`
                : undefined,
            }}
          >
            <p className="text-sm font-semibold leading-[1.428] text-white">Explorer</p>
            <nav className="grid gap-2 font-serif text-[21px] font-normal leading-[1.19]">
              {explorerLinks.map((item) => (
                <Link
                  key={item.slug}
                  href={item.href}
                  className="text-white/50 transition-colors hover:text-white max-[767px]:text-[17px] max-[767px]:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
  
          <div className="space-y-[30px] md:min-h-0 md:px-[20px] md:h-auto md:max-h-[900px]">
            <div className="max-[767px]:px-[15px] flex flex-col gap-[30px] pt-[60px] min-[768px]:max-[1023px]:gap-[20px] min-[768px]:max-[1023px]:py-[50px] lg:gap-[30px] lg:py-[100px]">
                <p className="font-serif text-[42px] leading-[1.19] text-[#001122] min-[768px]:max-[1200px]:text-[32px]">5/5</p>
              <h3 className="w-full min-[1024px]:w-[520px] font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122] max-[767px]:text-[17px]">
                  {CategoryReviewsSectionData?.reviewMainTitle || ""}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">
                    Excellent
                  </p>
                  <Image
                    src="/figma/hp/star-rate.svg"
                    alt="5 stars"
                    width={58}
                    height={10}
                    sizes="58px"
                    className="h-[10px] w-[58px]"
                    loading="lazy"
                  />
                  <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)] max-[767px]:basis-full [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                    Note basée sur 12 500 avis de clients
                  </p>
                </div>
            </div>
  
            <div className="md:hidden">
              <div
                ref={mobileSliderRef}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto pl-[15px] pr-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {testimonials.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="w-[calc(100%-72px)] shrink-0 snap-start first:pl-[15px] last:mr-[15px]">
                    <TestimonialCard item={item} />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-4 px-[15px]">
                <div className="h-px flex-1 bg-[rgba(0,17,34,0.25)]">
                  <span
                    className="block h-full bg-[rgba(0,17,34,1)] transition-[width] duration-300 ease-out"
                    style={{ width: `${((activeTestimonial + 1) / Math.max(testimonials.length, 1)) * 100}%` }}
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
  
            {/*
              Fixed row height + minmax(0,1fr): grid row must not size to the duplicated
              column content (transform does not shrink layout height), or nothing clips/marquees.
            */}
            <div className="hidden md:mt-[45px] md:grid md:h-[475px] md:min-h-0 md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] md:gap-5 md:overflow-hidden">
              <div className="bonnot-testimonials-marquee-column h-full min-h-0 overflow-hidden">
                <div className="bonnot-testimonials-marquee-track bonnot-testimonials-marquee-up flex w-full flex-col gap-5">
                  {[...columnLeft, ...columnLeft].map((item, index) => (
                    <TestimonialCard key={`L-${item.name}-${index}`} item={item} />
                  ))}
                </div>
              </div>
              <div className="bonnot-testimonials-marquee-column h-full min-h-0 overflow-hidden">
                <div className="bonnot-testimonials-marquee-track bonnot-testimonials-marquee-down flex w-full flex-col gap-5">
                  {[...columnRight, ...columnRight].map((item, index) => (
                    <TestimonialCard key={`R-${item.name}-${index}`} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
  );
}
  