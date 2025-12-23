import { useEffect, useRef, useState } from "react";
import { get_text } from "../../util/language";
import pagePaginateArrow from "../../assets/images/pagePaginate.svg";
import pagePaginateArrowDisabled from "../../assets/images/pagePaginateDis.svg";
import { colorPalette, imageStyle } from "../../util/UIstyle";
import { useRoomContext } from "../../contexts/roomStyleContext";
import { quizData } from "../../pages/Room/Room";
import loading from "../../assets/images/loading.gif";

import Button from "../Button";
import Dialog from "../Dialog";

import { useUserContext } from "../../contexts/userStyleContext";
interface QuizDataProps {
    data: quizData;
    result: string;
    setResult: (newResult: string) => void;
}
export const QuizData: React.FC<Partial<QuizDataProps>> = (props) => {
    const { data, result, setResult } = props;
    const { roomStyle, roomColor } = useRoomContext();
    const { userLanguage } = useUserContext();
    const [quizDataPageNumber, setQuizDataPageNumber] = useState<number>(0);
    const [colorOrder, setColorOrder] = useState<string[][]>(
        data?.type === "colorChange" ? new Array(data?.quiz.length).fill(["", ""]) : []
    );
    const [answerData, setAnswerData] = useState<string[][]>();
    const [answerKeys, setAnswerKeys] = useState<string[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openStatus, setOpenStatus] = useState(-1);
    const [stage, setStage] = useState(1); // 1: pick from 2, 2: pick from 3
    const imgContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let ans2: string[] = [],
            ans3: string[] = [];
        let answer: string[][] = [];
        let keys = Object.keys(data?.quiz[0].answer);
        data?.quiz.map((card) => {
            !ans2.includes(card.answer[keys[0]]) && ans2.push(card.answer[keys[0]]);
            !ans3.includes(card.answer[keys[1]]) && ans3.push(card.answer[keys[1]]);
        });
        answer.push(ans2);
        answer.push(ans3);
        setAnswerData(answer);
        setAnswerKeys(keys);
        // if (
        //     data?.type === "colorChange" &&
        //     data?._id.toString() &&
        //     localStorage.getItem(data?._id.toString())
        // ) {
        //     setColorOrder(JSON.parse(localStorage.getItem(data?._id.toString()) || "[]"));
        // }
        // return () => {
        //     if (result === get_text("success", userLenguage)) {
        //         data?._id.toString() && localStorage.removeItem(data?._id.toString());
        //     } else {
        //         data?._id.toString() &&
        //             localStorage.setItem(data?._id.toString(), JSON.stringify(colorOrder));
        //     }
        // };
    }, []);
    // useEffect(() => {
    //     quizDataPageNumber !== -1 ? setOpenDialog(true) : setOpenDialog(false);
    // }, [quizDataPageNumber]);
    useEffect(() => {
        if (openDialog === false) {
            // setQuizDataPageNumber(0);
            result && setResult && setResult("");
        }
    }, [openDialog]);
    // const pagination = (clicked: string) => {
    //     console.log(clicked);
    //     if (clicked === "next") {
    //         data &&
    //             quizDataPageNumber < data.quizData.length - 1 &&
    //             setQuizDataPageNumber((prev) => prev + 1);
    //     } else {
    //         //clicked==="prev"
    //         quizDataPageNumber !== 0 && setQuizDataPageNumber((prev) => prev - 1);
    //     }
    // };
    useEffect(() => {
        if (imgContainerRef.current)
            imgContainerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
    }, [quizDataPageNumber]);

    const colorChange = (choose: string) => {
        console.log(choose, quizDataPageNumber, stage, colorOrder);
        const updatedColorOrder = [...colorOrder];
        updatedColorOrder[quizDataPageNumber] = [...colorOrder[quizDataPageNumber]];
        if (stage === 1) {
            updatedColorOrder[quizDataPageNumber][0] = choose;
            setStage(2);
        } else if (stage === 2) {
            updatedColorOrder[quizDataPageNumber][1] = choose;
            setStage(1);
            setOpenDialog(false);
        }
        setColorOrder(updatedColorOrder);
        data?._id && localStorage.setItem(data?._id.toString(), JSON.stringify(updatedColorOrder));
    };
    // const pickFrom2 = (choose: number) => {
    //     console.log(choose);
    //     setStage(2);
    // };
    // const pickFrom3 = (choose: number) => {
    //     console.log(choose);
    //     setStage(1);
    //     setOpenDialog(false);
    // };

    const checkOrderAnswer = () => {
        let count = 0,
            i;
        for (i = 0; i <= colorOrder.length - 1; i++) {
            console.log("correct", i, colorOrder[i], answerKeys[0], answerKeys[1]);
            if (
                data?.quiz[i].answer[answerKeys[0]] === colorOrder[i][0] &&
                data.quiz[i].answer[answerKeys[1]] === colorOrder[i][1]
            ) {
                console.log("correct");
                count++;
            }
        }
        setResult &&
            setResult(
                count === i
                    ? get_text("success", userLanguage)
                    : count === 0
                      ? get_text("wrong", userLanguage) + ": (" + count + "/" + i + ")"
                      : get_text("continue", userLanguage) + ": (" + count + "/" + i + ")"
            );
    };
    console.log(quizDataPageNumber);
    return (
        <>
            {data && data.quiz.length > 1 ? (
                <div className="relative w-full h-full font-bold">
                    <img
                        style={{
                            backgroundColor:
                                quizDataPageNumber !== 0
                                    ? colorPalette[roomColor as keyof typeof colorPalette].light
                                    : "white",
                        }}
                        src={
                            quizDataPageNumber !== 0 ? pagePaginateArrow : pagePaginateArrowDisabled
                        }
                        alt={
                            quizDataPageNumber !== 0
                                ? get_text("prev_page", userLanguage)
                                : get_text("no_prev_page", userLanguage)
                        }
                        title={
                            quizDataPageNumber !== 0
                                ? get_text("prev_page", userLanguage)
                                : get_text("no_prev_page", userLanguage)
                        }
                        className={`${
                            quizDataPageNumber !== 0
                                ? "cursor-pointer hover:border-amber-500"
                                : "cursor-not-allowed"
                        } h-12 w-12 absolute left-24 top-2 z-20 p-1 rounded-full bg-gray-100 border-2`}
                        onClick={() =>
                            quizDataPageNumber !== 0 && setQuizDataPageNumber((prev) => prev - 1)
                        }
                    />
                    <img
                        style={{
                            backgroundColor:
                                quizDataPageNumber < data.quiz.length - 1
                                    ? colorPalette[roomColor as keyof typeof colorPalette].light
                                    : "white",
                        }}
                        src={
                            quizDataPageNumber < data.quiz.length - 1
                                ? pagePaginateArrow
                                : pagePaginateArrowDisabled
                        }
                        alt={
                            quizDataPageNumber < data.quiz.length - 1
                                ? get_text("next_page", userLanguage)
                                : get_text("no_next_page", userLanguage)
                        }
                        title={
                            quizDataPageNumber < data.quiz.length - 1
                                ? get_text("next_page", userLanguage)
                                : get_text("no_next_page", userLanguage)
                        }
                        className={`${
                            quizDataPageNumber < data.quiz.length - 1
                                ? "cursor-pointer hover:border-amber-500"
                                : "cursor-not-allowed opacity-50"
                        } h-12 w-12 absolute right-24 top-2 z-20 p-1 rounded-full border-2 rotate-180`}
                        onClick={() =>
                            quizDataPageNumber < data.quiz.length - 1 &&
                            setQuizDataPageNumber((prev) => prev + 1)
                        }
                    />
                    <div
                        className="flex flex-row flex-nowrap overflow-hidden snap-x snap-mandatory no-scrollbar" //x-auto scroll-smooth
                    >
                        {data.quiz.map((item, i) => {
                            return (
                                <div
                                    className={"relative h-screen shrink-0 snap-center py-20 px-4"}
                                    style={{
                                        backgroundImage: `url(${imageStyle[roomStyle as keyof typeof imageStyle].background})`,
                                        // backgroundSize: "cover",
                                    }}
                                    ref={quizDataPageNumber === i ? imgContainerRef : null}
                                    key={i}>
                                    <div
                                        className={`cursor-pointer h-full max-w-screen flex gap-4 px-4`}
                                        onClick={() => setOpenDialog(true)}
                                        onScroll={() =>
                                            quizDataPageNumber !== i && setQuizDataPageNumber(i)
                                        }
                                        onTouchEnd={() =>
                                            quizDataPageNumber !== i && setQuizDataPageNumber(i)
                                        }>
                                        <img
                                            src={item.image}
                                            alt={`Quiz image ${i + 1}`}
                                            className="border-2 border-white"
                                        />
                                        <div
                                            className="flex flex-col relative px-22 py-3"
                                            dir={userLanguage === "he" ? "rtl" : "ltr"}
                                            style={{
                                                backgroundImage: `url(${imageStyle[roomStyle as keyof typeof imageStyle].semiBackground})`,
                                                backgroundSize: "cover",
                                            }}>
                                            <div
                                                className="text-center mt-2 text-3xl p-1 rounded-md "
                                                style={{
                                                    backgroundColor:
                                                        colorPalette[
                                                            roomColor as keyof typeof colorPalette
                                                        ].light,
                                                }}>
                                                {item.title}
                                                {/* + " " + data.quizData[i]} */}
                                            </div>
                                            <div
                                                className="text-right mt-2 mx-3 text-2xl font-semibold p-1 rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        colorPalette[
                                                            roomColor as keyof typeof colorPalette
                                                        ].light,
                                                }}>
                                                {item.desc}
                                            </div>
                                            {/* {colorOrder[i][0] !== "" && ( */}
                                            <div className="absolute right-1/2 translate-x-1/2 bottom-6 flex gap-6 text-center font-extrabold text-xl whitespace-nowrap text-black">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className="p-1 rounded-md"
                                                        style={{
                                                            backgroundColor:
                                                                colorPalette[
                                                                    roomColor as keyof typeof colorPalette
                                                                ].light,
                                                        }}>
                                                        {answerKeys[0]}
                                                    </div>
                                                    <div
                                                        className={`w-16 h-16 flex flex-col content-center rounded-full items-center justify-center text-white 
                                                            ${
                                                                answerData &&
                                                                answerData[0][0] ===
                                                                    colorOrder[i][0]
                                                                    ? "bg-amber-500"
                                                                    : answerData &&
                                                                        answerData[0][1] ===
                                                                            colorOrder[i][0]
                                                                      ? "bg-purple-500"
                                                                      : "bg-gray-500"
                                                            }`}>
                                                        {colorOrder[i][0] !== ""
                                                            ? colorOrder[i][0]
                                                            : "?"}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className="p-1 rounded-md"
                                                        style={{
                                                            backgroundColor:
                                                                colorPalette[
                                                                    roomColor as keyof typeof colorPalette
                                                                ].light,
                                                        }}>
                                                        {answerKeys[1]}
                                                    </div>
                                                    <div
                                                        className={`w-20 h-12 flex flex-col content-center rounded-xl my-auto py-auto items-center justify-center text-white
                                                            ${
                                                                answerData &&
                                                                answerData[1][0] ===
                                                                    colorOrder[i][1]
                                                                    ? "bg-emerald-500"
                                                                    : answerData &&
                                                                        answerData[1][1] ===
                                                                            colorOrder[i][1]
                                                                      ? "bg-pink-500"
                                                                      : answerData &&
                                                                          answerData[1][2] ===
                                                                              colorOrder[i][1]
                                                                        ? "bg-cyan-500"
                                                                        : "bg-gray-500"
                                                            }`}>
                                                        {colorOrder[i][1] !== ""
                                                            ? colorOrder[i][1]
                                                            : "?"}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* )} */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Dialog
                        open={openDialog}
                        setOpen={setOpenDialog}
                        size="xLarge"
                        disableOverlayClose={false}
                        data="">
                        {quizDataPageNumber !== -1 ? (
                            <div
                                className="relative flex h-full"
                                style={{
                                    backgroundImage: `url(${imageStyle[roomStyle as keyof typeof imageStyle].background})`,
                                    backgroundSize: "cover",
                                }}>
                                <img
                                    src={data.quiz[quizDataPageNumber].image}
                                    alt={`Quiz Image ${quizDataPageNumber + 1}`}
                                    className="h-11/12 w-auto"
                                />
                                <div
                                    className="flex flex-col relative px-32"
                                    dir={userLanguage === "he" ? "rtl" : "ltr"}
                                    style={{
                                        backgroundImage: `url(${imageStyle[roomStyle as keyof typeof imageStyle].semiBackground})`,
                                        backgroundSize: "cover",
                                    }}>
                                    <div className="text-center mt-2 text-xl">
                                        {data.quiz[quizDataPageNumber].title}
                                        {/* +
                                            " " +
                                            data.quizData[quizDataPageNumber]} */}
                                    </div>
                                    <div className="text-right mt-2">
                                        {data.quiz[quizDataPageNumber].desc}
                                    </div>
                                    <div
                                        className={`mr-auto ml-2 rounded-full ${openStatus === -1 ? "bg-emerald-300" : "bg-amber-300"} w-6 h-6 text-center cursor-pointer relative`}
                                        onClick={() =>
                                            setOpenStatus((prev) =>
                                                prev === -1 ? quizDataPageNumber : -1
                                            )
                                        }
                                        onMouseLeave={() => setOpenStatus(-1)}
                                        title={get_text("more_info", userLanguage) + "..."}>
                                        !
                                        {openStatus !== -1 && (
                                            <div
                                                className="absolute left-6 top-6 flex flex-col bg-white bg-opacity-80 p-2 rounded-lg border-2 border-amber-400 text-right"
                                                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                                                <span className="text-sm">
                                                    {get_text("more_info", userLanguage) + ": "}
                                                </span>
                                                {Object.keys(
                                                    data.quiz[quizDataPageNumber].status
                                                ).map((k, i) => {
                                                    return (
                                                        <span
                                                            key={i}
                                                            className="text-sm whitespace-nowrap wrap-break-word">
                                                            {k +
                                                                ": " +
                                                                Object.values(
                                                                    data.quiz[quizDataPageNumber]
                                                                        .status
                                                                )[i]}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-center text-center">
                                        {answerKeys[stage === 1 ? 0 : 1]}
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Button
                                            onClick={() =>
                                                answerData &&
                                                colorChange(answerData[stage === 1 ? 0 : 1][0])
                                            }
                                            className="mx-2">
                                            <div
                                                className={`w-10 h-10 cursor-pointer whitespace-nowrap ${stage === 1 ? "bg-amber-500 rounded-full" : "bg-emerald-500 rounded-lg"} flex items-center justify-center text-white`}>
                                                {answerData && answerData[stage === 1 ? 0 : 1][0]}
                                            </div>
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                answerData &&
                                                colorChange(answerData[stage === 1 ? 0 : 1][1])
                                            }
                                            className="mx-2">
                                            <div
                                                className={`w-10 h-10 cursor-pointer whitespace-nowrap ${stage === 1 ? "bg-purple-500 rounded-full" : "bg-pink-500 rounded-lg"} flex items-center justify-center text-white`}>
                                                {answerData && answerData[stage === 1 ? 0 : 1][1]}
                                            </div>
                                        </Button>
                                        {stage === 2 && (
                                            <Button
                                                onClick={() =>
                                                    answerData && colorChange(answerData[1][2])
                                                }
                                                className="mx-2">
                                                <div className="w-10 h-10 cursor-pointer whitespace-nowrap bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                                                    {answerData && answerData[1][2]}
                                                </div>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </Dialog>
                    {data.type === "colorChange" && (
                        <div className="absolute left-2 bottom-2 flex gap-3">
                            <Button
                                onClick={checkOrderAnswer}
                                label={get_text("check_answer", userLanguage)}
                                className=""
                            />
                            {result && (
                                <div className="content-center h-8 mt-2 border-amber-200 border-2 bg-white rounded-xl px-2">
                                    {result}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <img src={loading} alt="riddle - error..." className="h-screen w-full" />
            )}
        </>
    );
};
