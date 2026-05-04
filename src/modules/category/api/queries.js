import {
    gql
} from "@apollo/client";
import {
    RELATED_PRODUCT_FOR_ACF_FRAGMENT
} from "@/modules/product/api/fragments";

export const GET_PRODUCT_CATEGORIES = gql `
  query GetProductCategories($first: Int!, $after: String , $hideEmpty: Boolean = true) {
    productCategories(
      first: $first
      after: $after
      where: { hideEmpty: $hideEmpty }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        parentDatabaseId
        slug
        name
        count
        description
        image {
          sourceUrl
          mediaItemUrl
          altText
        }
      }
    }
  }
`;

/* Category ACF (WPGraphQL for ACF): group must "Show in GraphQL". Names use ACF GraphQL Field Name (camelCase).
   If introspection fails, check the group's GraphQL Type Name (e.g. CategoryAcfFields -> field categoryAcfFields).
   Repeater subfields must match your ACF names (aligned with theme global FAQ: question / answer). */
export const GET_CATEGORY_WITH_PRODUCTS = gql `
  query GetCategoryWithProducts($id: ID!) {
    productCategory(id: $id, idType: SLUG) {
      id
      databaseId
      description
      slug
      name
       image {
          sourceUrl
          mediaItemUrl
          altText
        }
      categoryAcfFields {
        faqTitle
        faq {
          question
          answer
        }
      }
    }
  }
`;

/**
 * Some WPGraphQL/Woo installs expose category filtering through products(where:{category}).
 * Keep as compatibility fallback.
 */
export const GET_CATEGORY_PRODUCTS_BY_WHERE = gql `
  query GetCategoryProductsByWhere($slug: String!, $first: Int!) {
    products(first: $first, where: { category: $slug }) {
      nodes {
        id
        databaseId
        slug
        name
        ... on SimpleProduct {
          shortDescription
          metaData {
            key
            value
          }
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
          price
          regularPrice
          salePrice
          image {
            sourceUrl
            altText
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          galleryImages(first: 8) {
            nodes {
              sourceUrl
              altText
            }
          }
        }
        ... on VariableProduct {
          shortDescription
          metaData {
            key
            value
          }
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
          price
          regularPrice
          salePrice
          image {
            sourceUrl
            altText
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          galleryImages(first: 8) {
            nodes {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
  ${RELATED_PRODUCT_FOR_ACF_FRAGMENT}
`;
;
export const GET_PRODUCTS_BY_CATEGORY_ID = gql `
  query GetProductsByCategoryId($categoryId: Int!, $first: Int!) {
    products(first: $first, where: { categoryId: $categoryId }) {
      nodes {
        id
        databaseId
        slug
        name
        ... on SimpleProduct {
          shortDescription
          metaData {
            key
            value
          }
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
          price
          regularPrice
          salePrice
          image {
            sourceUrl
            altText
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          galleryImages(first: 8) {
            nodes {
              sourceUrl
              altText
            }
          }
        }
        ... on VariableProduct {
          shortDescription
          metaData {
            key
            value
          }
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
          price
          regularPrice
          salePrice
          image {
            sourceUrl
            altText
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          galleryImages(first: 8) {
            nodes {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
  ${RELATED_PRODUCT_FOR_ACF_FRAGMENT}
`;

/**
 * WooCommerce global attributes are taxonomies `pa_*`. WPGraphQL exposes them on `terms`
 * (not `productAttributes`, which many schemas omit).
 * If your slugs differ, adjust the `PA_*` enum in each query to match GraphiQL → TaxonomyEnum.
 */
export const GET_PLP_TERMS_PA_FORME = gql`
  query GetPlpTermsPaForme {
    terms(first: 250, where: { taxonomies: [PA_FORME], hideEmpty: false }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

export const GET_PLP_TERMS_PA_CLARTE = gql`
  query GetPlpTermsPaClarte {
    terms(first: 250, where: { taxonomies: [PA_CLARTE], hideEmpty: false }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

export const GET_PLP_TERMS_PA_TRAITEMENT = gql`
  query GetPlpTermsPaTraitement {
    terms(first: 250, where: { taxonomies: [PA_TRAITEMENT], hideEmpty: false }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

export const GET_PLP_TERMS_PA_ORIGINE = gql`
  query GetPlpTermsPaOrigine {
    terms(first: 250, where: { taxonomies: [PA_ORIGINE], hideEmpty: false }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

/** Fallback: aggregate attribute options from many products (counts ≤ `first`, not full store). */
export const GET_PLP_PRODUCTS_ATTRIBUTE_AGGREGATE = gql`
  query GetPlpProductsAttributeAggregate($first: Int!) {
    products(first: $first) {
      nodes {
        id
        ... on ProductWithAttributes {
          attributes {
            nodes {
              name
              label
              options
            }
          }
        }
      }
    }
  }
`;

export const GET_GLOBAL_ACF_FIELDS = gql `
  query GetCategoryPostBlock {
    themeSettings {
      globalAcfFields {
        showCategoryPostBlockSection
        categoryPostBlock {
            categoryPostTitle
            categoryPostSubTitle
            categoryPostButtonTitle
            categoryPostButtonLink
            categoryPostImage {
              node {
                sourceUrl
                altText
              }
            }
            categoryPostVideo {
              node {
                mediaItemUrl
              }
            }
        }
        showImageWithTextSection
        sourcingImage {
          node {
            sourceUrl
            altText
          }
        }
        sourcingTitle
        sourcingSubTitle
        sourcingDescription
        sourcingButtonTitle
        sourcingButtonUrl
        showIconWithTextSection
        iconWithText {
          icon {
            node {
              sourceUrl
              altText
            }
          }
          title
          description
        }
        categoryTitle
        categoryDescription
        subcategoryTitle
      }
    }
  }
`;