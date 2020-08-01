const { Provider } = require('fpress')
const Config = require('./config.model')

class ConfigProvider extends Provider {}

module.exports = new ConfigProvider(Config)