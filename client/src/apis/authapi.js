import axios from "axios";

let api = axios.create({
    baseURL: import.meta.env.SERVER_SIDE_URL,
    withCredentials: true
})


async function Signup(username, usermail, userpassword) {

    console.log('signup fnc')

    let data = await api.post('/api/signup', {
        username, usermail, userpassword
    })

    return `data sent succesfully to this email ${usermail}`

}

export async function Login(usermail, userpassword) {
     let data = await api.post('/api/login', {
        usermail, userpassword
    })

    return data
}

export async function Userdetails(){

    let data = await api.get('/api/userdetails')

    return data

}

export default Signup