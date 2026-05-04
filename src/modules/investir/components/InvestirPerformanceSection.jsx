"use client";

import React, { useState } from 'react';
import Link from 'next/link'
export function InvestirPerformanceSection({ title, description, performanceTab }) {

    const [activeTab, setActiveTab] = useState(0);
    const tabs = Array.isArray(performanceTab) ? performanceTab : [];

    const handleTabClick = (index) => {
        setActiveTab(index);
    }

    return (
            <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
                <div className="pb-8 text-center min-[768px]:px-0 min-[768px]:pb-12 min-[992px]:pb-16">
                    <h2 className="m-0 mx-auto max-w-[744px] pb-6 text-center font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#000d29] min-[768px]:px-0 min-[768px]:text-[52px]">
                        {title}
                    </h2>
                    <p className="m-0 mx-auto w-full max-w-[530px] px-5 text-center [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] font-medium leading-[1.5] tracking-normal text-[#000d29] min-[768px]:px-0 min-[768px]:text-[18px]">
                        {description}
                    </p>
                </div>

                <div className="mx-auto w-full">
                    <ul className="mb-12 flex list-none items-start justify-start gap-[18px] overflow-x-auto px-5 py-0 min-[768px]:justify-center min-[768px]:overflow-visible min-[768px]:px-0">
                        {tabs.map((tab, index) => (
                            <li
                                className={`relative flex-none cursor-pointer border-b px-0 py-[10px] text-[18px] font-medium leading-[1.5] tracking-normal [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] transition-colors ${index === activeTab ? 'border-[#000d29] text-[#000d29] hover:text-[#000d29]' : 'text-[#7e7067] hover:text-[#ee4308] border-transparent'}`}
                                key={index}
                                onClick={() => handleTabClick(index)}
                            >
                                <span>{tab.tabHeading}</span>
                            </li>
                        ))}
                    </ul>

                    {tabs.map((tab, index) => (
                        <div
                            id={tab.tabHeading}
                            className={`${index === activeTab ? 'block' : 'hidden'} min-h-[500px] bg-[#202e4a]`}
                            key={index}
                        >
                            <div className="flex min-h-[500px] w-full flex-col items-stretch gap-12 pb-12 min-[768px]:px-12 min-[992px]:grid min-[992px]:grid-cols-[3.25fr_1fr] min-[992px]:auto-cols-fr min-[992px]:items-center min-[992px]:gap-12 min-[992px]:px-0 min-[992px]:pr-12 min-[992px]:pb-0">
                                <div className="w-full">
                                    <img
                                        src={tab.tabPerformanceImage?.node?.sourceUrl || ""}
                                        alt={tab.tabPerformanceImage?.node?.altText || ""}
                                        className="h-auto w-full object-cover object-center"
                                    />
                                </div>

                                <div className="flex flex-col items-start justify-start px-4 min-[480px]:px-4 min-[768px]:px-0">
                                    <div>
                                        <h3 className="m-0 pb-4 font-serif text-[36px] font-medium leading-[1.2] tracking-normal text-[#f4efe6] min-[768px]:text-[48px]">
                                            {tab.tabHeading}
                                        </h3>
                                        <ul className="m-0 flex list-none flex-col gap-1 pb-8 min-[768px]:pb-[63px]">
                                            {tab.stoneInfo && tab.stoneInfo.split('\n').map((item, index) => (
                                                <li key={index} className="text-[14px] font-medium leading-[1.5] text-[#f4efe6] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif]" dangerouslySetInnerHTML={{ __html: item }} />
                                            ))}
                                        </ul>
                                    </div>

                                    {tab.tabStoneButton?.url && tab.tabStoneButton?.title && (
                                        <Link href={tab.tabStoneButton?.url || ""} target={tab.tabStoneButton?.target || ""} 
                                        className="group flex min-h-10 min-w-[232px] items-center justify-center gap-[15px] bg-[#f63] px-[15px] py-2 border border-[#f63] text-sm font-medium leading-[1.428] text-white transition-all duration-300 hover:bg-white hover:text-[#f63]"
                                        >
                                            {tab.tabStoneButton?.title}
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    );
}