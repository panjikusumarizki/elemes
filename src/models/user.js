const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Number,
        required: true
    },
    token: {
        type: String
    },
    isActive: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Users', userSchema)