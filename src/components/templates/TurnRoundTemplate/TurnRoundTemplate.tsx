import { useState } from "react";
import HintChat from "../../HintChat";
import Dialog from "../../Dialog";
import { quizDataP } from "../../../pages/Room/Room";
import TurnRound from "./TurnRound";
export const TurnRoundTemplate = (props: quizDataP) => {
    const { data } = props;
    const [result, setResult] = useState("");
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col relative h-full min-h-96">
            <img src={data.quizImg} alt="riddle - error..." className="h-20" />
            <div className="" onClick={() => setOpen(true)}>
                Turn Round...
            </div>
            <div className="fixed right-3 bottom-3">
                <HintChat hints={data.hints} />
            </div>
            <Dialog open={open} setOpen={setOpen} size="large" disableOverlayClose={false} data="">
                <TurnRound data={data} result={result} setResult={setResult} />
            </Dialog>
        </div>
    );
};
