import { gql } from "@apollo/client";

/** Example: extend when your schema exposes product mutations */
export const PLACEHOLDER_PRODUCT_MUTATION = gql`
  mutation ProductNoOp {
    __typename
  }
`;
