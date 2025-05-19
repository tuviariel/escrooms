import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NumbersTemplate from "../../components/templates/NumbersTemplate";
import GridTemplate from "../../components/templates/GridTemplate";
import data from "../../services/dummyRoomData";
import ColorTemplate from "../../components/templates/ColorTemplate";
import TurnRoundTemplate from "../../components/templates/TurnRoundTemplate";
import { useQuizContext } from "../../contexts/quizNumberContext";

export interface quizDataProps {
    data: {
        _id: string;
        quiz: quizData[];
        name: string;
        mainImage: string;
    };
    index: number;
    back: () => void;
}
export interface quizData {
    _id: string;
    type: string;
    answer: string;
    quizImg: string | any;
    quizText: string;
    quizData: string[] | any[];
    category: any[] | null;
    orderAnswer: number[] | null;
    correctOptions: string[] | any[];
    inCorrectOptions: string[] | any[];
    hints: string[];
}

export const Room = () => {
    const { quizNumber, setQuizNumber } = useQuizContext();
    const types: Record<string, JSX.Element> = {
        "7segments": (
            <NumbersTemplate data={data} index={quizNumber} back={() => setQuizNumber(-1)} />
        ),
        gridPlay: <GridTemplate data={data} index={quizNumber} back={() => setQuizNumber(-1)} />,
        colorChange: (
            <ColorTemplate data={data} index={quizNumber} back={() => setQuizNumber(-1)} />
        ),
        turnRound: (
            <TurnRoundTemplate data={data} index={quizNumber} back={() => setQuizNumber(-1)} />
        ),
        working: <NumbersTemplate data={data} index={quizNumber} back={() => setQuizNumber(-1)} />,
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
                <>{types[data.quiz[quizNumber].type]}</>
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
                    {/* <div onClick={() => setQuizNumber(4)}>working</div> */}
                </>
            )}
        </>
    );
};
