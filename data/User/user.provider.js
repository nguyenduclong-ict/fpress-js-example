const { Provider } = require('fpress')
const User = require('./user.model')

class UserProvider extends Provider {}

module.exports = new UserProvider(User)
