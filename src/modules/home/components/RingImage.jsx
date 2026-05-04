import Image from "next/image";

/**
 * Floating jewelry ring for hero-style layouts. Absolute positioning + transforms come from `className`.
 */
export function RingImage({ src, alt = "", className = "" }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={100}
      height={100}
      sizes="(max-width: 399px) 52px, (max-width: 639px) 68px, (max-width: 1279px) 92px, 100px"
      className={`absolute z-[1] h-auto max-h-[100px] w-[52px] object-contain [will-change:transform] min-[400px]:w-[60px] min-[400px]:max-h-[90px] sm:w-[68px] sm:max-h-[95px] md:w-[80px] md:max-h-[100px] lg:w-[92px] xl:w-[100px]
        drop-shadow-[0_10px_26px_rgba(13,27,42,0.16)] drop-shadow-[0_4px_12px_rgba(13,27,42,0.07)]
        transition-transform duration-300 ease-out
        motion-safe:hover:z-20 motion-safe:hover:scale-105
        ${className}`.trim()}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}
