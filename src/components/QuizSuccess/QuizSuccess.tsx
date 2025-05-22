import openLock from "../../assets/images/openLock.gif";
import closedLock from "../../assets/images/closedLock.png";
import Button from "../Button";
import useSound from "use-sound";
import honkMP3 from "../../assets/sounds/honk.mp3";
import { useEffect, useRef, useState } from "react";
import { useQuizContext } from "../../contexts/quizNumberContext";
import { get_text } from "../../util/language";
// import { quizData } from "../../pages/Room/Room";
interface quizSuccessProps {
    setOpenLock: () => void;
    data: string;
}

export const QuizSuccess = (props: quizSuccessProps) => {
    const { setOpenLock, data } = props;
    const { setQuizNumber } = useQuizContext();
    const [honk] = useSound(honkMP3, { volume: 1.25 });
    const [play, setPlay] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [digits, setDigits] = useState(new Array(data.length).fill("0"));
    useEffect(() => {
        honk();
    }, [play]);
    const inputRef = useRef(null);
    const setNumber = (value: string, index: number) => {
        setMessage("");
        const updatedDigits = [...digits];
        updatedDigits[index] = value;
        setDigits(updatedDigits);
    };
    const checkAnswer = () => {
        console.log(data, digits);
        let count = 0,
            i;
        const ansArr = data.split("");
        for (i = 0; i <= digits.length - 1; i++) {
            if (ansArr[i] === digits[i]) {
                count++;
            }
        }
        console.log(count, i);

        count === i
            ? setOpen(true)
            : count === 0
            ? setMessage(get_text("wrong", "he") + ": (" + count + "/" + i + ")")
            : setMessage(get_text("continue", "he") + ": (" + count + "/" + i + ")");
    };
    return (
        <div className="h-96 w-full">
            {!open ? (
                <div className="relative">
                    <img src={closedLock} alt="Opening Lock" className="" />
                    <div className="flex flex-col absolute z-20 gap-2 right-22 bottom-9">
                        {digits.map((digit, index) => {
                            return (
                                <input
                                    ref={index === 0 ? inputRef : null}
                                    // autoFocus={index === 0}
                                    key={index}
                                    type="number"
                                    max={9}
                                    min={0}
                                    className="z-20 bg-stone-400 pl-10 w-22"
                                    onChange={(e) => setNumber(e.target.value, index)}
                                    value={digit}
                                />
                            );
                        })}
                    </div>
                </div>
            ) : (
                <img src={openLock} alt="Opening Lock" className="" />
            )}
            <div className="flex">
                <Button label={get_text("close", "he")} onClick={setOpenLock} />
                {open ? (
                    <Button
                        label={get_text("close_quiz", "he")}
                        onClick={() => setQuizNumber(-1)}
                    />
                ) : (
                    <Button label={get_text("check_answer", "he")} onClick={checkAnswer} />
                )}
            </div>
            <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                {message && <div className=" text-red-500 mt-2">{message}</div>}
            </div>
        </div>
    );
};
