const { Provider } = require('fpress')
const Media = require('./media.model')

class MediaProvider extends Provider {}

module.exports = new MediaProvider(Media)