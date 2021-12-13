import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Images', imageSchema)