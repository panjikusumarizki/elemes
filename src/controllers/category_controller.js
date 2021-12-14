const Category = require('../models/category')

const addCategory = async (req, res) => {
    const { nama } = req.body

    try {
        const createCategory = await Category.create({ nama })

        if (createCategory.status !== 500) {
            return res.status(200).json({
                status: 'success',
                message: 'Berhasil menambahkan kategori'
            })
        } else {
            return res.status(400).json({
                status: 'error',
                message: createCategory.message
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const getCategory = async (req, res) => {
    try {
        const getAllCategory = await Category.find()

        return res.send({
            status: 'success',
            data: getAllCategory
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const editCategory = async (req, res) => {
    const { id, nama } = req.body

    try {
        const category = await Category.findOne({ _id: id })

        category.nama = nama
        await category.save()

        return res.send({
            status: 'success',
            message: 'Edit kategori berhasil'
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params

    try {
        const category = await Category.findOne({ _id: id })
        await category.remove()

        return res.send({
            status: 'success',
            message: 'Edit kategori berhasil'
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

module.exports = {
    addCategory,
    getCategory,
    editCategory,
    deleteCategory
}