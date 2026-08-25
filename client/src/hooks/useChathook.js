import { useDispatch } from "react-redux";
import chatfnc, { deletefnc, userchatfnc, usermessagesfnc } from "../apis/chatapi";
import { setallchats, setallmessages, setchaterror, setchatloading, setCurrentChatId } from "../store/features/chatslice";
import { useEffect } from "react";

function useChathook() {
    let dispatch = useDispatch();

    async function mainchatfnc(message, chatid, socketid) {
        try {
            dispatch(setchatloading(true));
            dispatch(setchaterror(null));

            let data = await chatfnc(message, chatid, socketid);

            dispatch(setallmessages(data?.data?.finalhistroy));
            
          
            dispatch(setCurrentChatId(data?.data?.finalchatid));

           
            if (!chatid) {
                mainuserchatfnc();
            }

            dispatch(setchatloading(false));
            return data;
        } catch (error) {
            console.log(error);
            const errorMsg = error.response?.data?.message || error.message || 'something error!';
            dispatch(setchaterror(errorMsg));
            dispatch(setchatloading(false));
        }
    }

    async function mainuserchatfnc() {
        try {
            dispatch(setchatloading(true));
            dispatch(setchaterror(null));

            let data = await userchatfnc();
            dispatch(setallchats(data.data.allchats));
            dispatch(setchatloading(false));

            return data;
        } catch (error) {
            console.log(error);
            const errorMsg = error.response?.data?.message || error.message || 'error fetching chats!';
            dispatch(setchaterror(errorMsg));
            dispatch(setallchats([]));
            dispatch(setchatloading(false));
        }
    }

    async function mainusermessagefnc(chatid) {
        try {
            dispatch(setchatloading(true));
            dispatch(setchaterror(null));

            let data = await usermessagesfnc(chatid);
            dispatch(setallmessages(data.data.allmessages));
            dispatch(setchatloading(false));
        } catch (error) {
            console.log(error);
            const errorMsg = error.response?.data?.message || error.message || 'error fetching messages!';
            dispatch(setchaterror(errorMsg));
            dispatch(setallmessages([]));
            dispatch(setchatloading(false));
        }
    }

    async function maindeletefnc(chatid) {
        try {
            dispatch(setchatloading(true));
            dispatch(setchaterror(null));

            await deletefnc(chatid);

            // Delete hone ke baad state clear karo aur sidebar update karo
            dispatch(setCurrentChatId(null));
            dispatch(setallmessages([]));
            await mainuserchatfnc();

            dispatch(setchatloading(false));
        } catch (error) {
            console.log(error);
            const errorMsg = error.response?.data?.message || error.message || 'error deleting chat!';
            dispatch(setchaterror(errorMsg));
            dispatch(setchatloading(false));
        }
    }

    useEffect(() => {
        mainuserchatfnc();
    }, []);

    return {
        mainuserchatfnc,
        mainusermessagefnc,
        maindeletefnc,
        mainchatfnc
    };
}

export default useChathook