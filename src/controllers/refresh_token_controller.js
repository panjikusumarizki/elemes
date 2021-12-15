const User = require('../models/user')
const RefreshToken = require('../models/refresh_token')
const jwt = require('jsonwebtoken')
const { JWT_KEY, JWT_REFRESH_KEY } = process.env

const getRefreshToken = async (req, res) => {
    const { userId, refreshToken } = req.query

    try {
        const user = await User.findOne({ _id: userId })

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            })
        }

        const setRefreshToken = await RefreshToken.findOne({ id_user: userId })

        if (setRefreshToken === null) {
            await RefreshToken.create({
                id_user: userId,
                token: refreshToken
            })
        } else {
            setRefreshToken.token = refreshToken
            setRefreshToken.save()
        }

        jwt.verify(refreshToken, JWT_REFRESH_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: 'error',
                    message: err.message
                })
            }

            if (userId !== decoded.userData.id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'id user is not valid'
                })
            }

            const token = jwt.sign({ userData: decoded.userData }, JWT_KEY, { expiresIn: '24h' })

            return res.json({
                status: 'success',
                data: {
                    token
                }
            })
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

module.exports = {
    getRefreshToken
}