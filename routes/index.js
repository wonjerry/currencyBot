var express = require('express')
var router = express.Router()

var manager = require('./apiManager')

router.get('/api/v1/currency/jpy', manager.getCurrency)
router.get('/keyboard', manager.getCurrency)

module.exports = router
