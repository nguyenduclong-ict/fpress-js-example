const { Schema, model } = require('mongoose')
const { Types } = Schema

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Types.Date, default: Date.now },
})

// HOOKS

// END HOOKS
module.exports = model('Taxonomy', schema)
