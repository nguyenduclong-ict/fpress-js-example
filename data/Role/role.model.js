const { Schema, model } = require('mongoose')
const { Types } = Schema

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    permissions: [
        {
            type: Types.ObjectId,
            ref: 'Permission',
        },
    ],
    isSystem: {
        type: Boolean,
        default: false,
    },
    fullPermission: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Types.Date, default: Date.now },
})

// HOOKS

// END HOOKS
module.exports = model('Role', schema)
