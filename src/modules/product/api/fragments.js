import {
    gql
} from "@apollo/client";

/**
 * Related products from ACF relationship — use `... on Product` so WPGraphQL resolves
 * featuredImage (NodeWithFeaturedImage) even when the concrete type isn’t only Simple/Variable.
 */
export const RELATED_PRODUCT_FOR_ACF_FRAGMENT = gql `
  fragment RelatedProductForAcf on Product {
    id
    databaseId
    slug
    name
    shortDescription
    ... on ProductWithAttributes {
      attributes {
        nodes {
          name
          label
          options
        }
      }
    }
    productCategories(first: 8) {
      nodes {
        name
        slug
      }
    }
    productTags(first: 8) {
      nodes {
        name
        slug
      }
    }
    ... on NodeWithFeaturedImage {
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
      metaData {
        key
        value
      }
      stockStatus
      manageStock
      stockQuantity
      image {
        sourceUrl
        altText
      }
      galleryImages(first: 1) {
        nodes {
          sourceUrl
          altText
        }
      }
    }
    ... on VariableProduct {
      price
      regularPrice
      salePrice
      metaData {
        key
        value
      }
      stockStatus
      manageStock
      stockQuantity
      image {
        sourceUrl
        altText
      }
      galleryImages(first: 1) {
        nodes {
          sourceUrl
          altText
        }
      }
    }
  }
`;

/**
 * Reusable fields for list cards. Adjust inline fragments for your WooCommerce product types.
 */
export const PRODUCT_CARD_FRAGMENT = gql `
  fragment ProductCardFields on Product {
    id
    databaseId
    slug
    name
    type
    shortDescription
    ... on ProductWithAttributes {
      attributes {
        nodes {
          name
          label
          options
        }
      }
    }
    productCategories(first: 8) {
      nodes {
        name
        slug
      }
    }
    productTags(first: 8) {
      nodes {
        name
        slug
      }
    }
    productAcfFields {
      showRealatedProductsSection
      selectRelatedProduct {
        nodes {
          ...RelatedProductForAcf
        }
      }
    }
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
      metaData {
        key
        value
      }
      image {
        sourceUrl
        altText
      }
      galleryImages(first: 8) {
        nodes {
          sourceUrl
          altText
        }
      }
    }
    ... on VariableProduct {
      price
      regularPrice
      salePrice
      metaData {
        key
        value
      }
      image {
        sourceUrl
        altText
      }
      galleryImages(first: 8) {
        nodes {
          sourceUrl
          altText
        }
      }
    }
    ... on NodeWithFeaturedImage {
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
  ${RELATED_PRODUCT_FOR_ACF_FRAGMENT}
`;

export const PRODUCT_DETAIL_FRAGMENT = gql `
  fragment ProductDetailFields on Product {
    id
    databaseId
    slug
    name
    description
    shortDescription
    type
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
      stockStatus
      manageStock
      stockQuantity
      image {
        sourceUrl
        altText
      }
    }
    ... on VariableProduct {
      price
      regularPrice
      stockStatus
      manageStock
      stockQuantity
      image {
        sourceUrl
        altText
      }
    }
    ... on NodeWithFeaturedImage {
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;