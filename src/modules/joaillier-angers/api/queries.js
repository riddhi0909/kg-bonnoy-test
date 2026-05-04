import {
    gql
} from "@apollo/client";

export const GET_ANGERS_JEWELER_PAGE_BY_URI = gql `
  query GetAngersJewelerPageByUri($uriId: ID!) {
    page(id: $uriId, idType: URI) {
      angersJewelerPageAcfField {
        showJewelerAngersSection
        jewelerAngersTitle
        jewelerAngersSubHeading
        jewelerAngersDescription
        jewelerAngersImage {
          node {
            sourceUrl
            altText
          }
        }
        jewelerAngersButton {
          title
          url
        }
        showCustomCreationSection
        customCreationTitle
        customCreationSubHeading
        customCreationDescription
        customCreationButton {
          title
          url
        }
        customCreationImage {
          node {
            sourceUrl
            altText
          }
        }
        showTheStudioSection
        theStudioTitle
        theStudioSubHeading
        theStudioDescription
        theStudioButton {
          title
          url
        }
        theStudioImage {
          node {
            sourceUrl
            altText
          }
        }
        showMaisonBonnotSection
        maisonBonnotTitle
        maisonBonnotDescription
        maisonBonnotImage {
          node {
            sourceUrl
            altText
          }
        }
        showTheOriginsSection
        theOriginsTitle
        theOriginsDescription
        theOriginsImage {
          node {
            sourceUrl
            altText
          }
        }
        showYourTailorSection
        yourTailorTitle
        yourTailorDescription
        showInnovativeCreativitySection
        innovativeCreativityTitle
        innovativeCreativityDescription
        showBonnotJewelerSection
        bonnotJewelerTitle
        bonnotJewelerSubHeading
        bonnotJewelerDescription
        bonnotJewelerButton {
          title
          url
        }
        bonnotJewelerImage {
          node {
            sourceUrl
            altText
          }
        }
        showJewelerAngersSection
        jewelerAngersTitle
        jewelerAngersSubHeading
        jewelerAngersDescription
        jewelerAngersImage {
          node {
            sourceUrl
            altText
          }
        }
        jewelerAngersButton {
          title
          url
        }
        showTestimonialSection
      }
    }
  }
`;
