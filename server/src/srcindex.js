let express = require('express')
let myexpress = express()
let userrouter = require('./routes/user.routes')
let airouter = require('./routes/ai.route')
let Autherror = require('./errors/auth.error')
let cookieparser = require('cookie-parser')
let cors = require('cors')
let morgan = require('morgan')

myexpress.use(express.json())
myexpress.use(cookieparser())

myexpress.use(cors({
    origin:'https://deploy-simple-chatbot.vercel.app',
    credentials: true
}))

myexpress.use(morgan('dev'))

myexpress.use('/api', userrouter)
myexpress.use('/api', airouter)

myexpress.use(Autherror)

module.exports = myexpress