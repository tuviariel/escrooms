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
import { colorPalette } from "../../util/UIstyle";
import { useRoomContext } from "../../contexts/roomStyleContext";
// import { quizData } from "../../pages/Room/Room";
interface quizSuccessProps {
    setOpenLock: () => void;
    data: string;
}

export const QuizSuccess = (props: quizSuccessProps) => {
    const { setOpenLock, data } = props;
    const { roomColor } = useRoomContext();
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
    const inputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        honk();
        setPlay(false);
    }, [play]);

    useEffect(() => {
        inputRef.current?.focus();
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
                (count === 0 ? get_text("wrong", "he") : get_text("continue", "he")) +
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
            className="h-96 w-full"
            style={{
                backgroundColor: colorPalette[roomColor as keyof typeof colorPalette].bright,
            }}>
            {!open ? (
                <div className="relative flex flex-col-reverse items-center">
                    <img src={closedBox} alt="Opening Lock" className="h-56" />
                    <div className="flex flex-row z-20 gap-2" dir="rtl">
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
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            ) : (
                <img src={openBox} alt="Opening Lock" className="h-46" />
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
