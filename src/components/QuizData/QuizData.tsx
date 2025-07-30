import { useEffect, useRef, useState } from "react";
import { get_text } from "../../util/language";
// import pagePaginateArrow from "../../assets/images/pagePaginate.svg";
// import pagePaginateArrowDisabled from "../../assets/images/pagePaginateDis.svg";
import { quizData } from "../../pages/Room/Room";

import Button from "../Button";
import Dialog from "../Dialog";

interface QuizDataProps {
    data: quizData;
    result: string;
    setResult: (newResult: string) => void;
}
export const QuizData: React.FC<Partial<QuizDataProps>> = (props) => {
    const { data, result, setResult } = props;
    const [quizDataPageNumber, setQuizDataPageNumber] = useState(-1);
    const [colorOrder, setColorOrder] = useState(
        data?.type === "colorChange" ? new Array(data?.quizData.length).fill([-1, -1]) : []
    );
    const [openDialog, setOpenDialog] = useState(false);
    const [stage, setStage] = useState(1); // 1: pick from 2, 2: pick from 3
    const imgContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (
            data?.type === "colorChange" &&
            data?._id.toString() &&
            localStorage.getItem(data?._id.toString())
        ) {
            setColorOrder(JSON.parse(localStorage.getItem(data?._id.toString()) || "[]"));
        }
        // return () => {
        //     if (result === get_text("success", "he")) {
        //         data?._id.toString() && localStorage.removeItem(data?._id.toString());
        //     } else {
        //         data?._id.toString() &&
        //             localStorage.setItem(data?._id.toString(), JSON.stringify(colorOrder));
        //     }
        // };
    }, []);
    useEffect(() => {
        quizDataPageNumber !== -1 ? setOpenDialog(true) : setOpenDialog(false);
    }, [quizDataPageNumber]);
    useEffect(() => {
        if (openDialog === false) {
            setQuizDataPageNumber(-1);
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
    const colorChange = (choose: number) => {
        console.log(choose, quizDataPageNumber, stage);
        const updatedColorOrder = [...colorOrder];
        updatedColorOrder[quizDataPageNumber] = [...colorOrder[quizDataPageNumber]];
        if (stage === 1) {
            updatedColorOrder[quizDataPageNumber][0] = data?.category && data?.category[0][choose];
            setStage(2);
        } else if (stage === 2) {
            updatedColorOrder[quizDataPageNumber][1] = data?.category && data?.category[1][choose];
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
            console.log("correct", i, colorOrder[i]);
            if (
                data?.orderAnswer &&
                data.orderAnswer[i][0] === colorOrder[i][0] &&
                data.orderAnswer[i][1] === colorOrder[i][1]
            ) {
                console.log("correct");
                count++;
            }
        }
        setResult &&
            setResult(
                count === i
                    ? get_text("success", "he")
                    : count === 0
                    ? get_text("wrong", "he") + ": (" + count + "/" + i + ")"
                    : get_text("continue", "he") + ": (" + count + "/" + i + ")"
            );
    };
    console.log(colorOrder);
    return (
        <>
            {data && data.quizData.length > 1 ? (
                <div className="relative">
                    {/* <img
                        src={
                            quizDataPageNumber !== 0 ? pagePaginateArrow : pagePaginateArrowDisabled
                        }
                        alt={
                            quizDataPageNumber !== 0
                                ? get_text("prev_page", "he")
                                : get_text("no_prev_page", "he")
                        }
                        title={
                            quizDataPageNumber !== 0
                                ? get_text("prev_page", "he")
                                : get_text("no_prev_page", "he")
                        }
                        className={`${
                            quizDataPageNumber !== 0 ? "cursor-pointer" : "cursor-not-allowed"
                        } h-12 w-12 absolute left-24 top-2 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-500`}
                        onClick={() => pagination("prev")}
                    />
                    <img
                        src={
                            quizDataPageNumber < data.quizData.length - 1
                                ? pagePaginateArrow
                                : pagePaginateArrowDisabled
                        }
                        alt={
                            quizDataPageNumber < data.quizData.length - 1
                                ? get_text("next_page", "he")
                                : get_text("no_next_page", "he")
                        }
                        title={
                            quizDataPageNumber < data.quizData.length - 1
                                ? get_text("next_page", "he")
                                : get_text("no_next_page", "he")
                        }
                        className={`${
                            quizDataPageNumber < data.quizData.length - 1
                                ? "cursor-pointer"
                                : "cursor-not-allowed"
                        } h-12 w-12 absolute right-24 top-2 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-500 rotate-180`}
                        onClick={() => pagination("next")}
                    /> */}
                    <div className="flex flex-row flex-nowrap overflow-x-auto">
                        {data.quizData.map((img, i) => {
                            return (
                                <div
                                    className={
                                        data.type === "colorChange"
                                            ? "relative h-96 flex-shrink-0"
                                            : "h-screen flex-shrink-0"
                                    }
                                    ref={quizDataPageNumber === i ? imgContainerRef : null}
                                    key={i}>
                                    <img
                                        src={img}
                                        alt={"quizData #" + (i + 1)}
                                        className={`${
                                            data.type === "colorChange"
                                                ? "cursor-pointer h-full w-auto"
                                                : "h-full w-auto"
                                        } pt-10 mx-20`}
                                        onClick={() =>
                                            data.type === "colorChange" && setQuizDataPageNumber(i)
                                        }
                                    />
                                    {data.type === "colorChange" && colorOrder[i][0] !== -1 && (
                                        <>
                                            <img
                                                src={
                                                    data?.category &&
                                                    data?.category[0][0] === colorOrder[i][0]
                                                        ? data?.category[0][0]
                                                        : data?.category && data?.category[0][1]
                                                }
                                                alt="color change"
                                                className="absolute right-20 bottom-18 w-16 h-16"
                                            />
                                            <img
                                                src={
                                                    data.category &&
                                                    data.category[1][0] === colorOrder[i][1]
                                                        ? data.category[1][0]
                                                        : data.category &&
                                                          data.category[1][1] === colorOrder[i][1]
                                                        ? data.category[1][1]
                                                        : data.category && data.category[1][2]
                                                }
                                                alt={`option #` + (colorOrder[i][1] + 1)}
                                                className="absolute right-44 bottom-20 w-20 h-10"
                                            />
                                        </>
                                    )}
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
                        <div className="relative">
                            <img
                                src={data.quizData[quizDataPageNumber]}
                                alt={`Quiz Data Page ${quizDataPageNumber + 1}`}
                                className="h-full w-full object-cover"
                            />
                            {data.type === "colorChange" && stage === 2 && (
                                <img
                                    src={
                                        data?.category &&
                                        data?.category[0][0] === colorOrder[quizDataPageNumber][0]
                                            ? data?.category[0][0]
                                            : data?.category && data?.category[0][1]
                                    }
                                    alt="color change"
                                    className="absolute right-20 bottom-18 w-16 h-16"
                                />
                            )}
                            <div className="flex items-center justify-center">
                                <Button onClick={() => colorChange(0)} className="mx-2">
                                    <img
                                        src={data.category && data.category[stage === 1 ? 0 : 1][0]}
                                        alt={`option #1`}
                                        className="w-10 h-10 cursor-pointer"
                                    />
                                </Button>
                                <Button onClick={() => colorChange(1)} className="mx-2">
                                    <img
                                        src={data.category && data.category[stage === 1 ? 0 : 1][1]}
                                        alt={`option #2`}
                                        className="w-10 h-10 cursor-pointer"
                                    />
                                </Button>
                                {stage === 2 && (
                                    <Button onClick={() => colorChange(2)} className="mx-2">
                                        <img
                                            src={data.category && data.category[1][2]}
                                            alt={`option #3`}
                                            className="w-10 h-10 cursor-pointer"
                                        />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Dialog>
                    {data.type === "colorChange" && (
                        <div className="absolute left-0 -bottom-20 flex">
                            <Button
                                onClick={checkOrderAnswer}
                                label={get_text("check_answer", "he")}
                                className=""
                            />
                            <div className="">{result}</div>
                        </div>
                    )}
                </div>
            ) : (
                <img src={data?.quizData[0]} alt="riddle - error..." className="h-screen w-full" />
            )}
        </>
    );
};
