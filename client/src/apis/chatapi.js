import axios from "axios";

let api = axios.create({
    baseURL:import.meta.env.SERVER_SIDE_URL,
    withCredentials: true
})


async function chatfnc(message, chatid, socketid) {
    let data = await api.post('/chat', {
        message, chatid, socketid
    })

    return data
}


export async function userchatfnc() {

    console.log('running api chat fnc!')

    let data = await api.get('/userchat')

    return data
}


export async function usermessagesfnc(chatid) {
    let data = await api.get(`/usermessages/${chatid}`)

    return data
}

export async function deletefnc(chatid) {
    let data = await api.delete(`/delete/${chatid}`)

    return data
}


export default chatfnc