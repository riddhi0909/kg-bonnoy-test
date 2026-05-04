import { gql } from "@apollo/client";

export const GET_CHECKOUT_DATA = gql`
  query GetCheckoutData($billingCountry: CountriesEnum!, $shippingCountry: CountriesEnum!) {
    cart(recalculateTotals: true) {
      isEmpty
      subtotal
      shippingTotal
      total
      needsShippingAddress
      chosenShippingMethods
      availableShippingMethods {
        packageDetails
        rates {
          id
          methodId
          instanceId
          label
          cost
        }
      }
      contents {
        nodes {
          key
          quantity
          total
          variation {
            attributeName
            attributeValue
          }
          product {
            node {
              ... on SimpleProduct {
                id
                databaseId
                name
                slug
                price
              }
              ... on VariableProduct {
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
    }
    customer {
      billing {
        firstName
        lastName
        company
        country
        address1
        address2
        city
        state
        postcode
        email
        phone
      }
      shipping {
        firstName
        lastName
        company
        country
        address1
        address2
        city
        state
        postcode
        phone
      }
    }
    paymentGateways {
      nodes {
        id
        title
        description
      }
    }
    countries
    billingStates: countryStates(country: $billingCountry) {
      code
      name
    }
    shippingStates: countryStates(country: $shippingCountry) {
      code
      name
    }
  }
`;
