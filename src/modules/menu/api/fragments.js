import { gql } from "@apollo/client";

/** Mega image: link menu parent to a Media item or Page with featured image in WordPress. */
export const MENU_ITEM_FRAGMENT = gql`
  fragment MenuItemFields on MenuItem {
    id
    databaseId
    label
    url
    path
    target
    parentId
    cssClasses
    description
    connectedObject {
      __typename
      ... on MediaItem {
        sourceUrl
        altText
      }
      ... on Page {
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      ... on Post {
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
    childItems {
      nodes {
        id
        label
        url
        path
        target
        cssClasses
      }
    }
  }
`;
