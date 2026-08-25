require('dotenv').config()
let {createServer} = require('http')
let myexpress = require('./src/srcindex')
let Databasefnc = require('./src/config/databasefile')
const socketfnc = require('./src/io/socket')

Databasefnc()

let server = createServer(myexpress)

let io = socketfnc(server)

myexpress.set('io', io)

server.listen(process.env.PORT, function(){
    console.log('server is running!')
})