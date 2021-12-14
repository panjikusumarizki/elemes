const express = require('express')
const courseController = require('../controllers/courses_controller')
const { verifyToken, permission } = require('../helpers/auth')
const {upload, uploadMultiple} = require('../helpers/multer')

const router = express.Router()

router.post('/insert', uploadMultiple, courseController.addCourse)
router.get('', courseController.getCourse)
router.get('/popular', courseController.getPopularCourse)
router.get('/detail/:id', courseController.getDetailCourse)
router.get('/search', courseController.searchCourse)
router.put('/edit/:id', uploadMultiple, courseController.editCourse)
router.delete('/delete/:id', courseController.deleteCourse)

module.exports = router