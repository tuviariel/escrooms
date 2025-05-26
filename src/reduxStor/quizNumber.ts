import { createSlice } from "@reduxjs/toolkit";

const initialState = { quizNumber: -1 };
export const quizNumberSlice = createSlice({
    name: "quizNumber",
    initialState,
    reducers: {
        changeQuizNumber: (state, action) => {
            state.quizNumber = action.payload;
        },
    },
});

export const quizNumberActions = quizNumberSlice.actions;

export default quizNumberSlice.reducer;
