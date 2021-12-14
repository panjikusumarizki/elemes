const user = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_KEY } = process.env

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

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const checkUser = await user.findOne({email})

        if (checkUser.isActive === 0) {
            return res.json({
                status: 'success',
                message: 'Akun anda untuk sementara dinonaktifkan, silakan hubungi call center kami untuk mengaktifkan kembali akun anda'
            })
        } else {
            const pass = password
            const passwordMatch = await bcrypt.compare(pass, checkUser.password)
            
            if (passwordMatch) {
                const token = jwt.sign({
                    email: checkUser.email,
                    isAdmin: checkUser.isAdmin
                }, JWT_KEY, { expiresIn: 3500 })

                checkUser.token = token

                await checkUser.save()
                return res.status(200).json({
                    status: 'success',
                    message: 'login success',
                    token
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

        if (!users) {
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            })
        }

        users.token = ''
        await users.save()

        return res.json({
            status: 'success',
            message: 'logout success'
        })
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
    login,
    logout,
    deleteUser,
    restoreUser
}