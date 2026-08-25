function Autherror(err, req, res, next) {
    console.log("Backend Error:", err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || "Internal Server Error" });
}

module.exports = Autherror