let usermodel = require('../model/user.model')
let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
const welcomemessagefnc = require('../services/transporter.service')

async function signupfnc(req, res, next) {
    try {

        console.log('server signupfnc running!')

        let { username, usermail, userpassword } = req.body

        console.log(username, usermail, userpassword)

        let checkuser = await usermodel.findOne({
            $or: [
                { usermail: usermail },
                { username: username }
            ]
        })

        if (checkuser) {
            return res.status(401).json({
                message: 'user already exist!'
            })
        }

        let hashpassword = await bcrypt.hash(userpassword, 10)

        let user = await usermodel.create({
            username,
            usermail,
            userpassword: hashpassword
        })


        let welcomemessage = await welcomemessagefnc(username, usermail)

        res.status(201).json({
            message: 'user created succesfully!',
            user: user
        })

    } catch (error) {
        console.log(error)
    }
}

async function verifyfnc(req, res) {
    try {

        let { token } = req.query

        if (!token) {
            return res.status(401).json({
                message: 'unathorised access!'
            })
        }

        let verifytoken = await jwt.verify(token, process.env.JWT_KEY)

        if (!verifytoken) {
            return res.status(401).json({
                message: 'connot verify token!'
            })
        }

        let usermail = verifytoken.usermail

        let user = await usermodel.findOne({ usermail })

        if (user.isVerified === true) {
            return res.redirect('/login')
        }

        user.isVerified = true
        await user.save()

        if (!user) {
            return res.status(401).json({
                message: 'your email is not accessed!'
            })
        }

        let redirectdata = `hello ${user.username} thanks for verifying! click here to login <a href="http://localhost:5173/login">login</a>`

        return res.send(redirectdata)

    } catch (error) {
        console.log(error)
    }
}

async function resendfnc(req, res) {
    try {
        
         let { token } = req.query

        if (!token) {
            return res.status(401).json({
                message: 'unathorised access!'
            })
        }

        let verifytoken = await jwt.verify(token, process.env.JWT_KEY)

        if (!verifytoken) {
            return res.status(401).json({
                message: 'connot verify token!'
            })
        }

        let usermail = verifytoken.usermail

        let user = await usermodel.findOne({ usermail })


         let welcomemessage = await welcomemessagefnc(user.username, user.usermail)

         let redirectdata = `hello ${user.username} resend message sent on ${user.usermail}`

        return res.send(redirectdata)

    } catch (error) {
        return next(error)
    }
}

async function loginfnc(req, res) {
    try {

        console.log('login fnc')

        let { usermail, userpassword } = req.body

        console.log(usermail, userpassword)

        let user = await usermodel.findOne({
            usermail: usermail
        })

        console.log(user)

        if (!user) {
            return res.status(401).json({
                message: 'user not found!'
            })
        }

        if (!user.isVerified) {
            return res.status(401).json({
                message: 'please verify usermail!'
            })
        }

        let hashpassword = await bcrypt.compare(userpassword, user.userpassword)

        if (!hashpassword) {
            return res.status(401).json({
                message: 'unauthoired access!'
            })
        }

        let token = await jwt.sign({
            _id: user._id,
            usermail: user.usermail
        }, process.env.JWT_KEY)

        res.cookie('token', token)

        res.status(201).json({
            message: 'user loggedIn successfully!',
            user: user
        })

    } catch (error) {
        console.log(error)
    }
}

async function userdetails(req, res) {
    try {

        let user = req.user


        let finduser = await usermodel.findById(user._id)

        if (!finduser) {
            return res.status(401).json({
                message: 'connot access user!'
            })
        }

        res.status(200).json({
            message: 'getting user data!',
            userdata: {
                username: finduser.username,
                usermail: finduser.usermail,
                isVerified: finduser.isVerified,
            }
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    signupfnc,
    verifyfnc,
    loginfnc,
    userdetails,
    resendfnc
}