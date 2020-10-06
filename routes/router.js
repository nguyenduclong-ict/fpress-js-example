const express = require('express')
const router = express.Router()
const validator = require('./validator')
// ------- Declare router -------
router.get('/', (req, res, next) => {
    res.send('server work!')
})
// ------------------------------
module.exports = router
