const mongoose = require('mongoose')
mongoose.plugin(require('mongoose-slug-updater'))
mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
        converted.id = doc._id
        delete converted.__v
    },
})

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
