import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allchats: [], 
    allmessages: [], 
    currentChatId: null, 
    chatloading: false,
    chaterror: null
};

export const chatslice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setallchats: (state, action) => {
            state.allchats = action.payload;
        },
        setallmessages: (state, action) => {
            state.allmessages = action.payload;
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload; 
        },
        setchatloading: (state, action) => {
            state.chatloading = action.payload;
        },
        setchaterror: (state, action) => {
            state.chaterror = action.payload;
        }
    },
});

export const { setallchats, setchatloading, setchaterror, setallmessages, setCurrentChatId } = chatslice.actions;

export default chatslice.reducer