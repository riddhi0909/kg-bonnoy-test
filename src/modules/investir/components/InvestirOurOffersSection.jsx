"use client";

import Link from 'next/link';
import React, { useState } from 'react'

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

export const InvestirOurOffersSection = ({ title, description, managementTabHeading, managementTabTitle, managementTabSubHeading, managementTabHighlightText, managementTabImage, managementTabImageAlt, managementTabDescription, managementTabButton, portfolioTabHeading, portfolioTabTitle, portfolioTabSubHeading, portfolioTabHighlightText, portfolioTabImage, portfolioTabImageAlt, portfolioTabDescription, portfolioTabButton }) => {

    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    }

    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
            <div className="pb-8 text-center min-[768px]:px-0 min-[768px]:pb-12 min-[992px]:pb-16">
                <h2 className="m-0 mx-auto max-w-[744px] px-5 pb-6 text-center font-serif text-[48px] font-medium leading-[1.2] tracking-normal text-[#000d29] min-[768px]:px-0 min-[768px]:text-[52px]">
                    {title}
                </h2>
                <p className="m-0 mx-auto w-full max-w-[530px] px-5 text-center [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] font-medium leading-[1.5] tracking-normal text-[#000d29] min-[768px]:px-0 min-[768px]:text-[18px]">
                    {description}
                </p>
            </div>
            <div className="mx-auto w-full">
                <ul className="mb-12 flex list-none items-start justify-start gap-[18px] overflow-x-auto px-5 py-0 min-[768px]:justify-center min-[768px]:overflow-visible min-[768px]:px-0">
                    <li
                        className={`relative flex-none cursor-pointer border-b px-0 py-[10px] text-[18px] font-medium leading-[1.5] tracking-normal [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] transition-colors ${activeTab === 0 ? 'border-[#000d29] text-[#000d29] hover:text-[#000d29]' : 'text-[#7e7067] hover:text-[#ee4308] border-transparent'}`}
                        onClick={() => handleTabClick(0)}
                    >
                        <span>{managementTabHeading}</span>
                    </li>
                    <li className={`relative flex-none cursor-pointer border-b px-0 py-[10px] text-[18px] font-medium leading-[1.5] tracking-normal [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] transition-colors ${activeTab === 1 ? 'border-[#000d29] text-[#000d29] hover:text-[#000d29]' : 'text-[#7e7067] hover:text-[#ee4308] border-transparent'}`}
                        onClick={() => handleTabClick(1)} >
                        <span>{portfolioTabHeading}</span>
                    </li>
                </ul>
                <div className={`${activeTab === 0 ? 'block' : 'hidden'}`}>
                    <div className="grid grid-cols-1 gap-14 [place-items:center_stretch] min-[768px]:grid-cols-2 min-[768px]:gap-[88px]">
                        <div className="flex flex-1 flex-col items-start justify-start">
                            <h2 className="m-0 mb-8 font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#001122] min-[768px]:text-[52px]">{managementTabTitle}</h2>
                            <span className="mb-6 block [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[20px] font-medium leading-[1.5] tracking-normal text-[#001122]">{managementTabSubHeading}</span>
                            <p className="m-0 mb-8 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-medium leading-[1.5] tracking-normal text-[#7e7067]">{decodeAndCleanText(managementTabDescription)}</p>
                            <div className="mb-8 w-full bg-[#f4efe6] p-4 min-[768px]:mb-16">
                                <p className="m-0 font-serif text-[16px] font-extrabold leading-[1.5] text-[#7e7067] min-[768px]:text-[18px]">{managementTabHighlightText}</p>
                            </div>
                            <div>
                                {managementTabButton?.url && managementTabButton?.title ? (
                                <Link 
                                    className="group flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#001122] px-[15px] py-2 border border-[rgba(0,17,34,0.2)] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122]"
                                    href={managementTabButton.url} target={managementTabButton.target || undefined}
                                >
                                    {managementTabButton.title}
                                    <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path
                                            d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                                            stroke="currentColor"
                                            strokeOpacity="0.85"
                                            strokeMiterlimit="10"
                                        />
                                    </svg>
                                </Link>
                                ) : null}
                            </div>
                        </div>
                        <div>
                            <img alt={managementTabImageAlt} className="h-auto max-h-[600px] w-full place-self-center object-contain" loading="lazy" src={managementTabImage} />
                        </div>
                    </div>
                </div>
                <div className={`${activeTab === 1 ? 'block' : 'hidden'}`}>
                    <div className="grid grid-cols-1 gap-14 [place-items:center_stretch] min-[768px]:grid-cols-2 min-[768px]:gap-[88px]">
                        <div className="flex flex-1 flex-col items-start justify-start">
                            <h2 className="m-0 mb-8 font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#001122] min-[768px]:text-[52px]">{portfolioTabTitle}</h2>
                            <span className="mb-6 block [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[20px] font-medium leading-[1.5] tracking-normal text-[#001122]">{portfolioTabSubHeading}</span>
                            <p className="m-0 mb-8 [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[18px] font-medium leading-[1.5] tracking-normal text-[#7e7067]">{decodeAndCleanText(portfolioTabDescription)}</p>
                            <div className="mb-8 w-full bg-[#f4efe6] p-4 min-[768px]:mb-16">
                                <p className="m-0 font-serif text-[16px] font-extrabold leading-[1.5] text-[#7e7067] min-[768px]:text-[18px]">
                                    {portfolioTabHighlightText}</p>
                            </div>
                            <div>
                                {portfolioTabButton?.url && portfolioTabButton?.title ? (
                                <Link 
                                    className="group flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#001122] px-[15px] py-2 border border-[rgba(0,17,34,0.2)] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122]"
                                    href={portfolioTabButton.url} target={portfolioTabButton.target || undefined}
                                >
                                    {portfolioTabButton.title}
                                    <svg className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path
                                            d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                                            stroke="currentColor"
                                            strokeOpacity="0.85"
                                            strokeMiterlimit="10"
                                        />
                                    </svg>
                                </Link>
                                ) : null}
                            </div>
                        </div>
                        <div>
                            <img alt={portfolioTabImageAlt} className="h-auto max-h-[600px] w-full place-self-center object-contain" loading="lazy" src={portfolioTabImage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}