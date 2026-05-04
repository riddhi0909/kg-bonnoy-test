import { gql } from "@apollo/client";
import { MENU_ITEM_FRAGMENT } from "@/modules/menu/api/fragments";

export const GET_MENU_BY_LOCATION = gql`
  query GetMenuByLocation($location: MenuLocationEnum!, $first: Int!) {
    menuItems(first: $first, where: { location: $location }) {
      nodes {
        ...MenuItemFields
      }
    }
  }
  ${MENU_ITEM_FRAGMENT}
`;

export const GET_MENU_BY_NAME = gql`
  query GetMenuByName($id: ID!) {
    menu(id: $id, idType: NAME) {
      id
      menuItems(first: 100) {
        nodes {
          ...MenuItemFields
        }
      }
    }
  }
  ${MENU_ITEM_FRAGMENT}
`;

/**
 * Minimal-safe fallbacks for WPGraphQL installs that don't expose
 * advanced MenuItem fields in fragments.
 */
export const GET_MENU_BY_LOCATION_BASIC = gql`
  query GetMenuByLocationBasic($location: MenuLocationEnum!, $first: Int!) {
    menuItems(first: $first, where: { location: $location }) {
      nodes {
        id
        databaseId
        label
        url
        parentId
        childItems {
          nodes {
            id
            databaseId
            label
            url
            parentId
          }
        }
      }
    }
  }
`;

export const GET_MENU_BY_NAME_BASIC = gql`
  query GetMenuByNameBasic($id: ID!) {
    menu(id: $id, idType: NAME) {
      id
      menuItems(first: 100) {
        nodes {
          id
          databaseId
          label
          url
          parentId
          connectedObject {
            ... on ProductCategory {
              name
              slug
              image {
                sourceUrl
              }
            }
          }
          childItems {
            nodes {
              id
              label
              url
              uri
              connectedObject {
                ... on ProductCategory {
                  name
                  slug
                  image {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/** Optional: WP page slug e.g. header-announcement — edit in Appearance or Pages */
export const GET_HEADER_ANNOUNCEMENT = gql`
  query GetHeaderAnnouncement($id: ID!) {
    page(id: $id, idType: SLUG) {
      content
    }
  }
`;