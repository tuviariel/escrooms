import { createSlice } from "@reduxjs/toolkit";
import data from "../services/dummyRoomData";

const qData = data.quiz.find((quiz) => quiz.type === "colorChange");
const initialState = { colorOrder: new Array(qData?.quizData.length).fill(-1) };
const colorSlice = createSlice({
    name: "colorQuiz",
    initialState,
    reducers: {
        changeColor: (state, action) => {
            const { i } = action.payload;
            const updatedColorOrder = [...state.colorOrder];
            updatedColorOrder[i] =
                qData?.category && qData?.category?.length - 1 > updatedColorOrder[i]
                    ? updatedColorOrder[i] + 1
                    : 0;
            return { ...state, colorOrder: updatedColorOrder };
        },
        // decrement: (state) => {
        //     state.counter--;
        // },
        // increase: (state, action) => {
        //     state.counter = state.counter + action.payload;
        // },
        // show: (state) => {
        //     state.show = !state.show;
        // },
    },
});

export const colorActions = colorSlice.actions;

export default colorSlice.reducer;
