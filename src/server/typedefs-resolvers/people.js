const { gql } = require('apollo-server')
const { mongo } = require('mongoose')
const dbWorks = require('../dbWorks.js')
const mongodbWorks = require('../mongodbWorks.js')

const typeDefs = gql`
    type People {
        _id: ID!
        first_name: String!
        last_name: String!
        sex: Sex!
        blood_type: BloodType!
        serve_years: Int!
        role: RoleInfo
        team: Team
        from: String!
        tools: [Tool]
        givens: [Given]
    }

    input PostPersonInput {
        first_name: String!
        last_name: String!
        sex: Sex!
        blood_type: BloodType!
        serve_years: Int!
        role: Role!
        team: ID!
        from: String
    }
`

const resolvers = {
    Query: {
        people: async (parent, args) => mongodbWorks.getPeople(args),
        // people: (parent, args) => dbWorks.getPeople(args),
        person: (parent, args) => dbWorks.getPeople(args)[0]
    },
    Mutation: {
        postPerson: async (parent, args) => mongodbWorks.postPerson(args),
        editPerson: async (parent, args) => mongodbWorks.editPerson(args),
        // editPerson: (parent, args) => dbWorks.editPerson(args),
        deletePerson: (parent, args) => mongodbWorks.deletePerson(args)
        // deletePerson: (parent, args) => dbWorks.deleteItem('people', args)
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}

/*
mutation {
  postPerson(input: {
    first_name: "Daniel",
    last_name: "Moon",
    sex: male,
    blood_type: AB,
    serve_years: 10,
    role: developer,
    team: "60778d7f4811da0f085ae558",
    from: "Seoul Korea",
  }){
    _id
    first_name
    last_name
  }
}
*/
