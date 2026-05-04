import {
    gql
} from "@apollo/client";

export const GET_CUSTOM_RING_PAGE_BY_URI = gql `
  query GetCustomRingPageByUri($uriId: ID!) {
    page(id: $uriId, idType: URI) {
      customRingPageAcfField {
        showCustomCreationSection
        customCreationTitle
        customCreationDescription
        customCreationImage {
          node {
            sourceUrl
            altText
          }
        }
        showStoneSection
        stoneImage {
          node {
            sourceUrl
            altText
          }
        }
        stoneTitle
        stoneDescription
        stoneButton {
          title
          url
        }
        showTheCreationSection
        theCreationImage {
          node {
            sourceUrl
            altText
          }
        }
        theCreationTitle
        theCreationDescription
        theCreationButton {
          title
          url
        }
        showTheManufacturingSection
        theManufacturingImage {
          node {
            sourceUrl
            altText
          }
        }
        theManufacturingTitle
        theManufacturingDescription
        theManufacturingButton {
          title
          url
        }
        showTheDiscovery
        theDiscoveryImage {
          node {
            sourceUrl
            altText
          }
        }
        theDiscoveryTitle
        theDiscoveryDescription
        theDiscoveryButton {
          title
          url
        }
        showCustomMadeSection
        customMadeTitle
        customMadeDescription
        showTheProcess
        theProcessTitle
        theProcessDescription
        showWhyBuy
        whyBuyTitle
        whyBuyDescription
        showTestimonialsSection
      }
    }
  }
`;
