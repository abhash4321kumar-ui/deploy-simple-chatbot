let mongoose = require('mongoose')

let userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    usermail: {
        type: String,
        required: true,
        unique: true
    },
    userpassword: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


let usermodel = mongoose.model('user', userschema)

module.exports = usermodel