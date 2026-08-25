let {Server} = require('socket.io')

function socketfnc(httpserver) {
    let io = new Server(httpserver, {
        cors:{
            origin:'https://deploy-simple-chatbot.vercel.app/',
            credentials: true
        }
    })

    io.on('connection', function(socket){

        console.log(`user connected successfully ${socket.id}`)


        socket.on('disconnect', function(){
            console.log('user disconnected!')
        })

    })

    return io

}

module.exports = socketfnc