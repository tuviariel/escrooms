import { useState } from "react";
import DigitalNumbers from "./DigitalNumbers";
import Dialog from "../../Dialog";
import HintChat from "../../HintChat";
import { quizDataProps } from "../../../pages/Room/Room";
import clock from "../../../assets/images/Clock.png";
import backArrow from "../../../assets/images/backArrow.svg";
import pagePaginateArrow from "../../../assets/images/pagePaginate.svg";
import pagePaginateArrowDisabled from "../../../assets/images/pagePaginateDis.svg";
import QuizSuccess from "../../QuizSuccess";

export const NumbersTemplate = (props: quizDataProps) => {
    const { data, index, back } = props;
    const [result, setResult] = useState("");
    const [open, setOpen] = useState(false);
    const [quizDataPageNumber, setQuizDataPageNumber] = useState(0);

    const pagination = (clicked: string) => {
        console.log(clicked);
        if (clicked === "next") {
            quizDataPageNumber < data.quiz[index].quizData.length - 1 &&
                setQuizDataPageNumber((prev) => prev + 1);
        } else {
            //clicked==="prev"
            quizDataPageNumber !== 0 && setQuizDataPageNumber((prev) => prev - 1);
        }
    };

    return (
        <div className="flex flex-col relative h-full min-h-96">
            <div className="relative">
                <img
                    src={backArrow}
                    alt="Back to Main"
                    title="חזור אחורה"
                    className="cursor-pointer h-12 w-12 absolute -left-12 top-2 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-700"
                    onClick={back}
                />
                {data.quiz[index].quizData.length > 1 ? (
                    <div className="relative">
                        <img
                            src={
                                quizDataPageNumber !== 0
                                    ? pagePaginateArrow
                                    : pagePaginateArrowDisabled
                            }
                            alt={quizDataPageNumber !== 0 ? "Back" : "Disabled"}
                            title={quizDataPageNumber !== 0 ? "לעמוד הקודם" : "אין עמוד קודם"}
                            className={`${
                                quizDataPageNumber !== 0 ? "cursor-pointer" : "cursor-not-allowed"
                            } h-12 w-12 absolute left-24 top-2 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-500`}
                            onClick={() => pagination("prev")}
                        />
                        <img
                            src={
                                quizDataPageNumber < data.quiz[index].quizData.length - 1
                                    ? pagePaginateArrow
                                    : pagePaginateArrowDisabled
                            }
                            alt={
                                quizDataPageNumber < data.quiz[index].quizData.length - 1
                                    ? "Next"
                                    : "Disabled"
                            }
                            title={
                                quizDataPageNumber < data.quiz[index].quizData.length - 1
                                    ? "לעמוד הבא"
                                    : "אין עמוד הבא"
                            }
                            className={`${
                                quizDataPageNumber < data.quiz[index].quizData.length - 1
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed"
                            } h-12 w-12 absolute right-24 top-2 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-500 rotate-180`}
                            onClick={() => pagination("next")}
                        />
                        <img
                            src={data.quiz[index].quizData[quizDataPageNumber]}
                            alt="riddle - error..."
                            className="h-screen w-full"
                        />
                    </div>
                ) : (
                    <img
                        src={data.quiz[index].quizData[1]}
                        alt="riddle - error..."
                        className="h-screen w-full"
                    />
                )}
                <img
                    src={clock}
                    alt="Answer Quiz"
                    className="cursor-pointer h-12 w-24 hover:h-14 hover:w-28 absolute right-16 top-14 p-2 rounded-lg bg-gray-100 border border-amber-300"
                    onClick={() => setOpen(true)}
                />
            </div>
            <div className="fixed right-3 bottom-3">
                <HintChat hints={data.quiz[index].hints} />
            </div>
            <Dialog open={open} setOpen={setOpen} size="large" disableOverlayClose={false} data="">
                <DigitalNumbers data={data.quiz[index]} result={result} setResult={setResult} />
            </Dialog>
            <Dialog
                open={open}
                setOpen={setOpen}
                size="small"
                disableOverlayClose={true}
                data="quizSuccess">
                <QuizSuccess />
            </Dialog>
        </div>
    );
};
