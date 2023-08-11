

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

export const GET_ALL_PRODUCTS = gql`
query AllProducts($limit: Int, $skip: Int) {
  allProducts(limit: $limit, skip: $skip) {
    products {
      id
      title
      thumbnail
      price
      category
    }
    limit
    skip
    total
  }
}`

export const SEARCH_PRODUCTS = gql`
query SearchProducts($q: String!) {
  searchProducts(q: $q) {
    id
    title
    thumbnail
    price
    category
  }
}`

export const GET_PRODUCT = gql`
query Product($id: Int!) {
  product(id: $id) {
    id
    title
    thumbnail
    discountPercentage
    rating
    stock
    brand
    price
    category
    description
    images
  }
}` 