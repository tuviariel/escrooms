import { createSlice } from "@reduxjs/toolkit";
// import data from "../services/dummyRoomData";
// let list = data.quizzes.map((q, i) => {
//     return { id: i, completed: false, name: q.name, answer: q.answer, image: q.quizImg };
// });
// console.log("list", list);
// const initialState = { list };
export const quizListSlice = createSlice({
    name: "quizList",
    initialState: {
        list: [] as {
            id: number;
            completed: boolean;
            name: string;
            answer: string;
            image: string;
        }[],
    },
    reducers: {
        createQuizList: (state, action) => {
            state.list = action.payload;
        },
        changeQuizList: (state, action) => {
            state.list[action.payload].completed = !state.list[action.payload].completed;
        },
    },
});

export const quizListActions = quizListSlice.actions;

export default quizListSlice.reducer;
