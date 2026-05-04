import { gql } from "@apollo/client";

export const VIEWER = gql`
  query Viewer {
    viewer {
      id
      databaseId
      username
      email
      firstName
      lastName
    }
  }
`;
