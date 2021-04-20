const { gql } = require('apollo-server')
// const dbWorks = require('../dbWorks.js')
const mongodbWorks = require('../mongodbWorks.js')

const typeDefs = gql`
    type Team {
        _id: ID!
        manager: String!
        office: String
        extension_number: String
        mascot: String,
        cleaning_duty: String!
        project: String
        peoples: [People]
    }

    input PostTeamInput {
        manager: String!
        office: String
        extension_number: String
        mascot: String,
        cleaning_duty: String!
        project: String
    }
`

const resolvers = {
    Query: {
        teams: (parent, args) => mongodbWorks.getTeams(args),
        team: (parent, args) => mongodbWorks.getTeam(args),
    },
    Mutation: {
        postTeam: (parent, args) => mongodbWorks.postTeam(args),
        editTeam: (parent, args) => mongodbWorks.editTeam(args),
        deleteTeam: (parent, args) => mongodbWorks.deleteTeam(args)
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}

/*

mutation {
  postTeam (input: {
    manager: "daniel",
    office: "T-Tower",
    extension_number: "12345678",
    mascot: "Tiger",
    cleaning_duty: "Tuesday",
    project: "CMS"
  }){
    _id,
    manager,
    office,
    extension_number,
    mascot,
    cleaning_duty,
    project
  }
}

mutation{
  editTeam(_id: "60778d7f4811da0f085ae558", input: {
    manager: "HM",
    extension_number: "#1111999",
    mascot: "Monkey",
    cleaning_duty: "Friday"
  }){,
    _id
    manager
    office
    mascot
  }
}

query {
  teams {
    _id
    manager
    office
    extension_number
    mascot
    cleaning_duty
    project
    peoples {
      _id
      first_name
      last_name
      sex
      blood_type
      serve_years
      role{
        _id
      }
      team{
        _id
        manager
        office
        extension_number
        cleaning_duty
        project
      }
    }
  }
}

query {
  team(_id: "606e5a2f3870da23fb6685e6"){
    _id
    manager
    office
    extension_number
    mascot
    cleaning_duty
    project
    peoples{
      _id
      first_name
      last_name
      team{
        manager
      }
      role{
        _id
        role
        job
        requirement
      }
    }
  }
}

*/
