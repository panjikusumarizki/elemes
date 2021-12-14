const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const categorySchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    courseId: [{
        type: ObjectId,
        ref: 'course'
    }]
})

module.exports = mongoose.model('Category', categorySchema)