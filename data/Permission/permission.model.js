const { Schema, model } = require('mongoose')
const { Types } = Schema

const schema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
        default: '',
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    action: {
        type: String,
        enum: ['read', 'write'],
        default: 'write',
    },
    // Special for entity | null => apply for all
    entityId: {
        type: Types.ObjectId,
        refPath: 'entityType',
    },
    // Permission for Collection | null => apply for all
    entityType: {
        type: String,
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
    createdAt: { type: Types.Date, default: Date.now },
})

// HOOKS

// END HOOKS
module.exports = model('Permission', schema)
