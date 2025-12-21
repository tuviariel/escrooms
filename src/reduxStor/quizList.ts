import { createSlice } from "@reduxjs/toolkit";

export const quizListSlice = createSlice({
    name: "quizList",
    initialState: {
        list: [] as {
            id: number;
            status: string;
            title: string;
            answer: string;
            image: string;
            x: number;
            y: number;
        }[],
    },
    reducers: {
        createQuizList: (state, action) => {
            state.list = action.payload;
        },
        changeQuizList: (state, action) => {
            state.list[action.payload].status = "completed";
            if (action.payload < state.list.length) {
                state.list[action.payload + 1].status = "active";
            }
        },
    },
});

export const quizListActions = quizListSlice.actions;

export default quizListSlice.reducer;
