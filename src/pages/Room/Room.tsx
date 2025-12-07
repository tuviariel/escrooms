import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useRoomContext } from "../../contexts/roomStyleContext";
import { colorPalette } from "../../util/UIstyle";
import backArrow from "../../assets/images/backArrow.svg";
import { get_text } from "../../util/language";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { quizNumberActions } from "../../reduxStor/quizNumber";
import QuizTemplate from "../QuizTemplate";
import { fileStorage } from "../../services/service";
import { quizListActions } from "../../reduxStor/quizList";
import finishedRoomGif from "../../assets/images/finishedRoom.gif";
import { useUserContext } from "../../contexts/userStyleContext";

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
    name: string;
    answer: string;
    quiz: any[];
    quizImg: string | any;
    quizText: string;
    quizData: string[] | any[];
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
            quizList: {
                list: {
                    id: number;
                    completed: boolean;
                    name: string;
                    answer: string;
                    image: string;
                }[];
            };
        }) => state.quizList
    );
    const quizList = quizL?.list;
    const setQuizList = (list: any[]) => {
        dispatch(quizListActions.createQuizList(list));
        console.log("setQuizList", list);
    };
    const { userLanguage } = useUserContext();
    const [checkLeave, setCheckLeave] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [URLMainImage, setURLMainImage] = useState<string>("");
    // const [quizList, setQuizList] = useState<{ id: number; completed: boolean }[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.roomData;
    console.log("Room data:", data);
    useEffect(() => {
        if (!data || !data.quizzes) return;
        const list = data.quizzes.map((quiz: any, index: number) => {
            return {
                id: index,
                completed: false,
                name: quiz.name,
                answer: quiz.answer,
                image: quiz.quizImg,
            };
        });
        console.log("Initializing quiz list:", list);
        setQuizList(list);
    }, [data]);

    const roomId = location.pathname.split("/").pop();
    const [orientation, setOrientation] = useState(
        window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape"
    );
    const { setRoomColor, setRoomStyle, setRoomFont, roomColor } = useRoomContext();
    useEffect(() => {
        if (roomId !== data.id) {
            navigate("/");
        } else {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
            window.matchMedia("(orientation: portrait)").addEventListener("change", (event) => {
                if (event.matches) {
                    setOrientation("portrait");
                } else {
                    setOrientation("landscape");
                }
            });
            console.log("orientation:", screen.orientation.type);
            setRoomStyle(data.imageStyle);
            setRoomColor(data.colorPalette);
            setRoomFont(data.fontFamily);
        }
    }, [screen.orientation.type]);
    useEffect(() => {
        if (quizList && quizList.length > 0) {
            const allCompleted = quizList.every((quiz: any) => quiz.completed);
            if (allCompleted) {
                setCompleted(true);
            }
        }
    }, [quizList]);
    useEffect(() => {
        const getUrl = async (mainImage: string | null) => {
            if (!mainImage) return;
            const url = await fileStorage.getFileUrl(mainImage);
            setURLMainImage(url);
        };
        getUrl(data.mainImage);
    }, []);
    console.log(quizList);
    return (
        <>
            {window.innerWidth < 600 || orientation === "portrait" ? (
                <div className="h-screen w-screen bg-gray-900 text-amber-50 text-center flex flex-col justify-center items-center p-20">
                    {get_text("phone_on_side", userLanguage)}
                </div>
            ) : quizNumber > -1 ? (
                <>
                    <img
                        src={backArrow}
                        alt={get_text("back_to_main", userLanguage)}
                        title={get_text("back_to_main", userLanguage)}
                        className="cursor-pointer h-8 w-8 z-20 md:h-12 md:w-12 fixed left-3 top-3 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-700"
                        onClick={() => setQuizNumber(-1)}
                    />
                    <QuizTemplate data={data.quizzes[quizNumber]} />
                </>
            ) : (
                <>
                    <div className="h-screen w-screen relative flex justify-center items-center overflow-hidden lg:pt-12 lg:pb-12 bg-gray-900">
                        <div className="h-full w-full relative bg-gray-900 flex justify-center items-center">
                            <img
                                src={URLMainImage}
                                alt="mainImage"
                                className="h-full w-auto object-cover"
                            />
                            {completed && (
                                <>
                                    <img
                                        src={finishedRoomGif}
                                        alt="mainImage"
                                        className="h-full w-auto object-cover z-30 blur-sm opacity-90 absolute top-0"
                                    />
                                    <div
                                        className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-4xl md:text-6xl font-bold text-white bg-opacity-90 rounded-md p-4"
                                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                                        {get_text("room_finished", userLanguage)}
                                    </div>
                                </>
                            )}
                            {quizList &&
                                quizList.map((quiz: any, i: number) => {
                                    return (
                                        <div
                                            key={quiz.id}
                                            className={`absolute ${i === 0 ? "top-4 left-8 md:left-32" : i === 1 ? "top-30 left-2 md:left-22" : i === 2 ? "top-4 right-8 md:right-32" : i === 3 ? "top-30 right-2 md:right-22" : i === 4 ? "top-80 left-8 md:left-32" : i === 5 ? "top-54 left-2 md:left-22" : i === 6 ? "top-80 right-8 md:right-32" : i === 7 ? "top-54 right-2 md:right-22" : ""} z-20 h-22 w-22 rounded-full ${
                                                quiz.completed
                                                    ? ""
                                                    : "backdrop-blur-md border-2 hover:border-amber-50 cursor-pointer"
                                            }`}
                                            onClick={() => {
                                                console.log("quiz:", quiz);
                                                !quiz.completed && setQuizNumber(quiz.id);
                                            }}
                                            style={{
                                                borderColor: quiz.completed
                                                    ? colorPalette[
                                                          roomColor as keyof typeof colorPalette
                                                      ].dark
                                                    : colorPalette[
                                                          roomColor as keyof typeof colorPalette
                                                      ].bright,
                                            }}
                                            title={quiz.name}>
                                            <div className="relative w-full h-full rounded-full">
                                                <img
                                                    src={quiz.image}
                                                    alt="Quiz Image"
                                                    className="w-full h-full rounded-full"
                                                />
                                                {!quiz.completed && (
                                                    <div
                                                        className="absolute top-0 right-0 rounded-full blur-sm w-full h-full opacity-100"
                                                        style={{
                                                            background:
                                                                colorPalette[
                                                                    roomColor as keyof typeof colorPalette
                                                                ].dark,
                                                        }}></div>
                                                )}
                                                <div
                                                    className="absolute bottom-3 w-full text-center text-white text-md py-1 z-20"
                                                    dir={userLanguage === "he" ? "rtl" : "ltr"}>
                                                    {!quiz.completed ? quiz.name : quiz.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div
                            className="w-8 h-8 text-center fixed top-3 left-3 rounded-full font-bold z-20 border-2 text-black bg-white hover:text-red-500 hover:border-red-500 cursor-pointer"
                            title={get_text("exit_room", userLanguage)}
                            onClick={() => (!completed ? setCheckLeave(true) : navigate("/"))}>
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
                            <div
                                className="p-4 text-right"
                                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                                <h2 className="text-lg font-semibold mb-2">
                                    {get_text("leave_room", userLanguage)}
                                </h2>
                                <p>{get_text("are_you_sure", userLanguage)}</p>
                            </div>
                            <div className="flex justify-end p-4 border-t">
                                <Button
                                    label={get_text("cancel", userLanguage)}
                                    onClick={() => setCheckLeave(false)}
                                    className="mr-2"
                                />
                                <Button
                                    label={get_text("confirm", userLanguage)}
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
