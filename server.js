require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const usersRouter = require('./src/routes/users_routes')
const coursesRouter = require('./src/routes/courses_routes')
const categoryRouter = require('./src/routes/category_routes')

const app = express()

mongoose.connect(`${process.env.CONNECTION_URL}`)

const PORT = process.env.PORT

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/users', usersRouter)
app.use('/course', coursesRouter)
app.use('/category', categoryRouter)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})