const user = require('../models/user')
const bcrypt = require('bcrypt')

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

        if (checkUser) {
            const pass = password
            const passwordMatch = await bcrypt.compare(pass, checkUser.password)
            
            if (passwordMatch) {
                return res.status(200).json({
                    status: 'success',
                    message: 'login success'
                })
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'Password Salah'
                })
            }
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Email tidak ditemukan'
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

const logout = async (req, res) => {}

module.exports = {
    register,
    login,
    logout
}