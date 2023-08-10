import { NextApiRequest, NextApiResponse } from 'next';

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
    users: (
      _: unknown,
      __: unknown,
      { dataSources }: Context
    ): Promise<IUser[]> => {
      return dataSources.DummyAPI.getUsers()
    },
    searchUsers: async (
      _: unknown,
      { key, value, limit }: { key: string, value: string, limit: number },
      { dataSources }: Context
    ): Promise<IUser[]> => {
      return await dataSources.DummyAPI.handleSearchUsers({ key, value, limit })
    }
  },

}

const typeDefs = gql`
  type Coodinates {
    lat: Int
    lng: Int
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
  weight: Int
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

type Query {
  users(input: UsersFilter): [User]
  searchUsers(key: String!, value: String!, limit: Int): [User]
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