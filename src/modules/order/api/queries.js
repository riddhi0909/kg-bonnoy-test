import { gql } from "@apollo/client";

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($customerId: ID!, $first: Int!) {
    customer(id: $customerId, idType: DATABASE_ID) {
      id
      orders(first: $first) {
        nodes {
          id
          databaseId
          orderNumber
          date
          status
          total
        }
      }
    }
  }
`;
