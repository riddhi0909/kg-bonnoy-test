import { gql } from "@apollo/client";

export const ORDER_NOOP = gql`
  mutation OrderNoOp {
    __typename
  }
`;
