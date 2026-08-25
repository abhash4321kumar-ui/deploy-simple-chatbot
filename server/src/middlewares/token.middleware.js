let jwt = require('jsonwebtoken')

async function tokenfnc(req, res, next) {
    try {

         let token = req.cookies.token

        if(!token){
            return res.status(401).json({
                message:"unauthorised token access!"
            })
        }

        let verifytoken = await jwt.verify(token, process.env.JWT_KEY)

        req.user = verifytoken

        next()

    } catch (error) {
        console.log(error)
    }
}

module.exports = tokenfnc