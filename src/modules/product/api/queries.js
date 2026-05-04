import {
  gql
} from "@apollo/client";
import {
  PRODUCT_CARD_FRAGMENT
} from "@/modules/product/api/fragments";

export const GET_PRODUCT_GLOBAL_SETTINGS = gql `
query GetProductGlobalSettings {
  themeSettings {
    globalAcfFields {
      faq {
        question
        answer
      }
       productDescriptionLink  {
        productDescriptionTitle
        productDescriptionTextLink
      }
      showProfileSection
      profileImage {
        node {
          sourceUrl
          altText
        }
      }
      profileTitle
      profileDescription
      profileButtonTitle
      profileButtonLink
      icaImage {
        node {
          sourceUrl
        }
      }
      icaTitle
      icaDescription
    }
  }
}
`;

/** One round-trip: theme global ACF + homepage stories blocks only (not full GET_HOME_OPTIONS). */
export const GET_PRODUCT_PAGE_THEME_AND_STORIES = gql`
  query GetProductPageThemeAndStories {
    themeSettings {
      globalAcfFields {
        faq {
          question
          answer
        }
        productDescriptionLink {
          productDescriptionTitle
          productDescriptionTextLink
        }
        showProfileSection
        profileImage {
          node {
            sourceUrl
            altText
          }
        }
        profileTitle
        profileDescription
        profileButtonTitle
        profileButtonLink
        icaImage {
          node {
            sourceUrl
          }
        }
        icaTitle
        icaDescription
      }
    }
    homeSettings {
      homepageAcfFields {
        showStoriesSection
        storiesProfileTitle
        storiesProfileImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesProfileDescription
        storiesProfileButtonTitle
        storiesProfileButtonLink
        storiesCol1TopImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesCol1TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol1TopImageTitle
        storiesCol1BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesCol1BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol1BottomImageTitle
        storiesCol2TopImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesCol2TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol2TopImageTitle
        storiesCol2CenterImage {
          node {
            sourceUrl
            altText
          }
        }
        storiesCol2CenterVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol2CenterImageTitle
        storiesCol2BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol2BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol2BottomImageTitle
        storiesCol3BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol3BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol3BottomImageTitle
        storiesCol4TopImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol4TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol4TopImageTitle
        storiesCol4CenterImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol4CenterVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol4CenterImageTitle
        storiesCol4BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol4BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol4BottomImageTitle
        storiesCol5TopImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol5TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol5TopImageTitle
        storiesCol5BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        storiesCol5BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        storiesCol5BottomImageTitle
        showSecondStoriesSection
        secondStoriesProfileImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesProfileDescription
        secondStoriesProfileButtonTitle
        secondStoriesProfileButtonLink
        secondStoriesCol1TopImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesCol1TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol1TopImageTitle
        secondStoriesCol1BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesCol1BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol1BottomImageTitle
        secondStoriesCol2TopImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesCol2TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol2TopImageTitle
        secondStoriesCol2CenterImage {
          node {
            sourceUrl
            altText
          }
        }
        secondStoriesCol2CenterVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol2CenterImageTitle
        secondStoriesCol2BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol2BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol2BottomImageTitle
        secondStoriesCol3BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol3BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol3BottomImageTitle
        secondStoriesCol4TopImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol4TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol4TopImageTitle
        secondStoriesCol4CenterImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol4CenterVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol4CenterImageTitle
        secondStoriesCol4BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol4BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol4BottomImageTitle
        secondStoriesCol5TopImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol5TopVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol5TopImageTitle
        secondStoriesCol5BottomImage {
          node {
            altText
            sourceUrl
          }
        }
        secondStoriesCol5BottomVideo {
          node {
            mediaItemUrl
            mediaType
            mimeType
          }
        }
        secondStoriesCol5BottomImageTitle
      }
    }
  }
`;

export const GET_PRODUCTS = gql `
query GetProducts($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...ProductCardFields
    }
  }
}
${PRODUCT_CARD_FRAGMENT}
`;

export const GET_SHAPE_ATTRIBUTE_TERMS = gql `
query GetShapeAttributeTerms {
  productAttributes(first: 100) {
    nodes {
      name
      slug
      label
      terms(first: 200, where: { hideEmpty: false }) {
        nodes {
          name
          slug
        }
      }
    }
  }
}
`;

export const GET_PRODUCTS_FOR_SHAPE_OPTIONS = gql `
query GetProductsForShapeOptions($first: Int!) {
  products(first: $first) {
    nodes {
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
export const GET_PRODUCT_BY_SLUG = gql `
query GetProductBySlug($id: ID!, $idType: ProductIdTypeEnum = SLUG) {
  product(id: $id, idType: $idType) {
    id
    databaseId
    slug
    name
    description
    shortDescription
    ... on ProductWithAttributes {
      attributes {
        nodes {
          name
          label
          variation
          options
        }
      }
    }
    type
    productCategories(first: 10) {
      nodes {
        slug
        name
        count
      }
    }
    seo {
      title
      opengraphDescription
      metaDesc
    }
    ... on Product {
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
      galleryImages {
        nodes {
          mediaItemUrl
          altText
        }
      }
      productAcfFields {
        productType
        productGallery {
          nodes {
            mimeType
            mediaItemUrl
            altText
          }
        }
        
        productDescriptionLink {
          productDescriptionTitle
          productDescriptionTextLink
        }

         selectRelatedProduct {
          nodes {
            id
            slug
            uri
            ... on Product {
              id
              databaseId
              slug
              uri
              name
              ... on ProductWithAttributes {
                attributes {
                  nodes {
                    name
                    label
                    variation
                    options
                  }
                }
               
              }
              image {
                sourceUrl
                altText
              }
              featuredImage {
                node {
                  sourceUrl
                }
              }
              productCategories {
                nodes {
                  name
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
              galleryImages(first: 2) {
                nodes {
                  sourceUrl
                  mediaItemUrl
                  altText
                }
              }
            }
            ... on VariableProduct {
              price
              regularPrice
              metaData {
                key
                value
              }
              ... on ProductWithAttributes {
                attributes {
                  nodes {
                    name
                    label
                    variation
                    options
                  }
                }
              }
              variations(first: 100) {
                nodes {
                  attributes {
                      nodes {
                        label
                        name
                        value
                      }
                  }
                  metaData {
                      key
                      value
                  }
                  id
                  databaseId
                  price
                  regularPrice
                  salePrice
                  stockStatus
                  manageStock
                  stockQuantity
                  metaData {
                    key
                    value
                  }
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
              galleryImages(first: 2) {
                nodes {
                  sourceUrl
                  mediaItemUrl
                  altText
                }
              }
            }
          }
        }
          
        productDetail
        showRealatedProductsSection
      }
    }
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
      stockStatus
      manageStock
      stockQuantity
      metaData {
        key
        value
      }
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
      galleryImages {
        nodes {
          mimeType
          mediaItemUrl
          altText
        }
      }
    }
    ... on VariableProduct {
      price
      regularPrice
      stockStatus
      manageStock
      stockQuantity
      metaData {
        key
        value
      }
      ... on ProductWithAttributes {
        attributes {
          nodes {
            name
            label
            variation
            options
          }
        }
      }
      
      variations(first: 100) {
        nodes {
          attributes {
              nodes {
                label
                name
                value
              }
          }
          metaData {
              key
              value
          }
          id
          databaseId
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
          featuredImage {
            node {
              sourceUrl
              altText
            }
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
        }
      }
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
      galleryImages {
        nodes {
          mimeType
          mediaItemUrl
          altText
        }
      }
    }
  }
}
`;

export const GET_PRODUCT_BY_SLUG_DEFERRED_TEXT = `
query GetProductBySlugDeferred($id: ID!, $idType: ProductIdTypeEnum = SLUG) {
  product(id: $id, idType: $idType) {
    id
    slug
    ... on Product {
      productAcfFields {
        selectRelatedProduct {
          nodes {
            id
            slug
            uri
            ... on Product {
              id
              databaseId
              slug
              uri
              name
              ... on ProductWithAttributes {
                attributes {
                  nodes {
                    name
                    label
                    variation
                    options
                  }
                }
               
              }
              image {
                sourceUrl
                altText
              }
              featuredImage {
                node {
                  sourceUrl
                }
              }
              productCategories {
                nodes {
                  name
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
              galleryImages(first: 2) {
                nodes {
                  sourceUrl
                  mediaItemUrl
                  altText
                }
              }
            }
            ... on VariableProduct {
              price
              regularPrice
              metaData {
                key
                value
              }
              ... on ProductWithAttributes {
                attributes {
                  nodes {
                    name
                    label
                    variation
                    options
                  }
                }
              }
              variations(first: 100) {
                nodes {
                  attributes {
                      nodes {
                        label
                        name
                        value
                      }
                  }
                  metaData {
                      key
                      value
                  }
                  id
                  databaseId
                  price
                  regularPrice
                  salePrice
                  stockStatus
                  manageStock
                  stockQuantity
                  metaData {
                    key
                    value
                  }
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
              galleryImages(first: 2) {
                nodes {
                  sourceUrl
                  mediaItemUrl
                  altText
                }
              }
            }
          }
        }
      }
    }
    ... on VariableProduct {
      variations(first: 100) {
        nodes {
          attributes {
              nodes {
                label
                name
                value
              }
          }
          metaData {
              key
              value
          }
          id
          databaseId
          metaData {
            key
            value
          }
        }
      }
    }
  }
}
`;

export const GET_PRODUCT_BY_SLUG_DEFERRED = gql`
${GET_PRODUCT_BY_SLUG_DEFERRED_TEXT}
`;