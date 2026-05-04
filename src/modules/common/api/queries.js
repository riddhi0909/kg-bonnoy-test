import { gql } from "@apollo/client";

export const GET_CONTACT_PAGE_BY_URI = gql`
  query GetContactPageByUri($uriId: ID!) {
    page(id: $uriId, idType: URI) {
      contactPageAcfFiled {
        showContactSection
        contactPrefix
        contactTitle
        contactDescription
        contactIframe
      }
    }
  }
`;
