const mongoose = require('mongoose')

module.exports = function (server, app) {
    return new Promise((resolve) => {
        mongoose.connection.on('connected', async () => {
            console.log('connected to mongodb:', mongoose.connection.name)
            // DONE
            resolve()
        })

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
        mongoose.connect(process.env.MONGO_URI, options)
    })
}
