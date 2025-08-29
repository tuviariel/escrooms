import { useEffect, useState } from "react";
import DigitalNumbers from "./DigitalNumbers";
import Dialog from "../../Dialog";
import HintChat from "../../HintChat";
import { quizDataP } from "../../../pages/Room/Room";
import clock from "../../../assets/images/Clock.png";
import QuizSuccess from "../../QuizSuccess";
import { get_text } from "../../../util/language";
import QuizData from "../../QuizData";
import Button from "../../Button";
import { imageStyle } from "../../../util/UIstyle";

export const NumbersTemplate = (props: quizDataP) => {
    const { data } = props;
    const [result, setResult] = useState("");
    // const [open, setOpen] = useState(false);
    const [openLock, setOpenLock] = useState(false);
    useEffect(() => {
        if (result === get_text("success", "he")) {
            setOpenLock(true);
        }
    }, [result]);

    return (
        <div className="flex flex-col relative h-full min-h-96">
            {/* <div className={`relative`}>
                <QuizData data={data} />
                <img
                    src={clock}
                    alt={get_text("answer_quiz", "he")}
                    title={get_text("answer_quiz", "he")}
                    className="cursor-pointer h-12 w-24 hover:h-14 hover:w-28 absolute right-16 top-14 p-2 rounded-lg bg-gray-100 border border-amber-300"
                    onClick={() => setOpen(true)}
                />
            </div> */}
            <DigitalNumbers
                data={data}
                result={result}
                setResult={setResult}
                setOpenLock={setOpenLock}
            />
            <div className="fixed right-3 bottom-3">
                <HintChat hints={data.hints} />
            </div>
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
