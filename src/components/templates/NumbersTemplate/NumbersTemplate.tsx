import { useEffect, useState } from "react";
import DigitalNumbers from "./DigitalNumbers";
import Dialog from "../../Dialog";
import HintChat from "../../HintChat";
import { quizDataProps } from "../../../pages/Room/Room";
import clock from "../../../assets/images/Clock.png";
import backArrow from "../../../assets/images/backArrow.svg";
import QuizSuccess from "../../QuizSuccess";
import { get_text } from "../../../util/language";
import QuizData from "../../QuizData";

export const NumbersTemplate = (props: quizDataProps) => {
    const { data, index, back } = props;
    const [result, setResult] = useState("");
    const [open, setOpen] = useState(false);
    const [openLock, setOpenLock] = useState(false);
    useEffect(() => {
        if (result === get_text("success", "he")) {
            setOpenLock(true);
        }
    }, [result]);

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
                <QuizData data={data.quiz[index]} />
                <img
                    src={clock}
                    alt={get_text("answer_quiz", "he")}
                    title={get_text("answer_quiz", "he")}
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
