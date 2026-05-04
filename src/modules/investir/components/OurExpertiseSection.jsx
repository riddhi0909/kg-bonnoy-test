import Link from "next/link";

function CornerTriangle({ className, path }) {
  return (
    <div className={className}>
      <svg width="100%" height="100%" viewBox="0 0 383 442" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={path} fill="#FAF5EF" />
      </svg>
    </div>
  );
}
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
export function OurExpertiseSection({
  leftImage,
  leftImageAlt,
  leftMasterImage,
  leftMasterImageAlt,
  title,
  description,
  contentList,
  subHeading,
  button,
}) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px] max-[991px]:px-0">
      <div className="grid grid-cols-1 min-[992px]:grid-cols-[5fr_7fr]">
        <div className="relative z-[3] flex min-h-0 items-center justify-center p-6 min-[768px]:p-10 min-[992px]:sticky min-[992px]:top-0 min-[992px]:z-[1] min-[992px]:h-screen bg-[#000d29] min-[992px]:bg-transparent min-[992px]:py-12 min-[992px]:px-0">
          <div className="relative flex w-full items-center justify-center p-0 min-[992px]:absolute min-[992px]:inset-y-0 min-[992px]:right-0 min-[992px]:w-[calc(50vw-20%)] min-[992px]:p-[120px_48px_48px]">
            {leftImage ? (
              <img
                src={leftImage}
                alt={leftImageAlt}
                className="h-auto w-full object-cover min-[992px]:h-[calc(100vh-168px)]"
                loading="lazy"
              />
            ) : null}
            {leftMasterImage ? (
              <img
                src={leftMasterImage}
                alt={leftMasterImageAlt}
                className="absolute inset-0 -z-[1] mt-6 h-full w-full object-cover min-[768px]:mt-10"
                loading="lazy"
              />
            ) : null}
          </div>
        </div>

        <div className="relative max-[991px]:order-[-1] min-[992px]:shadow-[400px_0_0_400px_#faf5ef]">
          <div className="relative z-0 px-0 py-[128px] min-[768px]:py-[200px] min-[992px]:pl-24 max-[991px]:px-4">
            <h2 className="relative z-[1] m-0 pb-5 font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#001122] min-[768px]:pb-[32px] min-[768px]:text-[52px]">
              {decodeAndCleanText(title)}
            </h2>
            <p className="relative z-[1] w-full max-w-[600px] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-normal leading-[1.5] tracking-normal text-[#001122]">
              {decodeAndCleanText(description)}
            </p>

              <div className="absolute inset-y-0 left-0 -z-[1] block h-full w-[calc(50vw+15%)] overflow-hidden bg-[#fffbf4] max-[991px]:ml-[-40px]">
              <CornerTriangle
                className="absolute left-[-1px] top-[-1px] flex h-auto w-[132px] items-center justify-center min-[992px]:w-[200px]"
                path="M0.804688 0.787109V441.88L382.319 0.787109H0.804688Z"
              />
              <CornerTriangle
                className="absolute right-[-1px] top-[-1px] flex h-auto w-[132px] items-center justify-center min-[992px]:w-[200px]"
                path="M381.905 0.787109H0.390625L381.905 441.88V0.787109Z"
              />
              <CornerTriangle
                className="absolute bottom-[-1px] right-[-1px] flex h-auto w-[132px] items-center justify-center min-[992px]:w-[200px]"
                path="M381.905 441.464H0.390625L381.905 0.371094V441.464Z"
              />
              <CornerTriangle
                className="absolute bottom-[-1px] left-[-1px] flex h-auto w-[132px] items-center justify-center min-[992px]:w-[200px]"
                path="M0.804688 441.393H382.319L0.804688 0.300781V441.393Z"
              />
            </div>
          </div>

          <div className="relative z-0 px-0 pt-[14px] pb-[81px] text-[18px] min-[992px]:pl-24  max-[991px]:px-4">
            {contentList?.map((line, idx, arr) => (
              <div key={idx} className={`${idx !== arr.length - 1 ? "mb-[52px] border-b border-[#ddd4c6] pb-[52px]" : ""}`}>
              <h3 className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-semibold leading-[1.5] pb-[14px]  tracking-normal text-[#121212]">
                {line?.expertiseListTitle}
              </h3>
              <p className="relative z-[1] w-full max-w-[600px] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-normal leading-[1.5] tracking-normal text-[#001122]">
                {decodeAndCleanText(line?.expertiseListDescription)}
              </p>
              </div>
            ))}
          </div>

          <div className="relative z-0 flex flex-col items-start justify-start gap-14 px-0 pt-20 pb-[60px] min-[992px]:pl-24 min-[992px]:pt-[100px] min-[992px]:pb-[100px]  max-[991px]:px-4">
            <p className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-semibold leading-[1.5] tracking-normal text-[#fffbf4]">
              <strong>
                {decodeAndCleanText(subHeading)}
              </strong>
            </p>
            {button?.title && button?.url && (
              
                  <Link
                    href={button.url}
                    target={button.target}
                    className="group flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#f63] px-[15px] py-2 border border-[#f63] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-white hover:text-[#f63]"
                  >
                    {button.title}
                    <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path
                        d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                        stroke="currentColor"
                        strokeOpacity="0.85"
                        strokeMiterlimit="10"
                      />
                    </svg>
                  </Link>
            )}
            <div className="absolute inset-y-0 left-0 -z-[1] block w-[100vw] bg-[#001122] min-[992px]:w-[calc(50vw+15%)]" />
          </div>
        </div>
      </div>
    </div>  );
}
