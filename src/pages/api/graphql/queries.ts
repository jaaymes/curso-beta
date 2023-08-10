

import { gql } from "@apollo/client";


export const GET_ALL_USERS = gql`
  query Users {
  users {
    id
    firstName
    age
    image
    phone
  }
}
`;

export const SEARCH_USERS = gql`
  query SearchUsers($key: String!, $value: String!, $limit: Int) {
    searchUsers(key: $key, value: $value, limit: $limit) {
      id
      firstName
      age
      image
      phone
    }
  }
`;