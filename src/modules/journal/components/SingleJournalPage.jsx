import { SingleJournalHeroSection } from "@/modules/journal/components/SingleJournalHeroSection";
import { SingleJournalMetaSection } from "@/modules/journal/components/SingleJournalMetaSection";
import { SingleJournalContentSection } from "@/modules/journal/components/SingleJournalContentSection";
import { SingleJournalSharePostSection } from "@/modules/journal/components/SingleJournalSharePostSection";
import { RelatedArticleSection } from "@/modules/journal/components/RelatedArticleSection";
import "@/modules/journal/css/SingleJournalPage.css";

export function SingleJournalPage({ locale, post, sectionConfig, relatedPosts }) {
  return (
    <div className="w-full bg-[#fffaf5]">
      <SingleJournalHeroSection locale={locale} post={post} />
      <SingleJournalMetaSection
        locale={locale}
        post={post}
        shareSection={sectionConfig?.singleBlogSharePostSection}
      />
      <SingleJournalContentSection locale={locale} post={post} />

      {sectionConfig?.singleBlogSharePostSection?.show !== false && (
        <section className="">
          <SingleJournalSharePostSection
            locale={locale}
            post={post}
            shareSection={sectionConfig?.singleBlogSharePostSection}
            authorSection={sectionConfig?.blogAuthorDetailSection}
          />
        </section>
      )}
      {sectionConfig?.relatedArticleSection?.show !== false && (
        <section className="">
          <RelatedArticleSection
            locale={locale}
            relatedSection={sectionConfig?.relatedArticleSection}
            relatedPosts={relatedPosts}
          />
        </section>
      )}


    </div>
  );
}

export default SingleJournalPage;
