const mongoose = require('mongoose')
const { ConfigProvider } = require('../../data/Config')

module.exports = function (server, app) {
    return new Promise((resolve) => {
        mongoose.connection.on('connected', async () => {
            console.log('connected to mongodb:', mongoose.connection.name)
            await ConfigProvider.updateOne(
                {
                    key: 'PROJECT_NAME',
                },
                {
                    key: 'PROJECT_NAME',
                    value: 'Shopbase',
                },
                { upsert: true }
            )
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
