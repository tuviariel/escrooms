import { useEffect, useRef, useState } from "react";
import { get_text } from "../../util/language";
// import pagePaginateArrow from "../../assets/images/pagePaginate.svg";
// import pagePaginateArrowDisabled from "../../assets/images/pagePaginateDis.svg";
import { quizData } from "../../pages/Room/Room";
import Button from "../Button";

interface QuizDataProps {
    data: quizData;
    result: string;
    setResult: (newResult: string) => void;
}
export const QuizData: React.FC<Partial<QuizDataProps>> = (props) => {
    const { data, result, setResult } = props;
    const [quizDataPageNumber, setQuizDataPageNumber] = useState(0);

    const [colorOrder, setColorOrder] = useState(new Array(data?.quizData.length).fill(-1));
    const imgContainerRef = useRef<HTMLDivElement>(null);
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
    const colorChange = (i: number) => {
        setQuizDataPageNumber(i);
        result && setResult && setResult("");
        const updatedColorOrder = [...colorOrder];
        updatedColorOrder[i] =
            data?.category && data?.category?.length - 1 > updatedColorOrder[i]
                ? updatedColorOrder[i] + 1
                : 0;
        setColorOrder(updatedColorOrder);
    };

    const checkOrderAnswer = () => {
        let count = 0,
            i;
        for (i = 0; i <= colorOrder.length - 1; i++) {
            if (data?.orderAnswer && data.orderAnswer[i] === colorOrder[i]) {
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
    // console.log(data);
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
                                            data.type === "colorChange" && colorChange(i)
                                        }
                                    />
                                    {data.type === "colorChange" && colorOrder[i] !== -1 && (
                                        <img
                                            src={data.category && data.category[colorOrder[i]]}
                                            alt={`option #` + (colorOrder[i] + 1)}
                                            className="absolute right-44 bottom-0 w-80 h-40 cursor-pointer"
                                            onClick={() => colorChange(i)}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
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
