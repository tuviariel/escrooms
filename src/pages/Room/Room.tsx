import { JSX, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import NumbersTemplate from "../../components/templates/NumbersTemplate";
import GridTemplate from "../../components/templates/GridTemplate";
import data from "../../services/dummyRoomData";
import ColorTemplate from "../../components/templates/ColorTemplate";
import TurnRoundTemplate from "../../components/templates/TurnRoundTemplate";
import OrderBorderTemplate from "../../components/templates/OrderBorderTemplate";
import { useRoomContext } from "../../contexts/roomStyleContext";
import backArrow from "../../assets/images/backArrow.svg";
import { get_text } from "../../util/language";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { quizNumberActions } from "../../reduxStor/quizNumber";
// import { quizListActions } from "../../reduxStor/quizList";
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
    data: quizData | any;
}
export interface quizData {
    _id: string;
    type: string;
    answer: string;
    quiz: any[];
    quizImg: string | any;
    quizText: string;
    quizData: string[] | any[];
    category: any[] | null;
    orderAnswer: number[][] | null;
    // correctOptions: string[] | any[];
    // inCorrectOptions: string[] | any[];
    hints: string[];
}

export const Room = () => {
    const quiz = useSelector((state: { quizNumber: { quizNumber: number } }) => state.quizNumber);
    const quizNumber = quiz?.quizNumber;
    const dispatch = useDispatch();
    const setQuizNumber = (number: number) => {
        dispatch(quizNumberActions.changeQuizNumber(number));
        console.log("setQuizNumber", number);
    };
    const quizL = useSelector(
        (state: { quizList: { list: { id: number; completed: boolean }[] } }) => state.quizList
    );
    const quizList = quizL?.list;
    // const setQuizList = (number: number) => {
    //     dispatch(quizListActions.changeQuizList(number));
    // };
    // const { quizNumber, setQuizNumber } = useQuizContext();
    const types: Record<string, JSX.Element> = {
        "7segments": <NumbersTemplate data={data.quiz[quizNumber]} />,
        gridPlay: <GridTemplate data={data.quiz[quizNumber]} />,
        colorChange: <ColorTemplate data={data.quiz[quizNumber]} />,
        turnRound: <TurnRoundTemplate data={data.quiz[quizNumber]} />,
        borderOrder: <OrderBorderTemplate />, //</OrderBorderTemplate>data={data.quiz[quizNumber]} />,
    };
    const [checkLeave, setCheckLeave] = useState(false);
    // const [quizList, setQuizList] = useState<{ id: number; completed: boolean }[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const roomId = location.pathname.split("/").pop();
    const { setRoomColor, setRoomStyle, setRoomFont } = useRoomContext();
    useEffect(() => {
        // in future get room data from Api call via roomId. now just checking Id is right:
        if (roomId !== data._id) {
            navigate("/");
        } else if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
            setRoomStyle(data.imageStyle);
            setRoomColor(data.colorPalette);
            setRoomFont(data.fontFamily);
        }
    }, []);
    console.log();
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
                        <div className="absolute top-0 left-0">
                            {quizList ? (
                                quizList.map((quiz: any) => {
                                    return (
                                        <div
                                            key={quiz.id}
                                            className={`z-30 md:h-44 h-16 w-16 rounded-full ${
                                                quiz.completed
                                                    ? ""
                                                    : "backdrop-blur-md border-2 hover:border-amber-50 cursor-pointer"
                                            }`}
                                            onClick={() =>
                                                !quiz.completed && setQuizNumber(quiz.id)
                                            }>
                                            <img
                                                src={data.quiz[quiz.id].outerQuizImg}
                                                alt="Quiz Image"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <>here</>
                            )}
                        </div>
                        {/* quiz #2 */}
                        {/* <div
                            className="absolute bottom-0 md:left-28 left-12 md:h-72 h-32 md:w-88 w-36 backdrop-blur-md border-2 hover:border-amber-50 cursor-pointer"
                            onClick={() => setQuizNumber(2)}></div>
                        {/* quiz #1 *
                        <div
                            className="absolute bottom-0 md:right-28 right-12 md:h-72 h-32 md:w-88 w-36 backdrop-blur-md border-2 hover:border-amber-50 cursor-pointer"
                            onClick={() => setQuizNumber(2)}></div> */}
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
