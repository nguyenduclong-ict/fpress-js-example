const { Schema, model } = require('mongoose')
const { Types } = Schema

const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    facebook: {
        type: String,
    },
    profile: {
        avatar: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        age: {
            type: Number,
            default: 0,
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            default: 'male',
        },
        phone: {
            type: String,
            default: '',
        },
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    roles: [Types.ObjectId],
    createdAt: { type: Types.Date, default: Date.now },
})

// HOOKS

// END HOOKS
module.exports = model('User', schema)
