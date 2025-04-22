import { useState } from "react";
import DigitalNumbers from "../DigitalNumbers";
import Dialog from "../Dialog";
import HintChat from "../HintChat";
export const NumbersTemplate = () => {
    const data = {
        answer: 1234,
        riddleImg: "imageURL",
        correctOptions: ["correct1", "correct2", "correct3", "correct4"],
        inCorrectOptions: ["incorrect1", "incorrect2", "incorrect3", "incorrect4"],
        hints: ["firstHint", "secondHint", "thirdHint", "forthHint", "fifthHint"],
    };
    const [result, setResult] = useState("");
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col relative h-full min-h-96">
            <img src={data.riddleImg} alt="riddle - error..." className="h-full" />
            <div className="" onClick={() => setOpen(true)}>
                digital clock
            </div>
            <div className="absolute right-3 bottom-3">
                <HintChat hints={data.hints} />
            </div>
            <Dialog open={open} setOpen={setOpen} size="large" disableOverlayClose={false} data="">
                <DigitalNumbers data={data} result={result} setResult={setResult} />
            </Dialog>
        </div>
    );
};
