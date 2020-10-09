const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET || '5f7f3b68456d36330f0a683e'

module.exports = {
    decode(token, options) {
        return jwt.decode(token, options)
    },
    verify(token, options) {
        return jwt.verify(token, secretKey, options)
    },
    sign(payload, options) {
        options = _.defaultsDeep(options, {
            expiresIn: '30d',
        })
        return jwt.sign(payload, secretKey, options)
    },
}
