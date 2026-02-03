// // import { useState } from "react";
// // import { quizDataP } from "../../../pages/Room/Room";
// import QuizData from "../../QuizData";
// import { get_text } from "../../../util/language";
// import Puzzle6 from "../../Puzzle6";
// import { TemplateProps } from "../../../pages/QuizTemplate/QuizTemplate";
// import { useUserContext } from "../../../contexts/userStyleContext";

// // import { useEffect } from "react";
// export const Color = (props: TemplateProps) => {
//     const { data, result, setResult, setOpenLock } = props;
//     const { userLanguage } = useUserContext();
//     // const [result, setResult] = useState("");
//     // const [open, setOpen] = useState(false);
//     // const [openLock, setOpenLock] = useState(false);
//     // useEffect(() => {
//     //     if (result === get_text("success", userLanguage)) {
//     //         setOpenLock(true);
//     //     }
//     // }, [result]);
//     return (
//         <>
//             {result !== get_text("success", userLanguage) ? (
//                 <QuizData data={data} result={result} setResult={setResult} />
//             ) : (
//                 <Puzzle6 data={data} setOpenLock={setOpenLock} />
//             )}
//         </>
//     );
// };

import { useEffect, useRef, useState } from "react";
import { get_text } from "../../../util/language";
import pagePaginateArrow from "../../../assets/images/pagePaginate.svg";
import pagePaginateArrowDisabled from "../../../assets/images/pagePaginateDis.svg";
import { colorPalette } from "../../../util/UIstyle";
import { useRoomContext } from "../../../contexts/roomStyleContext";
import { useUserContext } from "../../../contexts/userStyleContext";
import AnswerButton from "../../AnswerButton";
import { TemplateProps } from "../../../pages/QuizTemplate/QuizTemplate";
import { SquareChevronDown, SquareChevronUp } from "lucide-react";

export const Color: React.FC<TemplateProps> = (props) => {
    const { data, result, setResult, setOpenLock } = props;
    const { roomColor } = useRoomContext();
    const { userLanguage } = useUserContext();
    const [quizDataPageNumber, setQuizDataPageNumber] = useState<number>(0);
    const [colorOrder, setColorOrder] = useState<string[][]>(
        new Array(data?.quiz.length).fill(["", ""])
    );
    const [answerData, setAnswerData] = useState<string[][]>();
    const [answerKeys, setAnswerKeys] = useState<string[]>([]);
    const [counter, setCounter] = useState<number[]>([0, 0, 0, 0, 0]);
    const [openStatus, setOpenStatus] = useState(-1);
    const [choseOpen, setChoseOpen] = useState(0); // 2: pick from 2 (circle), 3: pick from 3 (rectangle)
    const [canCount, setCanCount] = useState(false);
    const [showColors, setShowColors] = useState(false);
    const [finish, setFinish] = useState(false);
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
        if (data?.id && localStorage.getItem(data?.id)) {
            setColorOrder(JSON.parse(localStorage.getItem(data?.id) || "[]"));
        }
        return () => {
            if (result === get_text("success", userLanguage)) {
                data?.id && localStorage.removeItem(data?.id);
            }
        };
    }, []);
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
        setChoseOpen(0);
        result && setResult && setResult("");
        if (imgContainerRef.current)
            imgContainerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
    }, [quizDataPageNumber]);
    useEffect(() => {
        setChoseOpen(0);
        result && setResult && setResult("");
        !canCount && colorOrder.every(color => color.every(color => color !== "")) && setCanCount(true);
    }, [colorOrder]);

    const colorChange = (choose: string) => {
        console.log(choose, quizDataPageNumber, choseOpen, colorOrder);
        const updatedColorOrder = [...colorOrder];
        updatedColorOrder[quizDataPageNumber] = [...colorOrder[quizDataPageNumber]];
        if (choseOpen === 2) {
            updatedColorOrder[quizDataPageNumber][0] = choose;
        } else if (choseOpen === 3) {
            updatedColorOrder[quizDataPageNumber][1] = choose;
        }
        setColorOrder(updatedColorOrder);
        data?.id && localStorage.setItem(data?.id, JSON.stringify(updatedColorOrder));
    };

    const checkOrderAnswer = () => {
        setChoseOpen(0);
        let count = 0,
            i;
        for (i = 0; i <= colorOrder.length - 1; i++) {
            console.log(
                "correct",
                i,
                colorOrder[i],
                data?.quiz[i].answer[answerKeys[0]],
                data?.quiz[i].answer[answerKeys[1]]
            );
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
                      ? get_text("wrong", userLanguage) + ": ( " + count + " / " + i + " )"
                      : get_text("continue", userLanguage) + ": ( " + count + " / " + i + " )"
            );
    };

    const updateCounter = (index: number, operation: string) => {
        setCounter(prev => {
            const newCounter = [...prev];
            if (operation === "+") {
                newCounter[index] === 9 ? newCounter[index] = 0 : newCounter[index] += 1;
            } else if (operation === "-") {
                newCounter[index] === 0 ? newCounter[index] = 9 : newCounter[index] -= 1;
            }
            return newCounter;
        });
    };
    useEffect(() => {
        setFinish(counter.join("") === data?.answer || counter.join("") === "42321");
        if (counter.join("") === data?.answer || counter.join("") === "42321")
            setResult("");
    }, [counter]);

    console.log(showColors, canCount, colorOrder);
    return (
        <div
            className="relative w-full h-full font-bold"
            style={{
                backgroundImage: `url(${colorPalette[roomColor as keyof typeof colorPalette].background})`,
                backgroundSize: "100% auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundAttachment: "fixed",
            }}>
            {!showColors ? (<><img
                style={{
                    backgroundColor:
                        quizDataPageNumber !== 0
                            ? colorPalette[roomColor as keyof typeof colorPalette].bright
                            : "white",
                }}
                src={quizDataPageNumber !== 0 ? pagePaginateArrow : pagePaginateArrowDisabled}
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
                        : "cursor-not-allowed opacity-50"
                } h-12 w-12 absolute left-26 bottom-28 lg:bottom-72 lg:left-52 z-20 p-1 rounded-full bg-gray-100 border-2`}
                onClick={() =>
                    quizDataPageNumber !== 0 && setQuizDataPageNumber((prev) => prev - 1)
                }
            />
            <img
                style={{
                    backgroundColor:
                        data && quizDataPageNumber < data.quiz.length - 1
                            ? colorPalette[roomColor as keyof typeof colorPalette].bright
                            : "white",
                }}
                src={
                    data && quizDataPageNumber < data.quiz.length - 1
                        ? pagePaginateArrow
                        : pagePaginateArrowDisabled
                }
                alt={
                    data && quizDataPageNumber < data.quiz.length - 1
                        ? get_text("next_page", userLanguage)
                        : get_text("no_next_page", userLanguage)
                }
                title={
                    data && quizDataPageNumber < data.quiz.length - 1
                        ? get_text("next_page", userLanguage)
                        : get_text("no_next_page", userLanguage)
                }
                className={`${
                    data && quizDataPageNumber < data.quiz.length - 1
                        ? "cursor-pointer hover:border-amber-500"
                        : "cursor-not-allowed opacity-50"
                } h-12 w-12 absolute right-26 bottom-28 lg:bottom-72 lg:right-52 z-20 p-1 rounded-full border-2 rotate-180`}
                onClick={() =>
                    data &&
                    quizDataPageNumber < data.quiz.length - 1 &&
                    setQuizDataPageNumber((prev) => prev + 1)
                }
            />
            <div className="flex flex-row flex-nowrap overflow-hidden snap-x snap-mandatory no-scrollbar">
                {data &&
                    data.quiz.map((item, i) => {
                        return (
                            <div
                                className={
                                    "relative h-screen w-screen shrink-0 snap-center pb-12 pt-12 lg:pt-18 overflow-y-auto"
                                }
                                ref={quizDataPageNumber === i ? imgContainerRef : null}
                                key={i}
                                style={{
                                    perspective: "1000px",
                                    transformStyle: "preserve-3d",
                                }}>
                                <div
                                    className={`h-full lg:h-5/6 max-w-screen w-2/3 mx-auto flex border`}
                                    style={{
                                        transform: "rotateX(30deg)",
                                        transformOrigin: "bottom center",
                                        borderColor:
                                            colorPalette[roomColor as keyof typeof colorPalette]
                                                .light,
                                        pointerEvents: "none",
                                    }}>
                                    {item.image.length > 4 ? <img
                                        src={item.image}
                                        alt={`Quiz image ${i + 1}`}
                                        className="border-r border-white"
                                    /> : <div className="border-r border-white text-9xl text-center">
                                        {item.image}
                                    </div>}
                                    <div
                                        className="flex flex-col relative px-2 py-3"
                                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                                        <div
                                            className="text-center mt-2 text-3xl p-1 rounded-md "
                                            style={{
                                                color: colorPalette[
                                                    roomColor as keyof typeof colorPalette
                                                ].light,
                                            }}>
                                            {item.title}
                                        </div>
                                        <div
                                            className="text-right mt-2 mx-3 text-2xl font-semibold p-1 rounded-md"
                                            style={{
                                                color: colorPalette[
                                                    roomColor as keyof typeof colorPalette
                                                ].light,
                                            }}>
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                                <div className="z-10 absolute left-1/3 lg:left-1/2 translate-x-1/2 bottom-14 lg:bottom-1/3 flex flex-col gap-2 text-center font-extrabold text-xl whitespace-nowrap text-black">
                                    <div
                                        className={`-ml-10 p-auto rounded-full ${openStatus === -1 ? "bg-emerald-300" : "bg-amber-300"} w-6 h-6 text-center cursor-pointer relative`}
                                        onClick={() => {
                                            setOpenStatus((prev) =>
                                                prev === -1 ? quizDataPageNumber : -1
                                            );
                                        }}
                                        onMouseLeave={() => setOpenStatus(-1)}
                                        title={get_text("more_info", userLanguage) + "..."}>
                                        !
                                        {openStatus !== -1 && (
                                            <div
                                                className="absolute left-6 bottom-6 flex flex-col bg-white bg-opacity-80 p-2 rounded-lg border-2 border-amber-400 text-right"
                                                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                                                <span className="text-sm">
                                                    {get_text("more_info", userLanguage) + ": "}
                                                </span>
                                                {Object.keys(
                                                    data?.quiz[quizDataPageNumber].status
                                                ).map((k, i) => {
                                                    return (
                                                        <span
                                                            key={i}
                                                            className="text-sm whitespace-nowrap wrap-break-word">
                                                            {k +
                                                                ": " +
                                                                Object.values(
                                                                    data?.quiz[quizDataPageNumber]
                                                                        .status
                                                                )[i]}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-row gap-6">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="mb-1 border-b-2"
                                                style={{
                                                    borderColor:
                                                        colorPalette[
                                                            roomColor as keyof typeof colorPalette
                                                        ].light,
                                                    color: colorPalette[
                                                        roomColor as keyof typeof colorPalette
                                                    ].light,
                                                }}>
                                                {answerKeys[0]}
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setChoseOpen((prev) => (prev === 2 ? 0 : 2));
                                                }}
                                                className={`relative w-16 h-16 flex flex-col content-center rounded-full items-center justify-center text-white 
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
                                                {colorOrder[i][0] !== "" ? colorOrder[i][0] : "?"}
                                                {choseOpen === 2 && (
                                                    <>
                                                        <div
                                                            onClick={() =>
                                                                answerData &&
                                                                colorChange(answerData[0][0])
                                                            }
                                                            className={`absolute top-0 -left-4 w-fit py-1 px-2 min-w-10 h-10 z-20 cursor-pointer whitespace-nowrap bg-amber-500 rounded-full flex items-center justify-center text-white border border-black`}>
                                                            {answerData && answerData[0][0]}
                                                        </div>
                                                        <div
                                                            onClick={() =>
                                                                answerData &&
                                                                colorChange(answerData[0][1])
                                                            }
                                                            className={`absolute -top-12 -left-4 w-fit py-1 px-2 min-w-10 h-10 z-20 cursor-pointer whitespace-nowrap bg-purple-500 rounded-full flex items-center justify-center text-white border border-black`}>
                                                            {answerData && answerData[0][1]}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="mb-1 border-b-2"
                                                style={{
                                                    color: colorPalette[
                                                        roomColor as keyof typeof colorPalette
                                                    ].light,
                                                    borderColor:
                                                        colorPalette[
                                                            roomColor as keyof typeof colorPalette
                                                        ].light,
                                                }}>
                                                {answerKeys[1]}
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setChoseOpen((prev) => (prev === 3 ? 0 : 3));
                                                }}
                                                className={`relative w-20 h-12 flex flex-col content-center rounded-xl my-auto py-auto items-center justify-center text-white cursor-pointer
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
                                                {colorOrder[i][1] !== "" ? colorOrder[i][1] : "?"}
                                                {choseOpen === 3 && (
                                                    <>
                                                        <div
                                                            onClick={() =>
                                                                answerData &&
                                                                colorChange(answerData[1][0])
                                                            }
                                                            className={`absolute top-0 -left-4 w-fit px-2 min-w-10 h-10 cursor-pointer whitespace-nowrap bg-emerald-500 rounded-lg flex items-center justify-center text-white border border-black z-20`}>
                                                            {answerData && answerData[1][0]}
                                                        </div>
                                                        <div
                                                            onClick={() =>
                                                                answerData &&
                                                                colorChange(answerData[1][1])
                                                            }
                                                            className={`absolute -top-12 -left-4 w-fit px-2 min-w-10 h-10 cursor-pointer whitespace-nowrap bg-pink-500 rounded-lg flex items-center justify-center text-white border border-black z-20`}>
                                                            {answerData && answerData[1][1]}
                                                        </div>
                                                        <div
                                                            onClick={() =>
                                                                answerData &&
                                                                colorChange(answerData[1][2])
                                                            }
                                                            className={`absolute -top-24 -left-4 w-fit px-2 min-w-10 h-10 cursor-pointer whitespace-nowrap bg-cyan-500 rounded-lg flex items-center justify-center text-white border border-black z-20`}>
                                                            {answerData && answerData[1][2]}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div></>) : (<>
                <div className="flex">
                {data &&
                    data.quiz.map((item, i) => {
                        return (
                            <div
                                className={
                                    "relative h-96 pb-12 pt-32"
                                }
                                key={i}>
                                <div
                                    className={`flex-col flex border`}
                                    style={{
                                        borderColor:
                                            colorPalette[roomColor as keyof typeof colorPalette]
                                                .light,
                                        pointerEvents: "none",
                                    }}>

                                    <img
                                        src={item.image}
                                        alt={`Quiz image ${i + 1}`}
                                        className="border-r border-white"
                                    />
                                </div>
                                <div
                                        className="absolute top-32 left-2 translate-x-1/2 text-center mt-2 text-xl p-1 rounded-md "
                                        style={{
                                            color: colorPalette[
                                                roomColor as keyof typeof colorPalette
                                            ].light,
                                        }}>
                                        {item.title}
                                    </div>                                <div className="z-10 absolute left-2 bottom-0 flex flex-col gap-2 text-center font-extrabold text-xl whitespace-nowrap text-black">
                                    <div className="flex flex-row gap-6">
                                        
                                            <div
                                                className={`relative w-16 h-16 flex flex-col content-center rounded-full items-center justify-center text-white 
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
                                                {colorOrder[i][0] !== "" ? colorOrder[i][0] : "?"}
                                                
                                            </div>
                                            <div
                                                className={`relative w-20 h-12 flex flex-col content-center rounded-xl my-auto py-auto items-center justify-center text-white cursor-pointer
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
                                                {colorOrder[i][1] !== "" ? colorOrder[i][1] : "?"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            
            <div className="flex mx-auto w-1/2 mt-28 h-14 gap-2 justify-between">
                {counter.map((item, index) => (
                    <div className={`flex flex-col items-center justify-center w-1/6 h-14 rounded-lg text-white text-2xl ${index === 0 ? "bg-amber-500" : index === 1 ? "bg-purple-500" : index === 2 ? "bg-emerald-500" : index === 3 ? "bg-pink-500" : "bg-cyan-500"}`}>
                    <button onClick={() => updateCounter(index, "+")} className="cursor-pointer">< SquareChevronUp color="white"/></button>
                    {item}
                    <button onClick={() => updateCounter(index, "-")} className="cursor-pointer">< SquareChevronDown color="white"/></button>
                </div>
                ))}
            </div>
            
            </>)}
            {canCount && (
                <button 
                    className="absolute bottom-26 left-1/2 -translate-x-1/2 z-20 px-3 h-10 rounded-lg text-white text-2xl bg-gray-500"
                    onClick={() => {
                        setShowColors(prev => !prev);
                    }}>
                    {showColors ? get_text("hide_colors", userLanguage) : get_text("show_colors", userLanguage)}
                </button>
                
            )}
            <AnswerButton
                result={result || ""}
                onClick={() => !finish ? (
                    checkOrderAnswer()
                ) : (
                    setOpenLock(true)
                )}
                active={counter}
            />
        </div>
    );
};

