let { body, validationResult } = require('express-validator')

function validateuser(req, res, next) {
    let errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }

    res.status(400).json({
        message: 'something went wrong!',
        errors: errors.array()
    })

}

let validation = [
    body('username').isString().withMessage('please check your username!'),
    body('usermail').isEmail().withMessage('please check your usermail!'),
    body('userpassword').isLength({ min: '6', max: '12' }).withMessage('please check userpassword!'),
    validateuser
]

let validationlogin = [
    body('usermail').isEmail().withMessage('please check your usermail!'),
    body('userpassword').isLength({ min: '6', max: '12' }).withMessage('please check userpassword!'),
    validateuser
]


module.exports = {
    validation,
    validationlogin,
}