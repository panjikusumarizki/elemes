const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.JWT_KEY

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization
    jwt.verify(token, JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: err.message })
        }

        req.user = decoded
        return next()
    })
}

const permission = async (req, res, next) => {
    const admin = req.user.isAdmin
    if (admin === 0) {
        return res.status(405).json({
            status: 'error',
            message: 'you don\'t have permission'
        })
    }

    return next()
}

module.exports = { verifyToken, permission }