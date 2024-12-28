import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isAuthenticated: false,
    email: undefined, 
    role: undefined,
    name: undefined,
}

export const userSlice = createSlice({
    name: 'emailAuth',
    initialState,
    reducers: {
        addEmail: (state, action)=>{
            state.isAuthenticated = true;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.name = action.payload.name;
        },
        removeEmail: (state, action)=>{
            state.isAuthenticated = false;
            state.email=undefined;
            state.role=undefined;
            state.name=undefined;
        }
    }
}); 


export const {addEmail, removeEmail} = userSlice.actions;
export default userSlice.reducer;