import { useState } from "react";
import { get_text } from "../../util/language";
import pagePaginateArrow from "../../assets/images/pagePaginate.svg";
import pagePaginateArrowDisabled from "../../assets/images/pagePaginateDis.svg";
interface QuizDataProps {
    data: string[] | any[];
}
export const QuizData = (props: QuizDataProps) => {
    const { data } = props;
    const [quizDataPageNumber, setQuizDataPageNumber] = useState(0);
    const pagination = (clicked: string) => {
        console.log(clicked);
        if (clicked === "next") {
            quizDataPageNumber < data.length - 1 && setQuizDataPageNumber((prev) => prev + 1);
        } else {
            //clicked==="prev"
            quizDataPageNumber !== 0 && setQuizDataPageNumber((prev) => prev - 1);
        }
    };
    return (
        <>
            {data.length > 1 ? (
                <div className="relative">
                    <img
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
                            quizDataPageNumber < data.length - 1
                                ? pagePaginateArrow
                                : pagePaginateArrowDisabled
                        }
                        alt={
                            quizDataPageNumber < data.length - 1
                                ? get_text("next_page", "he")
                                : get_text("no_next_page", "he")
                        }
                        title={
                            quizDataPageNumber < data.length - 1
                                ? get_text("next_page", "he")
                                : get_text("no_next_page", "he")
                        }
                        className={`${
                            quizDataPageNumber < data.length - 1
                                ? "cursor-pointer"
                                : "cursor-not-allowed"
                        } h-12 w-12 absolute right-24 top-2 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-500 rotate-180`}
                        onClick={() => pagination("next")}
                    />
                    <img
                        src={data[quizDataPageNumber]}
                        alt="riddle - error..."
                        className="h-screen w-full"
                    />
                </div>
            ) : (
                <img src={data[1]} alt="riddle - error..." className="h-screen w-full" />
            )}
        </>
    );
};
