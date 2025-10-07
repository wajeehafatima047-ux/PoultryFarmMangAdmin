import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: {},
    name: "",
    role: "",
    loading: false,
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setName: (state, action) => {
            state.name = action.payload
        },
        setRole: (state, action) => {
            state.role = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        logout: (state) => {
            state.user = {};
            state.name = "";
            state.role = "";
            state.loading = false;
        },



    },
});

export const {
    setUser,
    setName,
    setRole,
    logout

} = homeSlice.actions;

export default homeSlice.reducer;
