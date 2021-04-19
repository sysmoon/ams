const { gql } = require('apollo-server')
const relayWorks = require('../relayWorks.js')

const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        age: Int!
        companyId: String!
    }

    input PostUserInput {
        firstName: String!
        age: Int!
        companyId: String!
    }
`

const resolvers = {
    Query: {
        users: async (parent, args) => relayWorks.getUsers(args),
    },
    Mutation: {
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}

/*

query {
  users (age: 40){
    id
    firstName
    companyId
    age
  }
}

*/
