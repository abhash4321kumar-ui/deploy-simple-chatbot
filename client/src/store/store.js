import { configureStore } from '@reduxjs/toolkit';
import  userslice  from './features/userslice';
import chatslice  from './features/chatslice';

const store = configureStore({
    reducer: {
        authuser: userslice,
        userchats: chatslice
    },
});

export default store