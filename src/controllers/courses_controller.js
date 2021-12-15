const Course = require('../models/course')
const Category = require('../models/category')
const Image = require('../models/image')
const cloudinary = require('cloudinary').v2

const { config } = require('../helpers/cloudinary')
config

const addCourse = async (req, res) => {
    const { nama, mentor, price, categoryId, isPopular } = req.body
    const files = req.files
    const files_url = []

    try {
        if (files.length > 0) {
            const category = await Category.findOne({ _id: categoryId })
            
            const newData = {
                nama,
                mentor,
                price,
                id_category: category._id,
                is_popular: isPopular
            }

            const course = await Course.create(newData)

            category.courseId.push({ _id: course._id })
            await category.save()

            await Promise.all(
                files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path)
                    files_url.push({
                        file_url: result.secure_url,
                        id: result.public_id
                    })
                })
            )

            for (let i = 0; i < files_url.length; i++) {
                const imageSave = await Image.create({ 
                    image_url: files_url[i].file_url,
                    public_id: files_url[i].id
                })
                course.id_image.push({ _id: imageSave._id})
                await course.save()
            }

            return res.send({
                status: 'success',
                message: 'Berhasil menambahkan course'
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const getCourse = async (req, res) => {
    try {
        const getAll = await Course.find()
        const totalCourse = getAll.length

        const freeCourses = getAll.filter(e => e.price === 0)

        return res.send({
            status: 'success',
            data: getAll,
            total_course: totalCourse,
            total_free_course: freeCourses.length
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const getPopularCourse = async (req, res) => {
    try {
        const getAll = await Course.find()

        let popularCourse = getAll.filter(e => e.is_popular === 1)

        return res.send({
            status: 'success',
            data: popularCourse
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const getDetailCourse = async (req, res) => {
    const { id } = req.params
    
    try {
        if (!id) {
            return res.send({
                status: 'error',
                message: 'id tidak ditemukan'
            })
        }
        const getDetail = await Course.find({ _id: id })
                                        .populate({ path: 'id_image', select: 'id image_url public_id'})
                                        .populate({ path: 'id_category', select: 'id nama'})

        const data = {
            nama: getDetail[0].nama,
            mentor: getDetail[0].mentor,
            price: getDetail[0].price,
            image: getDetail[0].id_image,
            category: getDetail[0].id_category.nama,
            popular: getDetail[0].is_popular
        }

        return res.send({
            status: 'success',
            data
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const searchCourse = async (req, res) => {
    const { nama, sortBy, sortType, price } = req.query
    
    try {
        let getCourses, newDataCourses
        if (sortBy === 'price') {
            getCourses = await Course.find({ nama: {$regex: nama, $options: 'i'} }).sort({price: `${sortType}`})

            return res.send({
                status: 'success',
                data: getCourses
            })
        } else {
            getCourses = await Course.find({ nama: {$regex: nama, $options: 'i'} })

            if (price === 'free') {
                newDataCourses = getCourses.filter(e => e.price === 0)
    
                return res.send({
                    status: 'success',
                    data: newDataCourses
                })
            }

            return res.send({
                status: 'success',
                data: getCourses
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const editCourse = async (req, res) => {
    const { id } = req.params
    const { nama, mentor, price, categoryId, isPopular } = req.body

    try {
        if (!id) {
            return res.send({
                status: 'error',
                message: 'id tidak ditemukan'
            })
        }

        const course = await Course.findOne({ _id: id })
                    .populate({ path: 'id_image', select: 'id image_url public_id'})
                    .populate({ path: 'id_category', select: 'id nama'})

        const files = req.files
        const files_url = []
        if (req.files.length > 0) {
            let newImageUpdate = []
            for (let i in course.id_image) {
                const imageUpdate = await Image.findOne({ _id: course.id_image[i]._id })
                await cloudinary.uploader.destroy(course.id_image[i].public_id)
                newImageUpdate.push(imageUpdate)
            }
            
            await Promise.all(
                files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path)
                    files_url.push({
                        file_url: result.secure_url,
                        id: result.public_id
                    })
                })
            )

            for (let j in newImageUpdate) {
                const imageUpdate = await Image.findOne({ _id: newImageUpdate[j]._id })
                
                for (let k in files_url) {
                    imageUpdate.image_url = files_url[j].file_url
                    imageUpdate.public_id = files_url[j].id
                }
                
                await imageUpdate.save()
            }
            

            course.nama = nama
            course.mentor = mentor
            course.price = price
            course.id_category = categoryId
            course.is_popular = isPopular

            await course.save()

            return res.send({
                status: 'success',
                message: 'Update course berhasil'
            })
        } else {
            course.nama = nama
            course.mentor = mentor
            course.price = price
            course.id_category = categoryId
            course.is_popular = isPopular

            await course.save()

            return res.send({
                status: 'success',
                message: 'Update course berhasil'
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const deleteCourse = async (req, res) => {
    const { id } = req.params

    try {
        if (!id) {
            return res.send({
                status: 'error',
                message: 'id tidak ditemukan'
            })
        }

        const course = await Course.findOne({ _id: id })
                        .populate('id_image')
                        .populate({ path: 'id_category', select: 'id'})

        const category = await Category.findOne({ _id: course.id_category._id.toString() })

        for (let i = 0; i < category.courseId.length; i++) {
            if (category.courseId[i].toString() === course._id.toString()) {
                category.courseId.splice(i, 1)
                i--
            }
        }
        category.save()
        
        for (let j in course.id_image) {
            const getImg = await Image.findOne({ _id: course.id_image[j]._id.toString() })
            await cloudinary.uploader.destroy(getImg.public_id)

            getImg.remove()
        }

        course.remove()

        return res.send({
            status: 'success',
            message: 'Hapus data course berhasil'
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

module.exports = {
    addCourse,
    getCourse,
    getPopularCourse,
    getDetailCourse,
    searchCourse,
    editCourse,
    deleteCourse
}