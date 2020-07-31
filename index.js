require('./configs/env')
const fpress = require('fpress').default

fpress.create().registerAllService().start()
