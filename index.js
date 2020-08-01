require('fpress').registerAlias()
require('dotenv').config()
require('./configs/env')
const { fPress } = require('fpress')

fPress.create().registerAllService().start()
