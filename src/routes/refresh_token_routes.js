const express = require('express')
const refreshTokenController = require('../controllers/refresh_token_controller')

const router = express.Router()

router.post('/create', refreshTokenController.createToken)
router.get('/get-token', refreshTokenController.getToken)

module.exports = router
