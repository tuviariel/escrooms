import { useState } from "react";
import HintChat from "../../HintChat";
import Dialog from "../../Dialog";
import { quizDataP } from "../../../pages/Room/Room";
import QuizSuccess from "../../QuizSuccess";
import QuizData from "../../QuizData";
import { get_text } from "../../../util/language";
import Button from "../../Button";
import Puzzle6 from "../../Puzzle6";

export const ColorTemplate = (props: quizDataP) => {
    const { data } = props;
    const [result, setResult] = useState("");
    const [open, setOpen] = useState(false);
    const [openLock, setOpenLock] = useState(false);

    return (
        <div className="flex flex-col relative min-h-96">
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
            {result === get_text("success", "he") && (
                <Button
                    label={get_text("finish", "he")}
                    onClick={() => setOpenLock(true)}
                    className="flex w-auto mr-auto ml-10"
                />
            )}
            <HintChat hints={data.hints} />
            <Dialog
                open={openLock}
                setOpen={setOpenLock}
                size="small"
                disableOverlayClose={true}
                data="quizSuccess">
                <QuizSuccess data={data.answer} setOpenLock={() => setOpenLock(false)} />
            </Dialog>
        </div>
    );
};
