import Link from 'next/link';
import React from 'react'

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

export function InvestirThePotentialSection({ title, subHeading, description, highlightedText, button, image, imageAlt }) {
    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
            <div className="grid grid-cols-1 gap-14 [place-items:center_stretch] min-[768px]:grid-cols-2 min-[768px]:gap-[88px]">
                <div className="flex flex-1 flex-col items-start justify-start">
                    {title && (
                        <h2 className="m-0 mb-8 font-serif text-[52px] font-medium leading-[1.2] tracking-normal text-[#001122]">
                            {title}
                        </h2>
                    )}

                    {subHeading && (
                        <span className="mb-6 block [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[20px] font-medium leading-[1.5] tracking-normal text-[#001122]">
                            {decodeAndCleanText(subHeading)}
                        </span>
                    )}

                    {description && (
                        <p className="m-0 mb-8 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-medium leading-[1.5] tracking-normal text-[#7e7067]">
                            {decodeAndCleanText(description)}
                        </p>
                    )}

                    {highlightedText && (
                        <div className="mb-8 w-full bg-[#f4efe6] p-4 min-[768px]:mb-16">
                            <p className="m-0 font-serif text-[16px] font-extrabold leading-[1.5] text-[#7e7067] min-[768px]:text-[18px]">
                                {decodeAndCleanText(highlightedText)}
                            </p>
                        </div>
                    )}

                    {button && button.url && button.title && (
                        <div>
                            <Link
                                href={button.url}
                                target={button.target}
                                className="group flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#001122] px-[15px] py-2 border border-[rgba(0,17,34,0.2)] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122]"
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
                        </div>
                    )}
                </div>

                {image && (
                    <div>
                        <img
                            src={image}
                            alt={String(imageAlt ?? "").trim() || "Jewelry"}
                            className="h-auto max-h-[600px] w-full place-self-center object-contain"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>

        </div>
    )
}