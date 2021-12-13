import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema

const refreshTokenSchema = new mongoose.Schema({
    id_user: {
        type: ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('RefreshTokens', refreshTokenSchema)