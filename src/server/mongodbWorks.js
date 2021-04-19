const mongoose = require('mongoose');
const Teams= mongoose.model('team')
const People = mongoose.model('people')
const Role = mongoose.model('role')

const dbWorks = {
    getTeams: (args) => {
        console.log('getTeams' + JSON.stringify(args))

        return Teams.find(args)
                    .populate('peoples')
                    .populate({
                        path: 'peoples',
                        populate: {
                            path: 'team',
                            model: 'team'
                        }
                    })
                    .then((doc) => {
                        console.log(doc)
                        return doc
                    })
                    .catch((err) => {
                        console.error(err)
                    })
    },
    getTeam: (args) => {
        return Teams.findOne(args)
                    .populate('peoples')
                    .populate({
                        path: 'peoples',
                        populate: {
                            path: 'team',
                            model: 'team'
                        }
                    })
                    .populate({
                        path: 'peoples',
                        populate: {
                            path: 'role',
                            model: 'role'
                        }
                    })
                    .then((doc) => {
                        console.log(doc)
                        return doc
                    })
                    .catch((err) => {
                        console.error(err)
                    })
    },
    postTeam: (args) => {
        return Teams.create(args.input)
        .then((doc)=> {
            console.log('postTeam:' + doc)
            return doc
        })
        .catch((err) => {
            console.error(err)
        })
    },
    editTeam: (args) => {
        console.log(args)
        filter = {
            _id: args._id
        }
        update = args.input

        return Teams.findOneAndUpdate(filter, update, {new: true})
                            .then((doc) => {
                                console.log('editteam' + JSON.stringify(doc))
                                return doc
                            })
    },
    deleteTeam: (args) => {
        console.log(args)

        return Teams.findOneAndDelete(args).then((doc)=> {
            console.log('deleted team:' + JSON.stringify(doc))
            return doc
        })
        .catch((err) => {
            console.error(err)
        })
    },
    getRoles: (args) => {
        console.log(JSON.stringify(args))
        return Role.find()
    },
    postRole: (args) => {
        console.log(JSON.stringify(args))
        return Role.create(args.input)
    },
    getPeople: async (args) => {
        console.log(JSON.stringify(args))

        return People.find(args)
                    .populate('role')
                    .populate('team')
                    .then((doc) => {
                        console.log(doc)
                        return doc
                    })
                    .catch((err) => {
                        console.log(err)
                    })
    },
    postPerson: async (args) => {
        // mapping role
        roldId = undefined
        await Role.findOne({'role': args.input.role}, function(err, data){
            roleId = data.id
        })
        args.input.role = roleId

        // create new people
        people = new People(args.input)
        return people.save(args.input).then((doc) => {
            console.log(doc)

            // add people to teams
            filter = {
                _id: doc.team
            }
            update = {
                $push: {peoples: doc.id}
            }

            Teams.findOneAndUpdate(filter, update, {new: true}).then((doc) => {
                console.log('team update result:' + doc)
            })

            return doc
        })
    },
    editPerson: async (args) => {
        console.log(args)

        // mapping role
        await Role.findOne({'role': args.input.role}).then((doc) => {
            args.input.role = doc.id
            console.log('role:' + doc)
        })
        .catch((err) => {
            console.error(err)
        })

        // update
        filter = {
            _id: args._id
        }
        update = args.input

        return People.findByIdAndUpdate(filter, update).then((doc) => {
            console.log(doc)
            return doc
        })
        .catch((err) => {
            console.error(err)
        })
    },
    deletePerson: async (args) => {
        console.log(args)

        filter = {
            _id: args._id
        }

        return People.findOneAndDelete(filter).then((doc) => {
            console.log(doc)
            return doc
        })
    }
}

module.exports = dbWorks
