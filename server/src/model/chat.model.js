let mongoose = require('mongoose')

let chatschema = new mongoose.Schema({
    user:{
        type:String,
        required: true,
    },
     title:{
        type:String,
        required: true,
    }
}, { timestamps: true });

let Chatmodel = mongoose.model('chat', chatschema)

module.exports = Chatmodel