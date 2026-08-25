import { io } from "socket.io-client";

let socket = io(import.meta.env.VITE_SERVER_SIDE_URL, {
    withCredentials: true,
    autoConnect: false
})

socket.on('connect', () => {
    console.log('user connected successfully!')
})

export default socket