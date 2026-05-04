import { gql } from "@apollo/client";
import { PRODUCT_CARD_FRAGMENT } from "@/modules/product/api/fragments";

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!, $first: Int!) {
    products(where: { search: $search }, first: $first) {
      nodes {
        ...ProductCardFields
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
