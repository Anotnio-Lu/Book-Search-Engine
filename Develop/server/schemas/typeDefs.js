const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {

  }
  type User {

  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Query {

  }

  type Mutation {

  }
`;

module.exports = typeDefs;
