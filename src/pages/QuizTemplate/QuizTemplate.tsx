import { JSX, useEffect, useState } from "react";
import DigitalNumbers from "../../components/templates/DigitalNumbers";
import Grid from "../../components/templates/Grid";
import Color from "../../components/templates/Color";
import TurnRound from "../../components/templates/DigitalNumbers";
import OrderBorder from "../../components/templates/DigitalNumbers";
import Dialog from "../../components/Dialog";
import HintChat from "../../components/HintChat";
import { quizDataP } from "../Room/Room";
import QuizSuccess from "../../components/QuizSuccess";
import { get_text } from "../../util/language";
import { quizData } from "../Room/Room";

import { colorPalette } from "../../util/UIstyle";
import { useRoomContext } from "../../contexts/roomStyleContext";
export interface TemplateProps {
    data: quizData;
    result: string;
    setResult: (newResult: string) => void;
    setOpenLock: (open: boolean) => void;
}

export const QuizTemplate = (props: quizDataP) => {
    const { data } = props;
    const [result, setResult] = useState("");
    // const [open, setOpen] = useState(false);
    const [openLock, setOpenLock] = useState(false);
    const [showText, setShowText] = useState(true);
    const { roomColor } = useRoomContext();
    useEffect(() => {
        if (result === get_text("success", "he")) {
            setOpenLock(true);
        }
    }, [result]);
    useEffect(() => {
        setTimeout(() => {
            setShowText(false);
        }, 5000);
    }, []);
    const types: Record<string, JSX.Element> = {
        "7segments": (
            <DigitalNumbers
                data={data}
                result={result}
                setResult={setResult}
                setOpenLock={setOpenLock}
            />
        ),
        gridPlay: (
            <Grid data={data} result={result} setResult={setResult} setOpenLock={setOpenLock} />
        ),
        colorChange: (
            <Color data={data} result={result} setResult={setResult} setOpenLock={setOpenLock} />
        ),
        turnRound: (
            <TurnRound
                data={data}
                result={result}
                setResult={setResult}
                setOpenLock={setOpenLock}
            />
        ),
        borderOrder: (
            <OrderBorder
                data={data}
                result={result}
                setResult={setResult}
                setOpenLock={setOpenLock}
            />
        ),
    };
    return (
        <div className="flex flex-col relative h-full min-h-96">
            {types[data.type]}
            {showText ? (
                <div
                    className="fixed bottom-3 -left-1/2 translate-x-1/2 max-w-screen h-10 rounded-4xl m-2 text-center"
                    style={{
                        backgroundColor: colorPalette[roomColor as keyof typeof colorPalette].light,
                        color: colorPalette[roomColor as keyof typeof colorPalette].dark,
                        borderColor: colorPalette[roomColor as keyof typeof colorPalette].dark,
                    }}>
                    {data.quizText}
                </div>
            ) : (
                <div className="fixed right-3 bottom-3">
                    <HintChat hints={data.hints} />
                </div>
            )}
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
