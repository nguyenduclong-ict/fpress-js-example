const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync()

module.exports = {
    hash(data) {
        return bcrypt.hash(data, salt)
    },
    compare(data, encrypted) {
        return bcrypt.compare(data, encrypted)
    },
}
