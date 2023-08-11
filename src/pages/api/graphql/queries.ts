

import { gql } from "@apollo/client";


export const GET_ALL_USERS = gql`
query AllUsers($limit: Int, $skip: Int) {
  allUsers(limit: $limit, skip: $skip) {
    users {
    id
    firstName
    age
    image
    phone
    }
    limit
    skip
    total
  }
}
`;

export const SEARCH_USERS = gql`
  query SearchUsers($q: String!,) {
    searchUsers(q: $q) {
      id
      firstName
      age
      image
      phone
    }
  }
`;

export const GET_USER = gql`
query User($id: Int!) {
  user(id: $id) {
    id
    age
    bank {
      cardExpire
      cardNumber
      cardType
      currency
      iban
    }
    address {
      address
      city
      coordinates {
        lat
        lng
      }
      postalCode
      state
    }
    birthDate
    bloodGroup
    company {
      address {
        address
        city
        coordinates {
          lat
          lng
        }
        postalCode
        state
      }
      department
      name
      title
    }
    domain
    ein
    email
    eyeColor
    firstName
    gender
    hair {
      color
      type
    }
    height
    image
    ip
    lastName
    macAddress
    maidenName
    password
    phone
    ssn
    university
    userAgent
    username
    weight
  }
}`