import {
    gql
} from "@apollo/client";

export const GET_INVESTIR_PAGE_BY_URI = gql`
    query GetInvestirPageByUri($uriId: ID!) {
        page(id: $uriId, idType: URI) {
            investPageAcfField {
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
                showThePotentialSection
                thePotentialTitle
                thePotentialSubHeading
                thePotentialDescription
                thePotentialHighlightText
                thePotentialImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                thePotentialButton{
                    url
                    target
                    title
                }
                showStepSection
                stepSectionList {
                    stepTitle
                    stepSubHeading
                    stepPrefix
                    stepDescription
                    stepImage {
                        node {
                            sourceUrl
                            altText
                        }
                    }
                    stepButton {
                        title
                        url
                        target
                    }
                }

                showInvestmentSection
                investmentTitle
                investmentSubHeading
                investmentImage {
                    node {
                        altText
                        sourceUrl
                    }
                }
                investmentList {
                    investmentAccordionDescription
                    investmentAccordionTitle
                }

                showPerformanceSection
                performanceTitle
                performanceBackgroundImage {
                    node {
                        sourceUrl
                    }
                }
                performanceDescription
                performanceTab {
                    tabHeading
                    stoneInfo
                    tabStoneButton {
                        target
                        title
                        url
                    }
                    tabPerformanceImage {
                        node {
                            altText
                            sourceUrl
                        }
                    }
                }

                showExpertiseSection
                expertiseTitle
                expertiseSubHeading
                expertiseDescription
                expertiseContentList {
                    expertiseListTitle
                    expertiseListDescription
                }
                expertiseImage {
                    node {
                        altText
                        sourceUrl
                    }
                }
                expertiseLeftMasterImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                expertiseButton {
                    target
                    title
                    url
                }

                showFaqSection
                faqDetails {
                    faqTitle
                    faqDescription
                    faqButton {
                        target
                        title
                        url
                    }
                    faqDetailsImage{
                        node {
                            id
                            sourceUrl
                            altText
                        }
                    }
                }

                showSourcingSection
                sourcingImage {
                    node {
                    altText
                    sourceUrl
                    }
                }
                sourcingTitle
                sourcingSubHeading
                sourcingDescription
                sourcingButton {
                    target
                    title
                    url
                }

                showOurOffers
                ourOffersHeading
                ourOffersSubHeading
                managementTabHeading
                managementTabTitle
                managementTabSubHeading
                managementTabHighlightText
                managementTabImage {
                    node {
                        altText
                        sourceUrl
                    }
                }
                managementTabDescription
                managementTabButton {
                    target
                    title
                    url
                }
                portfolioTabHeading
                portfolioTabTitle
                portfolioTabSubHeading
                portfolioTabDescription
                portfolioTabButton {
                    target
                    title
                    url
                }
                portfolioTabHighlightText
                portfolioTabImage {
                    node {
                        altText
                        sourceUrl
                    }
                } 
                showTestimonialsSection
            }
        }
    }
`;


export const GET_GLOBAL_ACF_FIELDS = gql `
  query GetGlobalAcfFields {
    themeSettings {
      globalAcfFields {
        showCenterVideoSection
        centerVideo
    }
  }
}
`;