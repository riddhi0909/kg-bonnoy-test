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

export function BonnotHouseParisSection({ image, imageAlt, title, description, highlightedText, buttonTitle, buttonLink }) {
  const safeImage = String(image ?? "").trim();
  const safeImageAlt = String(imageAlt ?? "").trim();


  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="py-[64px]">
        <div className="grid grid-cols-1 gap-0 bg-transparent min-[768px]:grid-cols-2 max-[768px]:flex max-[768px]:flex-col">
          <div className="relative z-0 mt-0 flex flex-col items-start justify-center gap-6 bg-[#fffbf4] bg-none px-0 py-8 pr-0 min-[768px]:mt-[60px] min-[768px]:pr-5 min-[768px]:py-0">
            <div className="absolute -z-[1] block h-[80%] w-[40vw] bg-[#faf5ef] max-[768px]:top-[-64px] max-[768px]:right-auto max-[768px]:bottom-auto max-[768px]:left-[-24px] min-[768px]:inset-y-0 min-[768px]:right-0 min-[768px]:left-auto min-[768px]:h-[130%] min-[768px]:w-[70vw]" />

            <h3 className="relative z-0 m-0 font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#000d29] min-[768px]:text-[48px]">
              {decodeAndCleanText(title)}
            </h3>

            <p className="relative z-0 m-0 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[20px] font-medium leading-[1.5] tracking-normal text-[#000d29] min-[768px]:text-[20px]">
              {decodeAndCleanText(description)}
            </p>

            <p className="relative z-0 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] font-normal leading-[1.5] tracking-normal text-[#7e7067] min-[768px]:text-[18px]">
              {decodeAndCleanText(highlightedText)}
            </p>

            <Link
              href={buttonLink || "#"}
              className="group flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#001122] px-[15px] py-2 border border-[rgba(0,17,34,0.2)] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122]"
            >
              {buttonTitle}
              <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path
                  d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                  stroke="currentColor"
                  strokeOpacity="0.85"
                  strokeMiterlimit="10"
                />
              </svg>
            </Link>
          </div>

          <div className="relative z-0">
            <div className="absolute inset-auto -right-6 -bottom-16 block h-[80%] w-[40vw] bg-[#f0e9e0] min-[768px]:inset-y-[-31.9vh] min-[768px]:right-0 min-[768px]:left-0 min-[768px]:h-[40vh] min-[768px]:w-[50vw]" />
            {safeImage ? (
              <img
                src={safeImage}
                className="relative h-[400px] w-full max-w-full object-cover object-[50%_0%] min-[768px]:h-[660px] min-[768px]:object-[100%_50%]"
                alt={safeImageAlt}
                width="650"
                height="790"
                loading="lazy"
              />
            ) : null}
              </div>
        </div>
      </div>
    </div>
  );
}
