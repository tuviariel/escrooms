import { useState } from "react";
import Grid from "./Grid";
import Dialog from "../../Dialog";
import HintChat from "../../HintChat";
import { quizDataP } from "../../../pages/Room/Room";
import QuizSuccess from "../../QuizSuccess";

export const GridTemplate = (props: quizDataP) => {
    const { data } = props;
    const [result, setResult] = useState("");
    const [open, setOpen] = useState(false);
    const [openLock, setOpenLock] = useState(false);

    return (
        <div className="flex flex-col relative h-full min-h-96">
            <img src={data.quizImg} alt="riddle - error..." className="h-20" />
            <div className="" onClick={() => setOpen(true)}>
                grid
            </div>
            <div className="fixed right-3 bottom-3">
                <HintChat hints={data.hints} />
            </div>
            <Dialog open={open} setOpen={setOpen} size="large" disableOverlayClose={false} data="">
                <Grid data={data} result={result} setResult={setResult} />
            </Dialog>
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
