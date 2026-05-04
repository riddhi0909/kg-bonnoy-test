import {
    gql
} from "@apollo/client";

export const GET_JEWELER_PARIS_PAGE_BY_URI = gql `
  query GetParisJewelerPageByUri($uriId: ID!) {
    page(id: $uriId, idType: URI) {
      jewelerParisPageAcfField {
        showBonnotJewelerSection
        bonnotJewelerTitle
        bonnotJewelerSubHeading
        bonnotJewelerDescription
        bonnotJewelerImage{
          node {
            sourceUrl
            altText
          }
        }
        showUniqueCreationsSection
        uniqueCreationsTitle
        uniqueCreationsSubHeading
        uniqueCreationsDescritption
        uniqueCreationsButton {
          title
          url
        }
        uniqueCreationsImage{
          node {
            sourceUrl
            altText
          }
        }
        showRingsCreatedSection
        ringsCreatedTitle
        ringsCreatedSubHeading
        ringsCreatedDescription
        ringsCreatedButton {
          title
          url
        }
        ringsCreatedImage{
          node {
            sourceUrl
            altText
          }
        }
        showBonnotParisJewelerSection
        bonnotParisJewelerTitle
        bonnotParisJewelerDescripition
        bonnotParisJewelerImage{
          node {
            sourceUrl
            altText
          }
        }
        showTheStagesSection
        theStagesTitle
        theStagesDescription
        showHistorySection
        historyTitle
        historyDescription
        showDiscoverOurStonesSection
        discoverOurStonesTitle
        discoverOurStonesDescription
        showTestimonialSection
      }
    }
  }
`;
