import {
    gql
} from "@apollo/client";

export const GET_MAISON_BONNOT_PAGE_BY_URI = gql`
    query GetMaisonBonnotPageByUri($uriId: ID!) {
        page(id: $uriId, idType: URI) {
            maisonBonnotPageAcfField {
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
                jewelryInfoHighlightedText
                jewelryInfoButtonTitle
                jewelryInfoButtonLink
                jewelryInfoImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                showPassionSection
                passionSectionLeftImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                passionSectionTitle
                passionSectionDescription
                passionSectionSubDescription
                passionSectionButtonTitle
                passionSectionButtonLink
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
                showExceptionalSourcing
                exceptionalSourcingImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                exceptionalSourcingTitle
                exceptionalSourcingSubHeading
                exceptionalSourcingDescription
                exceptionalSourcingHighlightedText
                exceptionalSourcingButtonTitle
                exceptionalSourcingButtonLink
                showOurPhilosophy
                ourPhilosophyTitle
                ourPhilosophyDescription
                ourPhilosophyImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                ourPhilosophyAccordion{
                    ourPhilosophyAccordionTitle
                    ourPhilosophyAccordionDescription
                }
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