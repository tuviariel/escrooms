// import openLock from "../../assets/images/openLock.gif";
// import closedLock from "../../assets/images/closedLock.png";
import openBox from "../../assets/images/openBox.gif";
import closedBox from "../../assets/images/closedBox.png";
import Button from "../Button";
import useSound from "use-sound";
import honkMP3 from "../../assets/sounds/honk.mp3";
import { useEffect, useRef, useState } from "react";
import { get_text } from "../../util/language";
import { useSelector, useDispatch } from "react-redux";
import { quizNumberActions } from "../../reduxStor/quizNumber";
import { quizListActions } from "../../reduxStor/quizList";
import { imageStyle } from "../../util/UIstyle";
import { useRoomContext } from "../../contexts/roomStyleContext";

import { useUserContext } from "../../contexts/userStyleContext";
// import { quizData } from "../../pages/Room/Room";
interface quizSuccessProps {
    // setOpenLock: () => void;
    data: string;
}

export const QuizSuccess = (props: quizSuccessProps) => {
    const { data } = props;
    const { roomStyle } = useRoomContext();
    const { userLanguage } = useUserContext();
    const quiz = useSelector((state: { quizNumber: { quizNumber: number } }) => state.quizNumber);
    const quizNumber = quiz?.quizNumber;
    const dispatch = useDispatch();
    const setQuizNumber = (number: number) => {
        dispatch(quizNumberActions.changeQuizNumber(number));
    };
    // const quizL = useSelector(
    //     (state: { quizList: { quizList: { id: number; completed: boolean }[] } }) => state.quizList
    // );
    // const quizList = quizL?.quizList;
    const setQuizList = (number: number) => {
        dispatch(quizListActions.changeQuizList(number));
    };
    const [honk] = useSound(honkMP3, { volume: 1.25 });
    const [play, setPlay] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [digits, setDigits] = useState<string[]>(new Array(data.length).fill(""));
    const [indexedRef, setIndexedRef] = useState(0);
    const [answerType, setAnswerType] = useState<"number" | "english" | "hebrew" | "other">(
        "other"
    );
    const inputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        honk();
        setPlay(false);
    }, [play]);

    useEffect(() => {
        inputRef.current?.focus();
        const getAnswerType = () => {
            if (/[0-9]/.test(data[0])) {
                return "number";
            } else if (/[A-Za-z]/.test(data[0])) {
                return "english";
            } else if (/[\u0590-\u05FF]/.test(data[0])) {
                return "hebrew";
            }
            return "other";
        };
        setAnswerType(getAnswerType());
    }, []);
    const setNumber = (value: string, index: number) => {
        index < digits.length && setIndexedRef(index + 1);
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
        // console.log(count, i);
        if (count === i) {
            setOpen(true);
            setQuizList(quizNumber);
            setTimeout(() => {
                setQuizNumber(-1);
            }, 3000);
        } else {
            setMessage(
                (count === 0
                    ? get_text("wrong", userLanguage)
                    : get_text("continue", userLanguage)) +
                    ": (" +
                    count +
                    "/" +
                    i +
                    ")"
            );
        }
    };
    return (
        <div
            className="h-full w-full cover"
            style={{
                backgroundImage: `url(${imageStyle[roomStyle as keyof typeof imageStyle].semiBackground})`,
                backgroundSize: "cover",
            }}>
            <div className="relative flex flex-col items-center gap-2">
                {!open ? (
                    <img src={closedBox} alt="Closed Lock" className="h-46" />
                ) : (
                    <img src={openBox} alt="Opening Lock" className="h-46" />
                )}
                <div
                    className="flex flex-row z-20 gap-2 py-2"
                    dir={answerType === "hebrew" ? "rtl" : "ltr"}>
                    {digits.map((digit, index) => {
                        return (
                            <input
                                ref={index === indexedRef ? inputRef : null}
                                // autoFocus={index === 0}
                                key={index}
                                type="text"
                                // max={9}
                                // min={0}
                                className="z-20 bg-stone-400 w-10 h-10 text-center"
                                onChange={(e) => setNumber(e.target.value, index)}
                                value={digit}
                                maxLength={1}
                                onKeyUp={(e) => {
                                    if (e.key === data[index].toString()) {
                                        e.preventDefault();
                                        inputRef.current?.focus();
                                    }
                                    if (e.key === "Enter" || e.key === "enter") {
                                        checkAnswer();
                                    }
                                }}
                            />
                        );
                    })}
                </div>
                <div className="flex">
                    {/* <Button label={get_text("close", userLanguage)} onClick={setOpenLock} /> */}
                    {open ? (
                        <Button
                            label={get_text("close_quiz", userLanguage)}
                            onClick={() => setQuizNumber(-1)}
                        />
                    ) : (
                        <Button
                            label={get_text("check_answer", userLanguage)}
                            onClick={checkAnswer}
                        />
                    )}
                </div>
                <div className="absolute bottom-9 flex justify-center font-semibold bg-amber-200 opacity-80 z-10">
                    {message && <div className=" text-red-500 mt-2">{message}</div>}
                </div>
            </div>
        </div>
    );
};
