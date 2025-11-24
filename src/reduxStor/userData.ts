import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        id: "",
        email: "",
        displayName: "",
        avatar: "",
        roomsLeft: 0,
        subscription: "free", // free, pro, etc.
    },
};
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUserData: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
