const router = require('express').Router()
const validator = require('./validator')
const { CustomError } = require('fpress/dist')
// ------- Declare router -------
router.get('/', (req, res, next) => {
    res.send('Server work!')
})
// ------------------------------
module.exports = router
