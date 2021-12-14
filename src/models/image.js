const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Images', imageSchema)