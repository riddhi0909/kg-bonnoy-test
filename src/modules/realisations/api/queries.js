import {
    gql
} from "@apollo/client";

export const GET_REALISATIONS_PAGE_BY_URI = gql`
    query GetRealisationsPageByUri($uriId: ID!) {
        page(id: $uriId, idType: URI) {
            achievementsPageAcfField {
                showBreadcrumbSection
                breadcrumbFirstTitle
                breadcrumbFirstTitleLink
                breadcrumbSecondTitle
                breadcrumbSecondTitleLink
                showAchievementSection
                showFeaturesSection
                feature1Image{
                    node {
                        sourceUrl
                        altText
                    }
                }
                feature1Title
                feature1Description
                feature2Image{
                    node {
                        sourceUrl
                        altText
                    }
                }
                feature2Title
                feature2Description
                feature3Image{
                    node {
                        sourceUrl
                        altText
                    }
                }
                feature3Title
                feature3Description
                showReadyToShipSection
                readyToShipImage{
                    node {
                        sourceUrl
                        altText
                    }
                }
                readyToShipTitle
                readyToShipDescription
                readyToShipButtonTitle
                readyToShipButtonLink
                showSourcingSection
                sourcingImage{
                    node {
                        sourceUrl
                        altText
                    }
                }
                sourcingTitle
                sourcingSubHeading
                sourcingDescription
                sourcingButtonTitle
                sourcingButtonLink
                showFaqSection
                faqDetails {
                    faqTitle
                    faqDescription
                    faqButtonLinkTitle
                    faqButtonLink
                    faqDetailsImage{
                        node {
                            id
                            sourceUrl
                            altText
                        }
                    }
                }
                showTestimonialsSection
            }
        }
    }
`;

const ACHIEVEMENT_POST_GRID_FIELDS = `
  slug
  uri
  title
  featuredImage {
    node {
      altText
      sourceUrl
      mediaDetails {
        sizes {
          name
          sourceUrl
          width
          height
        }
      }

    }
  }
  achievements {
    shortDescription
  }
  achivementsTags {
    nodes {
      id
      name
      slug
    }
  }
`;

/** Initial + scroll (cursor) for unfiltered list. */
export const GET_ACHIEVEMENTS_POSTS_CONNECTION = gql`
  query GetAchievementsPostsConnection($first: Int!, $after: String) {
    allAchievementsPost(
      first: $first
      after: $after
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ${ACHIEVEMENT_POST_GRID_FIELDS}
      }
    }
  }
`;

/**
 * Filter pills: taxonomy terms. Adjust ACHIVEMENTSTAG in GraphiQL if enum differs.
 */
export const GET_ACHIEVEMENT_TAG_TERMS = gql`
  query GetAchievementTagTerms {
    terms(first: 500, where: { taxonomies: [ACHIVEMENTSTAG], hideEmpty: false }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

/** If `terms` fails — derive tag slugs from many posts (heavier). */
export const GET_ACHIEVEMENT_TAGS_FROM_POSTS_SAMPLE = gql`
  query GetAchievementTagsFromPostsSample($first: Int!) {
    allAchievementsPost(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes {
        achivementsTags {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_ACHIEVEMENTS_POSTS = gql`
  query GetachievementsPost($first: Int = 200) {
    allAchievementsPost(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC} }) {
      nodes {
        date
        slug
        uri
        title
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        achievements {
          subTitle
          shortDescription
        }
        achivementsTags {
            nodes {
                id
                name
            }
        }
      }
    }
  }
`;

export const GET_ACHIEVEMENT_POST_BY_SLUG = gql`
  query GetAchievementPostBySlug($slug: String!) {
    allAchievementsPost(
      first: 1
      where: { status: PUBLISH, name: $slug }
    ) {
      nodes {
        slug
        uri
        title
        content
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        achievements {
          subTitle
          blogTitle
          measurement
          origin
          clarity
          treatment
          shortDescription
          portfolioImages {
            nodes {
              sourceUrl
              altText
            }
          }
        }
        achivementsTags {
          nodes {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_GLOBAL_ACF_FIELDS = gql `
  query GetCategoryPostBlock {
    themeSettings {
      globalAcfFields {
        showCenterVideoSection
        centerVideo
    }
  }
}
`;