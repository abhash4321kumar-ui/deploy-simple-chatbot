async function Autherror(err, req, res, next) {
    let response = {
        message: err.message,
        stack: err.stack
    }

    res.status(401).json(response)

}

module.exports = Autherror