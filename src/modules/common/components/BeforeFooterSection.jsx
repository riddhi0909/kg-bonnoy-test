"use client";

import Image from "next/image";
import { useQuery } from "@apollo/client/react";
import { GET_BEFORE_FOOTER_SETTINGS, GET_INSTAGRAM_FEEDS } from "@/modules/cms/api/queries";

function toText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function BeforeFooterSection() {
  const { data: beforeFooterData } = useQuery(GET_BEFORE_FOOTER_SETTINGS, {
    fetchPolicy: "cache-and-network",
  });
  const { data: instagramData } = useQuery(GET_INSTAGRAM_FEEDS, {
    fetchPolicy: "cache-and-network",
  });

  const beforeFooterSectionData = beforeFooterData?.themeSettings?.globalAcfFields ?? null;
  const instagramFeeds = instagramData?.allKGInstagramFeeds?.nodes ?? [];

  const normalizedFeed = Array.isArray(instagramFeeds)
    ? instagramFeeds
      .map((node) => {
        const fields = node?.instagramAcfFields;
        const mediaUrl = fields?.instagramPostMediaUrl || "";
        return {
          id: fields?.instagramPostId || node?.title || mediaUrl,
          mediaType: String(fields?.instagramPostMediaType || "").toUpperCase(),
          mediaUrl,
          permalink: fields?.instagramPostPermalink || "#",
          caption: fields?.instagramPostCaption || node?.title || "Instagram post",
          username: fields?.instagramPostUsername || "Bonnot Paris",
          timestamp: fields?.instagramPostTimestamp || "",
        };
      })
      .filter((item) => item.mediaUrl)
    : [];

  const sortedByTimestampDesc = [...normalizedFeed].sort((a, b) => {
    const aTime = Date.parse(a?.timestamp || "");
    const bTime = Date.parse(b?.timestamp || "");
    const aSafe = Number.isNaN(aTime) ? 0 : aTime;
    const bSafe = Number.isNaN(bTime) ? 0 : bTime;
    return bSafe - aSafe;
  });

  const imageOnlyFeed = sortedByTimestampDesc.filter((item) => item.mediaType !== "VIDEO").slice(0, 7);

  const feedToRender = imageOnlyFeed;

  const showBeforeFooterSection =
    beforeFooterSectionData?.showBeforeFooterSection !== false &&
    beforeFooterSectionData?.showBeforeFooterSection !== "No";

  if (!showBeforeFooterSection) return null;

  const title =
    toText(beforeFooterSectionData?.title) ||
    "Rejoignez la communauté Bonnot Paris et partageons notre passion pour les bijoux d'exception";
  const description =
    toText(beforeFooterSectionData?.description) ||
    "Suivez-nous sur les réseaux pour découvrir nos dernières créations, les coulisses de notre atelier et des aperçus exclusifs de nos pierres précieuses uniques.";
  const instagramLink = beforeFooterSectionData?.instagramLink || "https://www.instagram.com/bonnotparis/";
  const instagramTitle = toText(beforeFooterSectionData?.instagramTitle) || "Instagram";
  const youtubeLink = beforeFooterSectionData?.youtubeLink || "https://www.youtube.com/";
  const youtubeTitle = toText(beforeFooterSectionData?.youtubeTitle) || "Youtube";
  const linkedinLink = beforeFooterSectionData?.linkedinLink || "https://www.linkedin.com/";
  const linkedinTitle = toText(beforeFooterSectionData?.linkedinTitle) || "Linkedin";

  const socialLinks = [
    { href: instagramLink || "#", label: instagramTitle || "Instagram" },
    { href: youtubeLink || "#", label: youtubeTitle || "Youtube" },
    { href: linkedinLink || "#", label: linkedinTitle || "Linkedin" },
  ];
  return (
    <section className="pb-[30px] pt-[310px] max-[767px]:pt-[100px]">
      <div className="mx-auto max-w-[690px] space-y-[30px] text-center px-4 min-[1440px]:px-[15px] ">
        <h3 className="font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122]">
          {title}
        </h3>
        <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
          {description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-[30px] gap-y-2 text-sm font-semibold leading-[1.428]">
          {socialLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="text-[#001122] transition-colors hover:text-[#ff6633] flex items-center gap-[15px]">
              {item.label}
              <div><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10" />
              </svg>
              </div>
            </a>
          ))} 
        </div>
      </div>


      {feedToRender.length > 0 && (
      <div className="pt-[115px] min-[768px]:pt-[100px] strip-hide-scrollbar flex items-end gap-[30px] overflow-x-auto overflow-y-hidden justify-center">
        {feedToRender.map((post, index) => {
          const cardHeight = index % 2 === 0 ? "h-[240px]" : "h-[320px]";
          const commonClasses = `${cardHeight} w-[180px] shrink-0 object-cover`;

          // console.log("post = ", post);

          return (
            <a
              key={post.id || `${post.mediaUrl}-${index}`}
              href={post.permalink || "#"}
              target="_blank"
              rel="noreferrer"
              className="shrink-0"
              aria-label={`Voir la publication Instagram de ${post.username}`}
            >
              <Image
                src={post.mediaUrl}
                alt={post.caption || `Social ${index + 1}`}
                width={180}
                height={index % 2 === 0 ? 240 : 320}
                sizes="180px"
                className={commonClasses}
                loading="lazy"
              />
            </a>
          );
        })}
      </div>
      )}
    </section>
  );
}


export const CategoryBottomSections = BeforeFooterSection;