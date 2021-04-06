require("dotenv").config()

const dbWorks = {
    getTeams: (args) => dataFiltered('teams', args)
        .map((team) => {
            team.members = dbWorks.getPeople({ team: team.id })
            return team
        }),
   getSupplies: (args) => dataFiltered('supplies', args),
}

module.exports = dbWorks
