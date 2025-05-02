import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NumbersTemplate from "../../components/templates/NumbersTemplate";
import GridTemplate from "../../components/templates/GridTemplate";
import data from "../../services/dummyRoomData";
import ColorTemplate from "../../components/templates/ColorTemplate";
import TurnRoundTemplate from "../../components/templates/TurnRoundTemplate";

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
    answer: string;
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
        colorChange: <ColorTemplate data={data} index={quizNumber} />,
        turnRound: <TurnRoundTemplate data={data} index={quizNumber} />,
    };
    const navigate = useNavigate();
    useEffect(() => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
            //   } else if (document.documentElement.webkitRequestFullscreen) { // Safari
            //     document.documentElement.webkitRequestFullscreen();
            //   } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            //     document.documentElement.msRequestFullscreen();
        }
    }, []);
    // console.log(quizNumber, data.quiz[quizNumber]);
    return (
        <>
            {quizNumber > -1 ? (
                <>
                    <div onClick={() => setQuizNumber(-1)}>Back to main</div>
                    {types[data.quiz[quizNumber].type]}
                </>
            ) : (
                <>
                    <div className="flex flex-col">
                        <div className="ml-3 mr-auto" onClick={() => navigate("/")}>
                            exit room
                        </div>
                        <div className="ml-auto text-center">Room main Show</div>
                    </div>
                    <img src={data.mainImage} alt="mainImage" className="h-20" />
                    <div onClick={() => setQuizNumber(0)}>7segments quiz</div>
                    <div onClick={() => setQuizNumber(1)}>grid quiz</div>
                    <div onClick={() => setQuizNumber(2)}>color quiz</div>
                    <div onClick={() => setQuizNumber(3)}>turn round quiz</div>
                </>
            )}
        </>
    );
};
