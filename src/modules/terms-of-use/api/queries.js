import { gql } from "@apollo/client";

export const GET_TERMS_OF_USE_PAGE_BY_URI = gql`
  query GetTermsOfUsePageByUri($uriId: ID!) {
    page(id: $uriId, idType: URI) {
      termsOfUsePageAcfField {
        showPageHeroSection
        pageHeroTitle
        pageHeroImage{
          node {
            sourceUrl
            altText
          }
        }
        pageBackUrl{
          url
          target
          title
        }
        
        showTermsInfoSection
        termsInformation {
          termsTitle
          termsDescription
        }
        lastUpdateDate
      }
    }
  }
`;
