const { gql } = require('apollo-server')

const typeDefs = gql`
    type Mutation {
        postTeam(input: PostTeamInput!): Team!,
        editTeam(
            _id: ID!,
            input: PostTeamInput!
        ): Team!
        deleteTeam(_id: ID!): Team!

        postPerson(input: PostPersonInput): People!,
        editPerson(
            _id: ID!,
            input: PostPersonInput!
        ): People!
        deletePerson(_id: ID!): People!

        postEquipment(
            id: ID!,
            used_by: Role!,
            count: Int,
            new_or_used: NewOrUsed!
        ): Equipment!
        increaseEquipment(
            id: ID!,
        ): Equipment!

        postRole(input: PostRoleInput): RoleInfo!
    }
`

module.exports = typeDefs
