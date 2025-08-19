import { configureStore } from "@reduxjs/toolkit";
// import gridReducer from "./gridQuiz";
// import colorReducer from "./colorQuizAnswer";
// import segmentsReducer from "./segmentsQuizAnswer";
import quizNumberReducer from "./quizNumber";
import quizListReducer from "./quizList";

const store = configureStore({
    reducer: { quizNumber: quizNumberReducer, quizList: quizListReducer }, //, color: colorReducer, segments: segmentsReducer }, //the store has a reducer object that includes all the slices of the state coming from the the different files.
});
//the slice is the option to manage different parts of the (one) state store in different sections that should be divided to different files
export default store;
