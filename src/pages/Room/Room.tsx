import { JSX, useState } from "react";
import NumbersTemplate from "../../components/NumbersTemplate";
import GridTemplate from "../../components/GridTemplate";
import data from "../../services/dummyRoomData";

export interface quizDataProps {
    data: {
        _id: string;
        quiz: quizData[];
        name: string;
        mainImage: string;
    };
    index: number;
}
interface quizData {
    _id: string;
    type: string;
    answer: number;
    quizImg: string;
    quizText: string;
    quizData: string[];
    correctOptions: string[];
    inCorrectOptions: string[];
    hints: string[];
}

export const Room = () => {
    const [quizNumber, setQuizNumber] = useState<number>(-1);
    const types: Record<string, JSX.Element> = {
        "7segments": <NumbersTemplate data={data} index={quizNumber} />,
        gridPlay: <GridTemplate data={data} index={quizNumber} />,
    };
    console.log(quizNumber, data.quiz[quizNumber]);
    return (
        <>
            {quizNumber > -1 ? (
                <>
                    <div onClick={() => setQuizNumber(-1)}>Back to main</div>
                    {types[data.quiz[quizNumber].type]}
                </>
            ) : (
                <>
                    <div>Room main Show</div>
                    <img src={data.mainImage} alt="mainImage" className="h-full" />
                    <div onClick={() => setQuizNumber(0)}>7segments quiz</div>
                    <div onClick={() => setQuizNumber(1)}>grid quiz</div>
                    <div onClick={() => setQuizNumber(2)}>third quiz</div>
                    <div onClick={() => setQuizNumber(3)}>forth quiz</div>
                </>
            )}
        </>
    );
};
