import { BlogSection } from "@/modules/journal/components/BlogSection";
import { JournalArticlesSection } from "@/modules/journal/components/JournalArticlesSection";

export function JournalPage({ locale, sectionConfig, postsConfig }) {
  return (
      <div className="w-full bg-[#fffaf5]">
        {sectionConfig?.blogSection?.show !== false && (
          <section className="py-[64px]">
            <BlogSection
              title={sectionConfig?.blogSection?.title}
              prefix={sectionConfig?.blogSection?.prefix}
              subTitle={sectionConfig?.blogSection?.subTitle}
            />
          </section>
        )}
        <section>
          <JournalArticlesSection
            posts={postsConfig?.nodes}
            locale={locale}
            basePath={postsConfig?.basePath}
            page={postsConfig?.page}
            totalPages={postsConfig?.totalPages}
            hasPrevPage={postsConfig?.hasPrevPage}
            hasNextPage={postsConfig?.hasNextPage}
          />
        </section>
    </div>
  );
}

export default JournalPage;

