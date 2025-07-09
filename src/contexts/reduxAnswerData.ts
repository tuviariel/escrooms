import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Answer = {
    questionId: string;
    answer: string;
};

type QuizAnswers = {
    [quizId: string]: Answer[];
};

interface AnswerState {
    quizzes: QuizAnswers;
}

const initialState: AnswerState = {
    quizzes: {},
};

const answerSlice = createSlice({
    name: "answersData",
    initialState,
    reducers: {
        saveAnswer: (
            state: any,
            action: PayloadAction<{ quizId: string; questionId: string; answer: string }>
        ) => {
            const { quizId, questionId, answer } = action.payload;
            if (!state.quizzes[quizId]) {
                state.quizzes[quizId] = [];
            }
            const existing = state.quizzes[quizId].find((a: any) => {
                return a.questionId === questionId;
            });
            if (existing) {
                existing.answer = answer;
            } else {
                state.quizzes[quizId].push({ questionId, answer });
            }
        },
        clearQuizAnswers: (state: any, action: PayloadAction<{ quizId: string }>) => {
            delete state.quizzes[action.payload.quizId];
        },
        clearAllAnswers: (state: any) => {
            state.quizzes = {};
        },
    },
});

export const { saveAnswer, clearQuizAnswers, clearAllAnswers } = answerSlice.actions;
export default answerSlice.reducer;
