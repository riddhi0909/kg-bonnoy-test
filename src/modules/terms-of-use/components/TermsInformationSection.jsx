"use client";

import Link from "next/link";

function sanitizeHtml(value) {
    return String(value || "")
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
        .replace(/\son\w+="[^"]*"/gi, "")
        .replace(/\son\w+='[^']*'/gi, "")
        .trim();
}

export function TermsInformationSection({ termsInformation, lastUpdateDate }) {
    console.log(termsInformation, '---------------termsInformation');
    return (
        <div className="mx-auto w-full max-w-[1440px] px-[24px] min-[768px]:px-[40px]">
            <div className="flex flex-col gap-6 mx-auto w-full max-w-[912px]">
                {
                    termsInformation && termsInformation.map((item, index) => (
                        <div key={index} className="flex flex-col gap-6 border-b border-[#e5dbcc] pb-[64px] mb-[64px]">
                            <h2 className="font-serif text-[24px] min-[768px]:text-[38px] text-[#000d29] font-medium leading-[1.2]">
                                {item.termsTitle}
                            </h2>
                            <div className="[font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif] text-[16px] leading-[1.5] [&_a]:hover:text-[#f63] [&_p]:mb-[24px]" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.termsDescription) }} />
                        </div>
                    ))
                }

                {lastUpdateDate ? (
                    <p className="text-[16px] leading-[1.5] text-[#001122]">
                        {lastUpdateDate}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
