import {
  gql
} from "@apollo/client";

export const GET_JOURNAL_PAGE_BY_URI = gql`
  query GetJournalPageByUri($uriId: ID!) {
    page(id: $uriId, idType: URI) {
      journalPageAcfField {
        showBlogSection
        blogPrefix
        blogTitle
        blogSubTitle
      }
    }
  }
`;

export const GET_JOURNAL_PAGE_BY_DATABASE_ID = gql`
  query GetJournalPageByDatabaseId($databaseId: ID!) {
    page(id: $databaseId, idType: DATABASE_ID) {
      journalPageAcfField {
        showBlogSection
        blogPrefix
        blogTitle
        blogSubTitle
      }
    }
  }
`;

export const GET_GLOBAL_ACF_FIELDS = gql`
  query GetCategoryPostBlock {
    themeSettings {
      globalAcfFields {
        showRelatedBlogSection
        relatedBlogTitle
        relatedBlogDescription
        showSingleBlogSharePostSection
        singleBlogSharePostTitle
        singleBlogSharePostList {
          socialLink
          socialIcon {
            node {
              sourceUrl
              altText
            }
          }
        }
        showBlogAuthorDetailSection
        blogButton {
          title
          url
        }  
      }
    }
  }
`;

export const GET_JOURNAL_POSTS_CONNECTION = gql`
  query GetJournalPostsConnection($first: Int!, $after: String) {
    posts(
      first: $first
      after: $after
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        slug
        uri
        title
        excerpt
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;