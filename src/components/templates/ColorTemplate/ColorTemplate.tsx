import { useEffect, useState } from "react";
import useSound from "use-sound";
import HintChat from "../../HintChat";
import Dialog from "../../Dialog";
import { quizDataProps } from "../../../pages/Room/Room";
import ColorChoose from "./ColorChoose";
import QuizSuccess from "../../QuizSuccess";

export const ColorTemplate = (props: quizDataProps) => {
    const { data, index } = props;
    const [result, setResult] = useState("");
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (result === "Great!") {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [result]);

    return (
        <div className="flex flex-col relative h-full min-h-96">
            <img src={data.quiz[index].quizImg} alt="riddle - error..." className="h-20" />
            <div className="" onClick={() => {}}>
                color
                <ColorChoose data={data.quiz[index]} result={result} setResult={setResult} />
            </div>
            <div className="fixed right-3 bottom-3">
                <HintChat hints={data.quiz[index].hints} />
            </div>
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
