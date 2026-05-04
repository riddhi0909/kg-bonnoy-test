import Link from "next/link";
import { homePath, journalPath, journalPostPath } from "@/constants/routes";

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function postSlug(post) {
  const fromSlug = String(post?.slug || "").trim();
  if (fromSlug) return fromSlug;
  const uri = String(post?.uri || "");
  const clean = uri.replace(/^\/+|\/+$/g, "");
  const parts = clean.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

export function SingleJournalMetaSection({ locale = "fr", post, shareSection }) {
  const title = stripHtml(post?.title) || "Journal";
  const slug = postSlug(post);
  const currentPath = slug ? journalPostPath(locale, slug) : journalPath(locale);
  const shareList = Array.isArray(shareSection?.list) ? shareSection.list.filter((item) => item?.socialLink) : [];

  return (
    <div className="mx-auto flex w-full max-w-[896px] flex-wrap items-center justify-between gap-[30px] px-6 pt-12 min-[768px]:pt-24 min-[992px]:pt-32">
      <div className="p-0">
        <nav aria-label="Breadcrumb">
          <ul className="flex list-none flex-wrap items-center gap-2 p-0 m-0">
            <li>
              <Link href={homePath(locale)} title="Home" className="text-[14px] font-medium leading-[1.5] text-[#001122]">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14" height="12" width="12"><script xmlns="" id="eppiocemhmnlbhjplcgkofciiegomcon" /><script xmlns="" /><script xmlns="" />
                <path stroke-linejoin="round" stroke="#000D29" d="M1 13L7 7L1 1" />
                <script xmlns="" /><script xmlns="" /></svg>
            </li>
            <li>
              <Link href={journalPath(locale)} className="text-[14px] font-medium leading-[1.5] text-[#001122]">
                Journal
              </Link>
            </li>
            <li aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14" height="12" width="12"><script xmlns="" id="eppiocemhmnlbhjplcgkofciiegomcon" /><script xmlns="" /><script xmlns="" />
                <path stroke-linejoin="round" stroke="#000D29" d="M1 13L7 7L1 1" />
                <script xmlns="" /><script xmlns="" /></svg>
            </li>
            <li>
              <Link href={currentPath} className="text-[14px] font-medium leading-[1.5] text-[#001122] hover:text-[#f63] underline underline-offset-[6px]">
                {title}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {shareList.length ? (
        <ul className="m-0 flex list-none items-center gap-4 p-0" role="list">
          {shareList.map((item, index) => (
            <li key={`${item?.socialLink || "social"}-${index}`}>
              <a
                href={item?.socialLink || "#"}
                className="relative z-0 flex h-8 w-8 items-center justify-center overflow-hidden rounded-none bg-[#f63] p-0 hover:bg-[#001122]"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item?.socialIcon ? (
                  <img
                    src={item.socialIcon}
                    alt={item?.socialIconAlt || "social icon"}
                    className="h-4 w-4 object-contain"
                    loading="lazy"
                  />
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>


  );
}

export default SingleJournalMetaSection;
