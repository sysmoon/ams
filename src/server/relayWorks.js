const axios = require('axios')

const dbWorks = {
    getUsers: (args) => {
        console.log('getUsers' + JSON.stringify(args))

        return axios.get('http://localhost:5000/users', {
            params: args
        })
            .then((Response) => {
                console.log(Response.data)
                return Response.data
            })
            .catch((err) => {

                console.error(err)
            })

    }
}

module.exports = dbWorks
