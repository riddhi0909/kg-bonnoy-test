  "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

function decodeAndCleanText(value) {
  return String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;|&#8217;|&#x2019;/gi, "'")
    .replace(/&lsquo;|&#8216;|&#x2018;/gi, "'")
    .replace(/&quot;|&#34;|&#x22;/gi, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
/**
 * @param {{
 *   title?: string;
 *   description?: string;
 *   steps?: Array<{
 *     number: string;
 *     title: string;
 *     subtitle: string;
 *     body: string;
 *     image: string;
 *     imageAlt?: string;
 *     buttonText?: string;
 *     buttonLink?: string;
 *   }>;
 * }} props
 */
export function ProcessingStepsSection({ title, description, steps: stepsProp }) {
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = useMemo(() => {
    return Array.isArray(stepsProp)
      ? stepsProp.filter((s) => s && (s.title || s.subtitle || s.body || s.image))
      : [];
  }, [stepsProp]);

  if (steps.length === 0) return null;

  const progressPct = useMemo(() => `${Math.max(0, Math.min(100, progress * 100))}%`, [progress]);

  useEffect(() => {
    stepRefs.current = [];
  }, [steps]);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const sectionTop = section.getBoundingClientRect().top + scrollY;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;

      if (scrollY <= sectionTop) {
        setActiveIndex(0);
        setProgress(0);
        return;
      }

      if (scrollY + windowHeight >= sectionBottom) {
        setActiveIndex(steps.length - 1);
        setProgress(1);
        return;
      }

      let nextActive = 0;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const elTop = el.getBoundingClientRect().top + scrollY;
        const top = elTop - windowHeight / 2;
        const bottom = top + el.offsetHeight;
        if (scrollY >= top && scrollY < bottom) nextActive = i;
      });
      setActiveIndex(nextActive);

      const denom = Math.max(1, sectionHeight - windowHeight);
      const raw = (scrollY - sectionTop) / denom;
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [steps]);

  const safeTitle = String(title ?? "").trim();
  const safeDescription = String(description ?? "").trim();

  return (
    <div ref={sectionRef} className="py-0">
      <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
        {(safeTitle || safeDescription) && (
          <div className="mb-12 max-w-[720px] min-[768px]:mb-16">
            {safeTitle && (
              <h2 className="m-0 mb-4 font-serif text-[36px] font-medium leading-[1.2] text-[#000d29] min-[768px]:text-[44px]">
                {safeTitle}
              </h2>
            )}
            {safeDescription && (
              <p className="m-0 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-medium leading-[1.5] text-[#000d29]">
                {safeDescription}
              </p>
            )}
          </div>
        )}
        <div className="relative grid grid-cols-1 min-[768px]:grid-cols-[.5fr_1fr]">
          <div className="sticky top-0 hidden min-h-screen items-center justify-start self-start pl-8 min-[768px]:flex">
            <div className="relative h-[380px] min-h-[380px] w-px max-w-[700px] overflow-hidden bg-[#9d9386]">
              <div className="absolute top-0 left-0 block w-px bg-[#ff6633] transition-all duration-500 ease-out" style={{ height: progressPct }} />
            </div>
            <div className="relative -left-[33px]">
              {steps.map((step, i) => {
                const stateClass = i === activeIndex ? "text-[#f63]" : i < activeIndex ? "text-[#9d9386]" : "text-[#9d9386]";
                return (
                  <div key={`${i}-${step.stepPrefix}`} className={`flex items-center justify-start gap-[26px] py-8 text-[14px] font-medium uppercase leading-[1.5] ${stateClass}`}>
                    <div className={`ml-[1px] flex h-16 w-16 items-center justify-center rounded-full border ${i === activeIndex ? "border-[#f63]" : "border-transparent"}`}>
                      <div className="relative left-[20.8px]">
                        <svg width="54" height="11" viewBox="0 0 54 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.856934" y="5.5" width="7.07107" height="7.07107" transform="rotate(-45 0.856934 5.5)" fill="currentColor" />
                          <rect width="48" height="1" transform="translate(6 5)" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                    <div className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[14px] font-medium tracking-normal">
                      {step.stepPrefix}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="">
            {steps.map((step, i) => {
              const imgAlt = String(step.imageAlt ?? "").trim() || "step block image";
              return (
              <div
                key={`${i}-${step.stepPrefix}-${step.title}`}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="static flex flex-col items-start justify-start gap-4 pt-16 pb-16 min-[768px]:pt-36 min-[768px]:pb-0"
              >
                <div className="flex max-w-[592px] flex-col items-start justify-start gap-4">
                  <div className="flex items-center justify-start gap-1 bg-[#ffd0a9] text-[#ff6633] px-2 py-2 text-[12px] font-medium uppercase leading-none">
                    <svg
                      id="Layer_1"
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 6 6"
                      className="h-[6px] w-auto shrink-0"
                      aria-hidden="true"
                    >
                      <rect
                        fill="currentColor"
                        x="1.79"
                        y="0.88"
                        width="4.24"
                        height="4.24"
                        transform="translate(-1.89 3.65) rotate(-45)"
                      ></rect>
                    </svg>
                    <div className="flex h-[15px] items-center justify-center [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[12px] font-medium uppercase leading-none text-[#ff6633]">
                   {step.stepPrefix}
                    </div>
                  </div>

                  {step.title ? (
                  <h2 className="m-0 font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#000d29] min-[768px]:text-[52px]">
                    {step.title}
                  </h2>
                  ) : null}

                  {step.subtitle ? (
                  <p className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-medium leading-[1.5] tracking-normal text-[#000d29]">
                    {decodeAndCleanText(step.subtitle)}
                  </p>
                  ) : null}

                  {step.body ? (
                  <p className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] font-normal leading-[1.5] tracking-normal text-[#000d29]">
                    {decodeAndCleanText(step.body)}
                  </p>
                  ) : null}
                  {
                    step.stepButton.url && (
                    
                      <Link
                      href={step.stepButton.url}
                      target={step.stepButton.target}
                      className="group mt-8 flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#001122] px-[15px] py-2 border border-[rgba(0,17,34,0.2)] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122]"
                    >
                      {step.stepButton.title}
                      <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path
                          d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                          stroke="currentColor"
                          strokeOpacity="0.85"
                          strokeMiterlimit="10"
                        />
                      </svg>
                    </Link>
                    )
                  }
                </div>

                {step.image ? (
                <img src={step.image} className="mt-[88px] inline-block h-auto w-full max-w-full" alt={imgAlt} loading="lazy" />
                ) : null}
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
