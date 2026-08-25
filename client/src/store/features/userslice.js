import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isloading: false,
    iserror: null
};

export const userslice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setuser: (state, action) => {
            state.user = action.payload
        },
        setloading: (state, action) => {
            state.isloading = action.payload
        },
        seterror: (state, action) => {
            state.iserror = action.payload
        }
    },
});

export const { setuser, setloading, seterror } = userslice.actions;

export default userslice.reducer