const jwt = require('jsonwebtoken')
const { JWT_KEY } = process.env

const authentication = async (req, res, next) => {
    const token = req.headers.authorization
    jwt.verify(token, JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: err.message })
        }

        req.user = decoded
        return next()
    })
}

const authorization = async (req, res, next) => {
    const admin = req.user.userData.admin

    if (admin === 0) {
        return res.status(405).json({
            status: 'error',
            message: 'you don\'t have permission'
        })
    }

    return next()
}

module.exports = { authentication, authorization }