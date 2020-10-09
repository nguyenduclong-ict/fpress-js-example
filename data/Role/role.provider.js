const { Provider } = require('fpress')
const Role = require('./role.model')

class RoleProvider extends Provider {}

module.exports = new RoleProvider(Role)