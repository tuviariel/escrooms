import { createSlice } from "@reduxjs/toolkit";
import data from "../services/dummyRoomData";
let list = data.quiz.map((q, i) => {
    return { id: i, completed: false };
});
console.log("list", list);
const initialState = { list };
export const quizListSlice = createSlice({
    name: "quizList",
    initialState,
    reducers: {
        changeQuizList: (state, action) => {
            state.list[action.payload].completed = !state.list[action.payload].completed;
        },
    },
});

export const quizListActions = quizListSlice.actions;

export default quizListSlice.reducer;
