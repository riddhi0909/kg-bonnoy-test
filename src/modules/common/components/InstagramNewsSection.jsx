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
export function InstagramNewsSection({
  title,
  description,
  subHeading,
  buttonTitle,
  buttonLink, 
  image,
  imageAlt,
  imageMobile,
  imageMobileAlt,
}) {
  const imageSrc = String(image ?? "").trim();
  const imageMobileSrc = String(imageMobile ?? "").trim();
  const safeButtonLink = String(buttonLink ?? "").trim();
  return (

    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="">
        <div className="grid grid-cols-1 gap-10 min-[992px]:grid-cols-[.75fr_1fr]">
          <div className="self-center flex flex-col items-start justify-start gap-8">
            <h2 className="m-0 p-0 font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#001122] min-[768px]:text-[52px]">
              {decodeAndCleanText(title)}
            </h2>

            <p className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-medium leading-[1.5] tracking-normal text-[#001122]">
             {decodeAndCleanText(subHeading)}
            </p>

            <p className="m-0 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] font-normal leading-[1.5] tracking-normal text-[#001122]">
          
              {decodeAndCleanText(description)}
            </p>

            {safeButtonLink && buttonTitle && (
            <Link
              href={safeButtonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[232px] items-center justify-start gap-0 border border-[#00112233] bg-[#001122] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-transparent hover:text-[#001122] max-[479px]:w-full gap-[6px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 11" fill="none">
                <path d="M5.85476 2.88955C4.34098 2.88955 3.11996 4.11057 3.11996 5.62435C3.11996 7.13813 4.34098 8.35915 5.85476 8.35915C7.36854 8.35915 8.58956 7.13813 8.58956 5.62435C8.58956 4.11057 7.36854 2.88955 5.85476 2.88955ZM5.85476 7.40232C4.87651 7.40232 4.07678 6.60497 4.07678 5.62435C4.07678 4.64372 4.87413 3.84637 5.85476 3.84637C6.83538 3.84637 7.63273 4.64372 7.63273 5.62435C7.63273 6.60497 6.833 7.40232 5.85476 7.40232ZM9.33931 2.77768C9.33931 3.13233 9.05369 3.41556 8.70142 3.41556C8.34678 3.41556 8.06354 3.12995 8.06354 2.77768C8.06354 2.42542 8.34916 2.1398 8.70142 2.1398C9.05369 2.1398 9.33931 2.42542 9.33931 2.77768ZM11.1506 3.42509C11.1101 2.57061 10.915 1.81372 10.289 1.19012C9.66539 0.566519 8.9085 0.371346 8.05402 0.328503C7.17336 0.27852 4.53377 0.27852 3.65311 0.328503C2.80102 0.368966 2.04413 0.564138 1.41815 1.18774C0.792166 1.81134 0.599373 2.56823 0.55653 3.4227C0.506547 4.30336 0.506547 6.94295 0.55653 7.82361C0.596993 8.67809 0.792166 9.43498 1.41815 10.0586C2.04413 10.6822 2.79864 10.8774 3.65311 10.9202C4.53377 10.9702 7.17336 10.9702 8.05402 10.9202C8.9085 10.8797 9.66539 10.6846 10.289 10.0586C10.9126 9.43498 11.1078 8.67809 11.1506 7.82361C11.2006 6.94295 11.2006 4.30574 11.1506 3.42509ZM10.0129 8.76853C9.82724 9.23504 9.46783 9.59445 8.99894 9.78248C8.2968 10.061 6.63069 9.99669 5.85476 9.99669C5.07883 9.99669 3.41034 10.0586 2.71057 9.78248C2.24406 9.59683 1.88466 9.23742 1.69663 8.76853C1.41815 8.06639 1.48241 6.40028 1.48241 5.62435C1.48241 4.84842 1.42053 3.17993 1.69663 2.48016C1.88228 2.01365 2.24168 1.65425 2.71057 1.46622C3.41272 1.18774 5.07883 1.252 5.85476 1.252C6.63069 1.252 8.29918 1.19012 8.99894 1.46622C9.46545 1.65187 9.82486 2.01127 10.0129 2.48016C10.2914 3.18231 10.2271 4.84842 10.2271 5.62435C10.2271 6.40028 10.2914 8.06877 10.0129 8.76853Z" fill="currentColor"></path>
              </svg>
              {decodeAndCleanText(buttonTitle)}
            </Link>
            )}
          </div>

          {imageSrc ? (
            <img
              src={imageSrc}
              className="h-auto w-full max-w-full object-contain max-[767px]:hidden"
              alt={imageAlt}
              loading="lazy"
            />
          ) : null}

          {imageMobileSrc ? (
            <img
              src={imageMobileSrc}
              className="hidden h-auto w-full max-w-full object-contain max-[767px]:mt-[55px] max-[767px]:mb-8 max-[767px]:block"
              alt={imageMobileAlt}
              loading="lazy"
            />
          ) : null}
          
        </div>
      </div>
    </div>
  );
}
