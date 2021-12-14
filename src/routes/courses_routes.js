const express = require('express')
const courseController = require('../controllers/courses_controller')
const { authentication, authorization } = require('../helpers/auth')
const {uploadMultiple} = require('../helpers/multer')

const router = express.Router()

router.post('/insert', authentication, authorization, uploadMultiple, courseController.addCourse)
router.get('', authentication, courseController.getCourse)
router.get('/popular', authentication, courseController.getPopularCourse)
router.get('/detail/:id', authentication, courseController.getDetailCourse)
router.get('/search', authentication, courseController.searchCourse)
router.put('/edit/:id', authentication, authorization, uploadMultiple, courseController.editCourse)
router.delete('/delete/:id', authentication, authorization, courseController.deleteCourse)

module.exports = router