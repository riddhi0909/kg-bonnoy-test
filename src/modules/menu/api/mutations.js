import { gql } from "@apollo/client";

export const MENU_NOOP = gql`
  mutation MenuNoOp {
    __typename
  }
`;
