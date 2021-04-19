const { gql } = require('apollo-server')
const dbWorks = require('../dbWorks.js')
const mongodbWorks = require('../mongodbWorks.js')

const typeDefs = gql`
    type RoleInfo {
        _id: ID!
        role: Role!
        job: String!
        requirement: String
        members: [People]
        equipments: [Equipment]
        softwares: [Software]
    }

    input PostRoleInput {
        role: Role!
        job: String!
        requirement: String
    }
`

const resolvers = {
    Query: {
        roles: (parent, args) => mongodbWorks.getRoles(args),
        // roles: (parent, args) => dbWorks.getRoles(args),
        role: (parent, args) => dbWorks.getRoles(args)[0]
    },
    Mutation: {
        postRole: (parent, args) => mongodbWorks.postRole(args)
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}


/*
mutation {
    postRole(input: {
      role: developer,
      job: "programming",
      requirement: "computer science degree"
    }){
      _id
      job
      requirement
    }
  }
*/
