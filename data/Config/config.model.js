const { Schema, model } = require('mongoose')
const { Types } = Schema

const schema = new Schema({
    key: {
        type: String,
        unique: true,
    },
    value: Types.Mixed,
    createdAt: { type: Types.Date, default: Date.now },
})

// HOOKS

// END HOOKS
module.exports = model('Config', schema)
