const { Provider } = require('fpress')
const Permission = require('./permission.model')

class PermissionProvider extends Provider {}

module.exports = new PermissionProvider(Permission)