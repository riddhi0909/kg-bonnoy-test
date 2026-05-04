import {
  gql
} from "@apollo/client";

export const GET_PRESS_PAGE_BY_URI = gql`
  query GetPressPageByUri($uriId: ID!) {
    page(id: $uriId, idType: URI) {
      pressPageAcfField {
        showTalkingAboutSection
        talkingAboutTitle
        talkingAboutSubHeading
        articleList {
          articleLink
          articleTitle
          articleDate
          articleImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        showPressSection
        pressTitle
        pressSubHeading
        pressDescription
        pressImage {
          node {
            sourceUrl
            altText
          }
        }
        showTheBrandSection
        theBrandTitle
        theBrandSubHeading
        theBrandDescription
        theBrandImage {
          node {
            altText
            sourceUrl
          }
        }
        theBrandButton {
          title
          url
        }
        showTestimonialsSection
      }
    }
  }
`;
