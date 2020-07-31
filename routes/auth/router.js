const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('AUTH')
})

module.exports = router
