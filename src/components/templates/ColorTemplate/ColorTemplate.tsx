import { useState } from "react";
import backArrow from "../../../assets/images/backArrow.svg";
import HintChat from "../../HintChat";
import Dialog from "../../Dialog";
import { quizDataProps } from "../../../pages/Room/Room";
import QuizSuccess from "../../QuizSuccess";
import QuizData from "../../QuizData";
import { get_text } from "../../../util/language";
import Button from "../../Button";
import Puzzle6 from "../../Puzzle6";

export const ColorTemplate = (props: quizDataProps) => {
    const { data, index, back } = props;
    const [result, setResult] = useState("");
    const [open, setOpen] = useState(false);
    const [openLock, setOpenLock] = useState(false);

    return (
        <div className="flex flex-col relative h-full min-h-96">
            <div className="relative">
                <img
                    src={backArrow}
                    alt={get_text("back_to_main", "he")}
                    title={get_text("back_to_main", "he")}
                    className="cursor-pointer h-8 w-8 z-20 md:h-12 md:w-12 absolute left-2 md:-left-12 top-2 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-700"
                    onClick={back}
                />
                {result !== get_text("success", "he") ? (
                    <>
                        <QuizData data={data.quiz[index]} result={result} setResult={setResult} />
                        <Dialog
                            open={open}
                            setOpen={setOpen}
                            size="large"
                            disableOverlayClose={false}
                            data="">
                            <div className="max-h-96 overflow-scroll">
                                <img
                                    src={data.quiz[index] && data.quiz[index].quizImg}
                                    alt="mainQuizImage"
                                    className=""
                                />
                            </div>
                        </Dialog>
                        <Button onClick={() => setOpen(true)} label={get_text("more_info", "he")} />
                    </>
                ) : (
                    <Puzzle6 data={data.quiz[index]} />
                )}
            </div>
            {result === get_text("success", "he") && (
                <Button
                    label={get_text("finish", "he")}
                    onClick={() => setOpenLock(true)}
                    className="flex w-auto mr-auto ml-10"
                />
            )}
            <HintChat hints={data.quiz[index].hints} />
            <Dialog
                open={openLock}
                setOpen={setOpenLock}
                size="small"
                disableOverlayClose={true}
                data="quizSuccess">
                <QuizSuccess
                    data={data.quiz[index].answer}
                    setOpenLock={() => setOpenLock(false)}
                />
            </Dialog>
        </div>
    );
};
