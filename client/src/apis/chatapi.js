import axios from "axios";

let api = axios.create({
    baseURL:import.meta.env.VITE_SERVER_SIDE_URL,
    withCredentials: true
})


async function chatfnc(message, chatid, socketid) {
    let data = await api.post('/api/chat', {
        message, chatid, socketid
    })

    return data
}


export async function userchatfnc() {

    console.log('running api chat fnc!')

    let data = await api.get('/api/userchat')

    return data
}


export async function usermessagesfnc(chatid) {
    let data = await api.get(`/api/usermessages/${chatid}`)

    return data
}

export async function deletefnc(chatid) {
    let data = await api.delete(`/api/delete/${chatid}`)

    return data
}


export default chatfnc