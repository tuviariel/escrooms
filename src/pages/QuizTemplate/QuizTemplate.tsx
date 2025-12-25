import { JSX, useEffect, useState } from "react";
import DigitalNumbers from "../../components/templates/DigitalNumbers";
import Grid from "../../components/templates/Grid";
import Color from "../../components/templates/Color";
import TurnRound from "../../components/templates/TurnRound";
import OrderBorder from "../../components/templates/OrderBorder";
import Dialog from "../../components/Dialog";
import HintChat from "../../components/HintChat";
import TimerLine from "../../components/TimerLine";
import { quizDataP } from "../Room/Room";
import QuizSuccess from "../../components/QuizSuccess";
import { get_text } from "../../util/language";
import { quizData } from "../Room/Room";

import { colorPalette } from "../../util/UIstyle";
import { useRoomContext } from "../../contexts/roomStyleContext";
import { useUserContext } from "../../contexts/userStyleContext";

export interface TemplateProps {
    data: quizData;
    result: string;
    setResult: (newResult: string) => void;
    setOpenLock: (open: boolean) => void;
}

export const QuizTemplate = (props: quizDataP) => {
    let { data } = props;
    const [result, setResult] = useState("");
    // const [open, setOpen] = useState(false);
    const [openLock, setOpenLock] = useState(false);
    const [showText, setShowText] = useState(true);
    const { roomColor } = useRoomContext();
    const { userLanguage } = useUserContext();
    useEffect(() => {
        if (result === get_text("success", userLanguage)) {
            data.type !== "colorChange" && setOpenLock(true);
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
        orderBorder: (
            <OrderBorder
                data={data}
                result={result}
                setResult={setResult}
                setOpenLock={setOpenLock}
            />
        ),
    };
    console.log("QuizTemplate data:", data);
    // console.log("QuizTemplate hints:", data.hints);
    // console.log("QuizTemplate quiz:", data.quiz);
    return (
        <div className="flex flex-col relative h-screen w-screen overflow-auto">
            {types[data.type]}
            {showText ? (
                <div className="fixed bottom-10 md:bottom-20 left-1/2 transform -translate-x-1/2 max-w-screen rounded-4xl m-2 text-center flex items-center justify-center px-4 z-20">
                    {/* <span
                        className="absolute inline-flex h-full w-full animate-bounce rounded-full opacity-75"
                        style={{
                            backgroundColor:
                                colorPalette[roomColor as keyof typeof colorPalette].light,
                        }}></span> */}
                    <div
                        className="relative rounded-lg px-5 py-2.5 text-lg font-medium border-2 bg-gray-950"
                        style={{
                            color: colorPalette[roomColor as keyof typeof colorPalette].light,
                            borderColor: colorPalette[roomColor as keyof typeof colorPalette].light,
                        }}
                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                        {data.quizText}
                        <TimerLine duration={5000} />
                    </div>
                </div>
            ) : (
                <div className="fixed right-3 bottom-3" dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    <HintChat hints={data.hints} quizText={data.quizText} />
                </div>
            )}
            <Dialog
                open={openLock}
                setOpen={setOpenLock}
                size="small"
                disableOverlayClose={true}
                data="quizSuccess">
                <QuizSuccess data={data.answer} />
            </Dialog>
        </div>
    );
};
