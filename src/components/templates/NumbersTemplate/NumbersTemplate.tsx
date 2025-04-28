import { useState } from "react";
import DigitalNumbers from "./DigitalNumbers";
import Dialog from "../../Dialog";
import HintChat from "../../HintChat";
import { quizDataProps } from "../../../pages/Room/Room";

export const NumbersTemplate = (props: quizDataProps) => {
    const { data, index } = props;
    const [result, setResult] = useState("");
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col relative h-full min-h-96">
            <img src={data.quiz[index].quizImg} alt="riddle - error..." className="h-20" />
            <div className="" onClick={() => setOpen(true)}>
                digital clock
            </div>
            <div className="fixed right-3 bottom-3">
                <HintChat hints={data.quiz[index].hints} />
            </div>
            <Dialog open={open} setOpen={setOpen} size="large" disableOverlayClose={false} data="">
                <DigitalNumbers data={data.quiz[index]} result={result} setResult={setResult} />
            </Dialog>
        </div>
    );
};
