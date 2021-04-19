const { ApolloServer } = require('apollo-server')

const mongoose = require('mongoose')
const models = require('./models')

const queries = require('./typedefs-resolvers/_queries')
const mutations = require('./typedefs-resolvers/_mutations')
const enums = require('./typedefs-resolvers/_enums')
const teams = require('./typedefs-resolvers/teams')
const people = require('./typedefs-resolvers/people')
const roles = require('./typedefs-resolvers/roles')
const equipments = require('./typedefs-resolvers/equipments')
const softwares = require('./typedefs-resolvers/softwares')
const supplies = require('./typedefs-resolvers/supplies')
const tools = require('./typedefs-resolvers/tools')
const givens = require('./typedefs-resolvers/givens')
const users = require('./typedefs-resolvers/users')

const typeDefs = [
    queries,
    mutations,
    enums,
    teams.typeDefs,
    people.typeDefs,
    roles.typeDefs,
    equipments.typeDefs,
    softwares.typeDefs,
    supplies.typeDefs,
    tools.typeDefs,
    givens.typeDefs,
    users.typeDefs
]

const resolvers = [
    teams.resolvers,
    people.resolvers,
    roles.resolvers,
    equipments.resolvers,
    softwares.resolvers,
    supplies.resolvers,
    tools.resolvers,
    givens.resolvers,
    users.resolvers
]

// mongodb connection
// const MONGO_URI = process.env.MONGO_URI
const MONGO_URI = 'mongodb://systest:qwer4321!@mongodb.moonid.co.kr:27017/ams'
if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI');
}

const OPTIONS = {
  // useMongoClient: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: 10, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, OPTIONS);
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

// apollo server
const server =  new ApolloServer({
    typeDefs,
    resolvers,
    playground: true
})

server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`)
})
