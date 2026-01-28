import { QuizSchemaType } from "../CreateQuizzes";

export const QuizInfo = (data: QuizSchemaType) => {
    return (
        <div>
            <p>{data.quizText}</p>
            <p>{data.answer}</p>
            {/* <p>{data.}</p> */}
        </div>
    );
};