import { gql } from "@apollo/client";

/** Use alongside JWT plugin — refresh token flow if your schema exposes it */
export const AUTH_SCHEMA_CHECK = gql`
  query AuthSchemaCheck {
    __typename
  }
`;
