import {
    gql
} from "@apollo/client";

export const GET_CUSTOM_MADE_PAGE_BY_URI = gql`
    query GetCustomMadePageByUri($uriId: ID!) {
        page(id: $uriId, idType: URI) {
            customMadePageAcfField {
                showHeroPageSection
                pageHeroTitle1
                pageHeroTitle2
                pageHeroImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                showBreadcrumbSection
                breadcrumbFirstTitle
                breadcrumbFirstTitleLink
                breadcrumbSecondTitle
                breadcrumbSecondTitleLink
                showJewelryInfoSection
                jewelryInfoTitle
                jewelryInfoSubHeading
                jewelryInfoDescription
                jewelryInfoButtonTitle
                jewelryInfoButtonLink
                jewelryInfoImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                showStepSection
                stepSectionList{
                    stepNumber
                    stepTitle
                    stepHighlightedText
                    stepDescription
                    stepButtonText
                    stepButtonLink
                    stepImage {
                        node {
                            sourceUrl
                            altText
                        }
                    }
                }
                showOurAchievementsSection
                ourAchievementsTitle
                ourAchievementsSubHeading
                ourAchievementsButtonTitle
                ourAchievementsButtonLink
                showBonnotHouseParisSection
                bonnotHouseParisImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                bonnotHouseParisTitle
                bonnotHouseParisDescription
                bonnotHouseParisHighlightedText
                bonnotHouseParisButtonTitle
                bonnotHouseParisButtonLink
                showOurKnowSection
                ourKnowLeftImage {
                    node {
                        id
                        sourceUrl
                        altText
                    }
                }
                ourKnowLeftMasterImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                ourKnowTitle
                ourKnowDescription
                ourKnowContentList {
                    fieldGroupName
                    ourKnowContent
                }
                ourKnowSubHeading
                ourKnowButtonTitle
                ourKnowButtonLink
                showCertificationBySection
                certificationByImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                certificationByTitle
                certificationBySubHeading
                certificationByDescription
                certificationByButtonTitle
                certificationByButtonLink
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

export const GET_ACHIEVEMENTS_POSTS = gql `
  query GetachievementsPost {
    allAchievementsPost(where: { status: PUBLISH, orderby: { field: DATE, order: ASC} }) {
      nodes {
        uri
        title
        featuredImage {
          node {
            altText
            sourceUrl
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