const express = require('express')
const refreshTokenController = require('../controllers/refresh_token_controller')

const router = express.Router()

router.get('/get-token', refreshTokenController.getRefreshToken)

module.exports = router
