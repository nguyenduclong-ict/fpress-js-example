const { Provider } = require('fpress')
const Taxonomy = require('./taxonomy.model')

class TaxonomyProvider extends Provider {}

module.exports = new TaxonomyProvider(Taxonomy)