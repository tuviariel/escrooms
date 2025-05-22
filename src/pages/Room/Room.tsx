import { JSX, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import NumbersTemplate from "../../components/templates/NumbersTemplate";
import GridTemplate from "../../components/templates/GridTemplate";
import data from "../../services/dummyRoomData";
import ColorTemplate from "../../components/templates/ColorTemplate";
import TurnRoundTemplate from "../../components/templates/TurnRoundTemplate";
import OrderBorderTemplate from "../../components/templates/OrderBorderTemplate";
import { useQuizContext } from "../../contexts/quizNumberContext";
import backArrow from "../../assets/images/backArrow.svg";
import { get_text } from "../../util/language";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";

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
export interface quizDataP {
    data: quizData;
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
        "7segments": <NumbersTemplate data={data.quiz[quizNumber]} />,
        gridPlay: <GridTemplate data={data.quiz[quizNumber]} />,
        colorChange: <ColorTemplate data={data.quiz[quizNumber]} />,
        turnRound: <TurnRoundTemplate data={data.quiz[quizNumber]} />,
        borderOrder: <OrderBorderTemplate />, //</OrderBorderTemplate>data={data.quiz[quizNumber]} />,
    };
    const [checkLeave, setCheckLeave] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const roomId = location.pathname.split("/").pop();
    useEffect(() => {
        // in future get room data from Api call via roomId. now just checking Id is right:
        if (roomId !== data._id) {
            navigate("/");
        } else if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    }, []);
    console.log(window.innerWidth);
    return (
        <>
            {window.innerWidth < 600 ? (
                <div className="h-screen w-screen bg-gray-900 text-amber-50 text-center flex flex-col justify-center items-center p-20">
                    {get_text("phone_on_side", "he")}
                </div>
            ) : quizNumber > -1 ? (
                <>
                    <img
                        src={backArrow}
                        alt={get_text("back_to_main", "he")}
                        title={get_text("back_to_main", "he")}
                        className="cursor-pointer h-8 w-8 z-20 md:h-12 md:w-12 fixed left-3 top-3 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-700"
                        onClick={() => setQuizNumber(-1)}
                    />
                    {types[data.quiz[quizNumber].type]}
                </>
            ) : (
                <>
                    <div className="h-screen w-full relative">
                        <img src={data.mainImage} alt="mainImage" className="h-full w-auto" />
                        <div
                            className="fixed top-3 left-3 rounded-full p-3 z-20 border-2 text-black hover:text-red-500 hover:border-red-500 cursor-pointer"
                            title={get_text("exit_room", "he")}
                            onClick={() => setCheckLeave(true)}>
                            X
                        </div>
                        {/* quiz #0 */}
                        <div
                            className="absolute md:top-5 top-2 md:left-5 left-2 md:h-44 h-16 md:w-64 w-36 backdrop-blur-md border-2 hover:border-amber-50 rounded-full cursor-pointer"
                            onClick={() => setQuizNumber(0)}></div>
                        {/* quiz #2 */}
                        <div
                            className="absolute bottom-0 md:left-28 left-12 md:h-72 h-32 md:w-88 w-36 backdrop-blur-md border-2 hover:border-amber-50 cursor-pointer"
                            onClick={() => setQuizNumber(2)}></div>
                        {/* quiz #1 */}
                        <div
                            className="absolute bottom-0 md:right-28 right-12 md:h-72 h-32 md:w-88 w-36 backdrop-blur-md border-2 hover:border-amber-50 cursor-pointer"
                            onClick={() => setQuizNumber(2)}></div>
                    </div>
                    <Dialog
                        open={checkLeave}
                        setOpen={setCheckLeave}
                        size="small"
                        disableOverlayClose={true}
                        data="">
                        <>
                            <div className="p-4 text-right" dir="rtl">
                                <h2 className="text-lg font-semibold mb-2">
                                    {get_text("leave_room", "he")}
                                </h2>
                                <p>{get_text("are_you_sure", "he")}</p>
                            </div>
                            <div className="flex justify-end p-4 border-t">
                                <Button
                                    label={get_text("cancel", "he")}
                                    onClick={() => setCheckLeave(false)}
                                    className="mr-2"
                                />
                                <Button
                                    label={get_text("confirm", "he")}
                                    onClick={() => navigate("/")}
                                />
                            </div>
                        </>
                    </Dialog>
                </>
            )}
        </>
    );
};
