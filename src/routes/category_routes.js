const express = require('express')
const categoryController = require('../controllers/category_controller')
const { authentication, authorization } = require('../helpers/auth')

const router = express.Router()

router.post('/add', authentication, authorization, categoryController.addCategory)
router.get('', authentication, categoryController.getCategory)
router.put('/edit/:id', authentication, categoryController.editCategory)
router.delete('/delete/:id', authentication, categoryController.deleteCategory)

module.exports = router