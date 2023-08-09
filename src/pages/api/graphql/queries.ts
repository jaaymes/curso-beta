

import { gql } from "@apollo/client";


export const GET_ALL_USERS = gql`
  query  USERS {
    username
    password
  }
`