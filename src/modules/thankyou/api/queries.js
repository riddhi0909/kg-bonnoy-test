import { gql } from "@apollo/client";

export const GET_THANKYOU_PAGE_BY_URI = gql`
  query GetThankyouPageByUri($uriId: ID!) {
    page(id: $uriId, idType: URI) {
      thankYouPageAcfField {
        showThankYouSection
        thankYouTitle
        thankYouDescription
        thankYouButton {
          target
          title
          url
        }
        thankYouImage {
          node {
            sourceUrl
            altText
          }
        }
        showTestimonialSection
      }
    }
  }
`;
