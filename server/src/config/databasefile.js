let mongoose = require('mongoose')

async function Databasefnc() {
    try {
        
        let data = await mongoose.connect(process.env.MONGO_URI)

        console.log('connected!')

    } catch (error) {
        console.log(error)
    }
}

module.exports = Databasefnc