const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    picture: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        houseNo: {
            type: String
        },
        landmark: {
            type: String
        },
        pinCode: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        }
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User