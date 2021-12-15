const user = require('../models/user')
const RefreshToken = require('../models/refresh_token')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_KEY, JWT_REFRESH_KEY } = process.env

const register = async (req, res) => {
    try {
        const data = req.body

        const checkEmail = await user.findOne({
            email: data.email
        })

        if (checkEmail) {
            return res.status(400).json({
                status: 'error',
                message: 'Email sudah terdaftar'
            })
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(data.password, salt)

            const newData = {
                nama: data.nama,
                email: data.email,
                password: hashPassword,
                isAdmin: data.isAdmin,
                token: data.token,
                isActive: data.isActive
            }

            const proses = await user.create(newData)

            if (proses.status !== 500) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Registrasi berhasil'
                })
            } else {
                return res.status(proses.status).json({
                    status: 400,
                    message: proses.message
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const getUser = async (req, res) => {
    try {
        const getAll = await user.find()
        const totalUser = getAll.length

        return res.json({
            status: 'success',
            total_user: totalUser
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const checkUser = await user.findOne({email})

        if (checkUser.isActive === 0) {
            return res.status(404).json({
                status: 'success',
                message: 'Akun tidak ditemukan'
            })
        } else {
            const pass = password
            const passwordMatch = await bcrypt.compare(pass, checkUser.password)
            
            if (passwordMatch) {
                const userData = {
                    id: checkUser._id,
                    nama: checkUser.nama,
                    email: checkUser.email,
                    admin: checkUser.isAdmin
                }

                const token = jwt.sign({ userData }, JWT_KEY, { expiresIn: '5m' })

                const refreshToken = jwt.sign({ userData }, JWT_REFRESH_KEY, { expiresIn: '1h' })

                checkUser.token = token

                await checkUser.save()
                return res.status(200).json({
                    status: 'success',
                    message: 'login success',
                    id: checkUser._id,
                    token,
                    refreshToken
                })
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'Password Salah'
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    const { user_id } = req.body

    try {
        const checkUser = await user.findOne({ _id: user_id })

        if (!checkUser) {
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            });
        }

        checkUser.isActive = 0
        checkUser.token = ''
        const deleteUser = await checkUser.save()

        if (deleteUser) {
            return res.status(200).json({
                status: 'success',
                message: 'delete user sukses'
            })
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'delete user gagal'
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        const userId = req.body.userId
        const users = await user.findOne({ _id: userId })
        const refreshToken = await RefreshToken.findOne({ id_user: userId })

        if (users && refreshToken) {
            refreshToken.remove()

            users.token = ''
            await users.save()

            return res.json({
                status: 'success',
                message: 'logout success'
            })
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const restoreUser = async (req, res) => {
    const {user_id} = req.body

    try {
        const users = await user.findOne({ _id: user_id })

        if (!users) {
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            })
        }

        users.isActive = 1
        users.token = ''
        await users.save()

        return res.json({
            status: 'success',
            message: 'restore success'
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

module.exports = {
    register,
    getUser,
    login,
    logout,
    deleteUser,
    restoreUser
}