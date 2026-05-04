"use client";

import { useMemo } from "react";

export function RealisationsFeaturesSection({ features = [] }) {
  const dynamicItems = useMemo(() => {
    if (!Array.isArray(features)) return [];
    return features
      .map((item) => ({
        title: String(item?.title ?? "").trim(),
        description: String(item?.description ?? "").trim(),
        image: String(item?.image ?? "").trim(),
        imageAlt: String(item?.imageAlt ?? "").trim(),
      }))
      .filter((item) => item.title || item.description || item.image || item.imageAlt);
  }, [features]);

  const sourceItems = dynamicItems.length ? dynamicItems : [];

  const filteredItems = useMemo(() => {
    return sourceItems;
  }, [sourceItems]);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid grid-cols-1 gap-16 min-[768px]:grid-cols-[1fr_auto_1fr_auto_1fr]">
                {filteredItems.map((item, index) => (
            <div key={`${item.title}-${index}`} className="contents">
              <div className="flex flex-col items-center justify-start gap-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.imageAlt || item.title || `Feature ${index + 1}`}
                    className="h-[70.4px] w-[70.4px] object-contain"
                    loading="lazy"
                  />
                ) : null}
                <h3 className="mb-4 text-center font-serif text-[18px] font-medium leading-[1.2] tracking-normal">
                  {item.title}
                </h3>
                <p className="m-0 max-w-[280px] text-center text-[16px] font-medium leading-[1.5] tracking-normal text-[#7e7067]">
                  {item.description}
                </p>
              </div>
              {index < filteredItems.length - 1 ? <div className="hidden min-h-[50px] w-px bg-[#ddd4c6] min-[768px]:block" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}