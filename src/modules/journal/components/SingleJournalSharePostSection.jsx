import Link from "next/link";
import { journalPath } from "@/constants/routes";

function stripHtml(value) {
    return String(value || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}

export function SingleJournalSharePostSection({
    locale = "fr",
    post,
    shareSection,
    authorSection,
}) {
    const author = stripHtml(post?.author?.node?.name);
    const authorRole = "Fondateur de Bonnot Paris";
    const shareTitle = String(shareSection?.title || "").trim() || "Partagez ce post";
    const shareList = Array.isArray(shareSection?.list) ? shareSection.list : [];
    const backTitle = String(authorSection?.title || "").trim() || "Retour au blog";
    const backUrl = String(authorSection?.url || "").trim() || journalPath(locale);

    return (
        <div className="mx-auto w-full max-w-[896px]">
            <div className="border-y border-[#0011221a] py-[48px] px-[24px]">
                <div className="mx-auto flex w-fit flex-col items-center">
                    <p className="mb-4 text-[18px] font-normal leading-[1.2] text-[#000d29] [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif]">{shareTitle}</p>
                    <div className="social-icon">
                        <ul className="footer__list-social m-0 flex list-none items-center gap-4 p-0" role="list">
                            {shareList.map((item, index) => (
                                <li key={`${item?.socialLink || "social"}-${index}`} className="list-social__item">
                                    <a
                                        href={item?.socialLink || "#"}
                                        className="link list-social__link flex h-8 w-8 items-center justify-center bg-[#fd641b] hover:bg-[#001122]"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item?.socialIcon ? (
                                            <img
                                                src={item.socialIcon}
                                                alt={item?.socialIconAlt || "social icon"}
                                                className="h-4 w-4 object-contain"
                                            />
                                        ) : null}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 py-[48px] px-[24px]">
                <div className="flex flex-col gap-1">
                    <div className="text-[16px] font-semibold leading-[1.2] text-[#000d29] capitalize [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif]">{author}</div>
                    <div className="mt-1 text-[16px] font-normal leading-[1.2] text-[#000d29] capitalize [font-family:var(--font-jakarta),ui-sans-serif,system-ui,sans-serif]">{authorRole}</div>
                </div>
                <Link
                    href={backUrl}
                    className="group inline-flex h-12 min-h-12 items-center gap-4 bg-[#000d29] px-6 text-[14px] font-medium leading-[1.5] text-[#f4efe6] transition-colors duration-300 hover:bg-[#fd641b]"
                >
                    <span aria-hidden="true" className="inline-flex items-center justify-center">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5">
                            <path d="M0 6.35H12M12 6.35L6 0.35M12 6.35L6 12.35" stroke="currentColor"></path>
                        </svg>          
                    </span> 
                    {backTitle}
                </Link>
            </div>
        </div>
    );
}

export default SingleJournalSharePostSection;
