const express = require('express')
const categoryController = require('../controllers/category_controller')
const { verifyToken, permission } = require('../helpers/auth')

const router = express.Router()

router.post('/add', categoryController.addCategory)
router.get('', categoryController.getCategory)
router.put('/edit', categoryController.editCategory)
router.delete('/delete/:id', categoryController.deleteCategory)

module.exports = router