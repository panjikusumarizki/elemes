const express = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const usersRouter = require('./src/routes/routes')

const app = express()
require('dotenv').config()

mongoose.connect(`${process.env.CONNECTION_URL}`)

const PORT = process.env.PORT

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/users', usersRouter)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})