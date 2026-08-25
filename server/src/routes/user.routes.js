let express = require('express')
const { signupfnc, verifyfnc, loginfnc, userdetails, resendfnc } = require('../controllers/user.controller')
const {validation, validationlogin} = require('../validation/auth.validation')
const tokenfnc = require('../middlewares/token.middleware')
let userrouter = express.Router()

userrouter.post('/signup', validation, signupfnc)

userrouter.get('/verify', verifyfnc)

userrouter.get('/resend', resendfnc )

userrouter.post('/login', validationlogin, loginfnc)

userrouter.get('/userdetails', tokenfnc, userdetails)

module.exports = userrouter