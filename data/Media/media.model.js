const { Schema, model } = require('mongoose')
const { Types } = Schema

const schema = new Schema({
    name: { type: String },
    size: { type: Number, default: 0 },
    path: { type: String },
    mimeType: { type: String },
    // external link
    source: { type: String, default: null },
    type: {
        type: String,
        enum: ['local', 'external'],
        default: 'local',
    },
    meta: {
        type: Types.Mixed,
        default: {
            alt: '',
            title: '',
        },
    },
    thumbnails: {
        type: Types.Mixed,
    },
    createdBy: {
        type: Types.ObjectId,
        default: null,
        ref: 'User',
    },
    createdAt: { type: Types.Date, default: Date.now },
})

schema.virtual('url').get(function () {
    if (this.type === 'local') {
        return process.env.SERVER_URL + '/file/' + this.name
    } else {
        return this.source
    }
})

// END HOOKS
module.exports = model('Media', schema)
