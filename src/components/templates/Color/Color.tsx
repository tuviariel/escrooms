// import { useState } from "react";
// import { quizDataP } from "../../../pages/Room/Room";
import QuizData from "../../QuizData";
import { get_text } from "../../../util/language";
import Puzzle6 from "../../Puzzle6";
import { TemplateProps } from "../../../pages/QuizTemplate/QuizTemplate";
import { useEffect } from "react";
export const Color = (props: TemplateProps) => {
    const { data, result, setResult, setOpenLock } = props;
    // const [result, setResult] = useState("");
    // const [open, setOpen] = useState(false);
    // const [openLock, setOpenLock] = useState(false);
    useEffect(() => {
        if (result === get_text("success", "he")) {
            setOpenLock(true);
        }
    }, [result]);
    return (
        <div className="">
            {result !== get_text("success", "he") ? (
                <>
                    <QuizData data={data} result={result} setResult={setResult} />
                    <div dir="rtl" className="text-center text-2xl font-bold my-2">
                        {data?.quizText}
                    </div>
                    {/* <div className="max-h-96 overflow-y-scroll">
                            <img src={data?.quizImg} alt="mainQuizImage" className="" />
                        </div> */}
                </>
            ) : (
                <Puzzle6 data={data} />
            )}
        </div>
    );
};
