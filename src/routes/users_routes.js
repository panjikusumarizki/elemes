const express = require('express')
const usersController = require('../controllers/users_controller')
const { verifyToken, permission } = require('../helpers/auth')

const router = express.Router()

router.post('/register', usersController.register)
router.post('/login', usersController.login)
router.post('/logout', verifyToken, usersController.logout)
router.post('/delete', verifyToken, permission, usersController.deleteUser)
router.post('/restore', verifyToken, permission, usersController.restoreUser)

module.exports = router
