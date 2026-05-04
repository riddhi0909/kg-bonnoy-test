import { gql } from "@apollo/client";

export const GET_GENERAL_TERMS_PAGE_BY_URI = gql`
  query GetGeneralTermsPageByUri($uriId: ID!) {
    page(id: $uriId, idType: URI) {
      generalTermsPageAcfField {
        showGeneralTermsSection
        generalTermsDescription
        generalTermsTitle

        showTestimonialSection
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