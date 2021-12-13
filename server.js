import express from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

const app = express()
dotenv.config()

mongoose.connect(`${process.env.CONNECTION_URL}`)

const PORT = process.env.PORT

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})