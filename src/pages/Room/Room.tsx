import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
// import NumbersTemplate from "../../components/templates/NumbersTemplate";
// import GridTemplate from "../../components/templates/GridTemplate";
import data from "../../services/dummyRoomData";
// import ColorTemplate from "../../components/templates/Color";
// import TurnRoundTemplate from "../../components/templates/TurnRoundTemplate";
// import OrderBorderTemplate from "../../components/templates/OrderBorder";
import { useRoomContext } from "../../contexts/roomStyleContext";
import { colorPalette } from "../../util/UIstyle";
import backArrow from "../../assets/images/backArrow.svg";
import { get_text } from "../../util/language";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { quizNumberActions } from "../../reduxStor/quizNumber";
import QuizTemplate from "../QuizTemplate";
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
        (state: {
            quizList: { list: { id: number; completed: boolean; type: string; image: string }[] };
        }) => state.quizList
    );
    const quizList = quizL?.list;
    const [checkLeave, setCheckLeave] = useState(false);
    // const [quizList, setQuizList] = useState<{ id: number; completed: boolean }[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const roomId = location.pathname.split("/").pop();
    const { setRoomColor, setRoomStyle, setRoomFont, roomColor } = useRoomContext();
    useEffect(() => {
        // in future get room data from Api call via roomId. now just checking Id is right:
        if (roomId !== data._id) {
            navigate("/");
        } else if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
            // if (screen.orientation && screen.orientation.lock) {
            //     screen.orientation.lock("landscape").catch((err) => {
            //         console.warn("Orientation lock failed:", err);
            //     });
            // }
            console.log("orientation:", screen.orientation);
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
                    <QuizTemplate data={data.quiz[quizNumber]} />
                </>
            ) : (
                <>
                    <div className="h-screen w-full relative flex justify-center items-center overflow-hidden md:pt-20 md:pb-20 bg-gray-900">
                        <div className="h-full relative bg-gray-900">
                            <img
                                src={data.mainImage}
                                alt="mainImage"
                                className="h-full w-auto object-cover"
                            />
                            {quizList &&
                                quizList.map((quiz: any, i: number) => {
                                    return (
                                        <div
                                            key={quiz.id}
                                            className={`absolute ${i === 0 ? "top-4 left-8 md:left-32" : i === 1 ? "top-30 left-2 md:left-22" : i === 2 ? "top-4 right-8 md:right-32" : i === 3 ? "top-30 right-2 md:right-22" : ""} z-30 h-22 w-22 rounded-full ${
                                                quiz.completed
                                                    ? ""
                                                    : "backdrop-blur-md border-2 hover:border-amber-50 cursor-pointer"
                                            }`}
                                            onClick={() =>
                                                !quiz.completed && setQuizNumber(quiz.id)
                                            }
                                            style={{
                                                borderColor: quiz.completed
                                                    ? colorPalette[
                                                          roomColor as keyof typeof colorPalette
                                                      ].dark
                                                    : colorPalette[
                                                          roomColor as keyof typeof colorPalette
                                                      ].bright,
                                            }}
                                            title={quiz.type}>
                                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                                <img
                                                    src={quiz.image}
                                                    alt="Quiz Image"
                                                    className="w-full h-full rounded-full"
                                                />
                                                {!quiz.completed && (
                                                    <div
                                                        className="absolute top-0 right-0 blur-sm w-full h-full opacity-100"
                                                        style={{
                                                            background:
                                                                colorPalette[
                                                                    roomColor as keyof typeof colorPalette
                                                                ].dark,
                                                        }}></div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div
                            className="fixed top-3 left-3 rounded-full font-bold p-2 z-20 border-2 text-black bg-white hover:text-red-500 hover:border-red-500 cursor-pointer"
                            title={get_text("exit_room", "he")}
                            onClick={() => setCheckLeave(true)}>
                            x
                        </div>
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
