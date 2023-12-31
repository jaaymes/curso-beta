import { NextApiRequest, NextApiResponse } from 'next';

import { IProducts } from '@/interfaces/products';
import { IUser } from '@/interfaces/users';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from "graphql-tag";

import { DummyAPI } from '../dummyAPI';

interface DataSources {
  DummyAPI: DummyAPI;
}

interface Context {
  dataSources: DataSources;
}

const resolvers = {
  Query: {
    allUsers: (
      _: unknown,
      { limit, skip }: { skip: number, limit: number },
      { dataSources }: Context
    ): Promise<IUser[]> => {
      return dataSources.DummyAPI.getUsers({ limit, skip })
    },
    searchUsersFilter: async (
      _: unknown,
      { key, value, limit }: { key: string, value: string, limit: number },
      { dataSources }: Context
    ): Promise<IUser[]> => {
      return await dataSources.DummyAPI.handleSearchUsersFilter({ key, value, limit })
    },
    searchUsers: async (
      _: unknown,
      { q }: { q: string },
      { dataSources }: Context
    ): Promise<IUser[]> => {
      return await dataSources.DummyAPI.handleSearch({ q })
    },
    user: (
      _: unknown,
      { id }: { id: number },
      { dataSources }: Context
    ): Promise<IUser> => {
      return dataSources.DummyAPI.getUser(id)
    },
    allProducts: (
      _: unknown,
      { limit, skip }: { skip: number, limit: number },
      { dataSources }: Context
    ): Promise<IProducts[]> => {
      return dataSources.DummyAPI.getProducts({ limit, skip })
    },
    searchProductsFilter: async (
      _: unknown,
      { key, value, limit }: { key: string, value: string, limit: number },
      { dataSources }: Context
    ): Promise<IProducts[]> => {
      return await dataSources.DummyAPI.handleSearchProductsFilter({ key, value, limit })
    },
    searchProducts: async (
      _: unknown,
      { q }: { q: string },
      { dataSources }: Context
    ): Promise<IProducts[]> => {
      return await dataSources.DummyAPI.handleSearchProducts({ q })
    },
    product: (
      _: unknown,
      { id }: { id: number },
      { dataSources }: Context
    ): Promise<IProducts> => {
      return dataSources.DummyAPI.getProduct(id)
    },
  },

}

const typeDefs = gql`
  type Coodinates {
    lat: String
    lng: String
  }

 type  Hair {
    color: String
    type: String
  }

  type Address {
    address: String
    city: String,
    coordinates: Coodinates
    postalCode: String
    state: String
  }

  type Bank {
    cardExpire: String
    cardNumber: String,
    cardType: String
    currency: String
    iban: String
  }

  type Company {
    address: Address
    department: String
    name: String
    title: String
  }

  type User {
  id: Int
  firstName: String
  lastName: String
  maidenName: String
  age: Int
  gender: String
  email: String
  phone: String
  username: String
  password: String
  birthDate: String
  image: String
  bloodGroup: String
  height: Int
  weight: String
  eyeColor: String
  hair: Hair
  domain: String
  ip: String
  address: Address
  macAddress: String
  university: String
  bank: Bank
  company: Company
  ein: String
  ssn: String
  userAgent: String
}

input UsersFilter {
  firstName: String
}

type Product {
  id: Int
  title: String
  description: String
  price: Float
  discountPercentage: Float
  rating: Float
  stock: Int
  brand: String
  category: String
  thumbnail: String
  images: [String]
}

type UsersData {
  users: [User]
  limit: Int
  skip: Int
  total: Int
}

type ProductsData {
  products: [Product]
  limit: Int
  skip: Int
  total: Int
}

type Query {
  allUsers(limit: Int, skip: Int): UsersData
  searchUsersFilter(key: String!, value: String!, limit: Int): [User]
  searchUsers(q: String!): [User]
  user(id: Int!): User
  allProducts(limit: Int, skip: Int): ProductsData
  searchProductsFilter(key: String!, value: String!, limit: Int): [Product]
  searchProducts(q: String!): [Product]
  product(id: Int!): Product
}
`

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req: NextApiRequest, res: NextApiResponse) => {
    const dataSources: DataSources = {
      DummyAPI: new DummyAPI(),
    }
    return { dataSources, req, res }
  }
})