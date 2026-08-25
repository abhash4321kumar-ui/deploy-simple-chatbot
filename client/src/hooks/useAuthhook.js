import { useDispatch, useSelector } from "react-redux";
import Signup, { Login, Userdetails } from "../apis/authapi";
import { setloading, setuser, seterror } from "../store/features/userslice";

function useAuthhook() {
    let dispatch = useDispatch()

    async function userdetailsfnc() {
        try {
            dispatch(setloading(true))
            dispatch(seterror(null))

            let data = await Userdetails()

            dispatch(setuser(data.data.userdata))
            dispatch(setloading(false))

            return data
        } catch (error) {
            console.log(error)
            const errorMsg = error.response?.data?.message || error.message || 'something error in login!'
            dispatch(seterror(errorMsg))
            dispatch(setuser(null))
            dispatch(setloading(false))
        }
    }


    async function signupfnc(username, usermail, userpassword) {
        try {

            console.log('running signupfn')

            let data = await Signup(username, usermail, userpassword)

            return data

        } catch (error) {
            console.log(error)
        }
    }

    async function loginfnc(usermail, userpassword) {
        try {

            dispatch(setloading(true))
            dispatch(seterror(null))

            let data = await Login(usermail, userpassword)

            dispatch(setuser(data.data.user))
            dispatch(setloading(false))

            return data

        } catch (error) {
            console.log(error)

            const errorMsg = error.response?.data?.message || error.message || 'something error in login!'
            dispatch(seterror(errorMsg))
            dispatch(setloading(false))
        }
    }


    return {
        signupfnc,
        loginfnc,
        userdetailsfnc
    }
}

export default useAuthhook