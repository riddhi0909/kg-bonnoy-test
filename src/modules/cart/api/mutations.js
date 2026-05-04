import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation AddToCart(
    $productId: Int!
    $quantity: Int!
    $variationId: Int
    $variation: [ProductAttributeInput]
  ) {
    addToCart(
      input: {
        productId: $productId
        quantity: $quantity
        variationId: $variationId
        variation: $variation
      }
    ) {
      cart {
        contents {
          nodes {
            key
            quantity
          }
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM_QUANTITY = gql`
  mutation UpdateCartItem($key: ID!, $quantity: Int!) {
    updateItemQuantities(input: { items: [{ key: $key, quantity: $quantity }] }) {
      cart {
        contents {
          nodes {
            key
            quantity
          }
        }
      }
    }
  }
`;
