const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const dotenv = require('dotenv')
dotenv.config()

const AuthRouter = require('./routes/auth')
const EmployeeRouter = require('./routes/Employee')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err);
})

db.on('open', () => {
    console.log("Database Connection Established!");
})

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 3100

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.use(cors())
app.use('/auth-api', AuthRouter)
app.use('/api/employee', EmployeeRouter)