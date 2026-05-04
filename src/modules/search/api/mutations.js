import { gql } from "@apollo/client";

export const SEARCH_NOOP = gql`
  mutation SearchNoOp {
    __typename
  }
`;
