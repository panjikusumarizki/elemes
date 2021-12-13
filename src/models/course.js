import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema

const courseSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    mentor: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    id_image: [{
        type: ObjectId,
        ref: 'Images'
    }],
    id_category: {
        type: ObjectId,
        ref: 'Category'
    },
    is_popular: {
        type: Number
    }
})

module.exports = mongoose.model('Courses', courseSchema)