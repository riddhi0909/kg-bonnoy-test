import { gql } from "@apollo/client";

export const EMPTY_CART = gql`
  mutation EmptyCart {
    emptyCart(input: {}) {
      cart {
        isEmpty
      }
    }
  }
`;

export const ADD_CART_ITEMS = gql`
  mutation AddCartItems($items: [CartItemInput]) {
    addCartItems(input: { items: $items }) {
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

export const UPDATE_SHIPPING_METHOD = gql`
  mutation UpdateShippingMethod($shippingMethods: [String]) {
    updateShippingMethod(input: { shippingMethods: $shippingMethods }) {
      cart {
        chosenShippingMethods
        shippingTotal
        total
      }
    }
  }
`;

export const UPDATE_CUSTOMER_FOR_SHIPPING = gql`
  mutation UpdateCustomerForShipping($billing: CustomerAddressInput, $shipping: CustomerAddressInput) {
    updateCustomer(input: { billing: $billing, shipping: $shipping, shippingSameAsBilling: false }) {
      customer {
        billing {
          country
          postcode
          state
          city
          address1
        }
        shipping {
          country
          postcode
          state
          city
          address1
        }
      }
    }
  }
`;

export const CHECKOUT_ORDER = gql`
  mutation CheckoutOrder($input: CheckoutInput!) {
    checkout(input: $input) {
      result
      redirect
      order {
        id
        orderNumber
        status
        total
      }
    }
  }
`;
