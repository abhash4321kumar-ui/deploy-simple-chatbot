let mongoose = require('mongoose')

let messageSchema = new mongoose.Schema({
    chatid: {
        type: String,
        required: true
    },
     userid: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['ai', 'user'],
        default: 'user'
    }
}, { timestamps: true });


let messagemodel = mongoose.model('message', messageSchema)

module.exports = messagemodel