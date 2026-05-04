import { gql } from "@apollo/client";

export const CUSTOMER_NOOP = gql`
  mutation CustomerNoOp {
    __typename
  }
`;
