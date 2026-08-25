let {Server} = require('socket.io')

function socketfnc(httpserver) {
    let io = new Server(httpserver, {
        cors:{
            origin:'http://localhost:5173',
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