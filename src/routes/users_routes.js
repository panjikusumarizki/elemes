const express = require('express')
const usersController = require('../controllers/users_controller')
const { authentication, authorization } = require('../helpers/auth')

const router = express.Router()

router.post('/register', usersController.register)
router.post('/login', usersController.login)
router.post('/logout', authentication, usersController.logout)
router.post('/delete', authentication, authorization, usersController.deleteUser)
router.post('/restore', authentication, authorization, usersController.restoreUser)

module.exports = router
