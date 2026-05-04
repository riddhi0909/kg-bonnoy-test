import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart {
    cart {
      contents {
        nodes {
          key
          quantity
          product {
            node {
              ... on SimpleProduct {
                id
                databaseId
                name
                slug
                price
              }
            }
          }
        }
      }
      total
      subtotal
    }
  }
`;
