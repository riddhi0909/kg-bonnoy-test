"use client";

import { useEffect, useRef, useState } from "react";

export function CustomMadeHeroSection({
  title1,
  title2,
  heroImage,
}) {
  const sectionRef = useRef(null);
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY;
      const raw = (scrollY - sectionTop) / sectionHeight;
      const progress = Math.max(0, Math.min(1, raw));
      setRevealProgress(progress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const maxMove = 50;
  const moveProgress =
    revealProgress <= 0 ? 0 : Math.min(1, 0.16 + revealProgress * 0.84);
  const leftShiftVw = (-moveProgress * maxMove).toFixed(4);
  const rightShiftVw = (moveProgress * maxMove).toFixed(4);
  const widthProgress =
    revealProgress <= 0 ? 0 : Math.min(1, 0.08 + revealProgress * 1.37);
  const boxWidthPercent = 63 + widthProgress * 37;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#fffbf4]"
    >
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-[1440px] items-end bg-cover bg-center bg-no-repeat max-[479px]:min-h-[100svh]"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div
          className="relative mx-auto mb-0 w-full overflow-hidden bg-[#fffbf4] px-[15px] py-[52px] transition-[width] duration-400 ease-out min-[768px]:px-[30px] min-[768px]:pt-[88px] min-[768px]:pb-[60px]"
          style={{ width: `${boxWidthPercent}%` }}
        >
          <div
            aria-hidden
            className="absolute top-0 left-[65%] z-[1] h-full w-[50vw] bg-[#fffbf4]"
            style={{ transform: `translate3d(calc(-65% + ${leftShiftVw}vw), 0px, 0px)` }}
          />
          <div
            aria-hidden
            className="absolute top-0 left-[35%] z-[1] h-full w-[50vw] bg-[#fffbf4]"
            style={{ transform: `translate3d(calc(-35% + ${rightShiftVw}vw), 0px, 0px)` }}
          />
          <h1 className="relative z-[2] whitespace-pre-line text-center font-serif text-[40px] font-medium leading-[1.1] text-[#001122] min-[768px]:text-[52px]">
            {title1}
            <br />
            {title2}
          </h1>
        </div>
      </div>
    </section>
  );
}
