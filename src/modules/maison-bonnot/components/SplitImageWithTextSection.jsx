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
export function PassionSection({ title, description, subDescription, buttonTitle, buttonLink, leftImage, leftImageAlt }) {
  return (
      <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
        <div className="">
          <div className="grid auto-cols-fr [place-items:center_stretch] gap-14 min-[768px]:grid-cols-2 min-[768px]:gap-[88px] max-[767px]:!flex max-[767px]:!flex-col-reverse max-[767px]:gap-[56px]">
            <div className="flex flex-col items-start justify-start max-[479px]:w-full">
              <h2 className="m-0 mb-5 font-serif text-[36px] font-medium leading-[1.1] tracking-normal text-[#001122] min-[768px]:mb-6 min-[768px]:text-[61px]">
                {decodeAndCleanText(title)}
              </h2>

              <p className="m-0 mb-6 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[20px] font-medium leading-[1.5] tracking-normal text-[#001122]">
                {decodeAndCleanText(description)}
              </p>

              <p className="m-0 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] font-medium leading-[1.5] tracking-normal text-[#7e7067] min-[768px]:text-[18px]">
                    {decodeAndCleanText(subDescription)}
              </p>

              <Link
                href={buttonLink}
                className="group mt-8 flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#001122] px-[15px] py-2 border border-[rgba(0,17,34,0.2)] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122] min-[768px]:mt-[32px]"
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

            <img
              src={leftImage}
              className="order-0 inline-block h-auto max-h-[600px] w-full max-w-full place-self-center object-contain min-[768px]:order-[-1]"
              alt={leftImageAlt}
              loading="lazy"
            />
          </div>
        </div>
      </div>
  );
}
