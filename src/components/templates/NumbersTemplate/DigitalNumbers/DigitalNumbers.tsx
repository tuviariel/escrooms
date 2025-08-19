import { useRef, useEffect, useState } from "react";
import DigitalNumber from "./DigitalNumber";
import Button from "../../../Button";
import { quizData } from "../../../../pages/Room/Room";
import { get_text } from "../../../../util/language";
import { imageStyle } from "../../../../util/UIstyle";
import { useRoomContext } from "../../../../contexts/roomStyleContext";
interface DigitalNumbersProps {
    data: quizData;
    // checkAnswer: (
    //     active: {
    //         status: boolean;
    //         elem: string;
    //     }[][]
    // ) => void;
    result: string;
    setResult: (newResult: string) => void;
}

export const DigitalNumbers = (props: DigitalNumbersProps) => {
    const { data, result, setResult } = props;
    const checkObj: Record<number, number[]> = {
        1: [2, 5],
        2: [0, 2, 3, 4, 6],
        3: [0, 2, 3, 5, 6],
        4: [1, 2, 3, 5],
        5: [0, 1, 3, 5, 6],
        6: [0, 1, 3, 4, 5, 6],
        7: [0, 2, 5],
        8: [0, 1, 2, 3, 4, 5, 6],
        9: [0, 1, 2, 3, 5, 6],
        0: [0, 1, 2, 4, 5, 6],
    };
    const { roomStyle, roomColor, roomFont } = useRoomContext();
    const [active, setActive] = useState<
        {
            status: boolean;
            elem: string;
        }[][]
    >(
        []
        // Array.from({ length: data.answer.toString().length }, () =>
        //     Array.from({ length: 7 }, () => ({ status: false, elem: "" }))
        // )
    );
    const nextLineRef = useRef<HTMLTableRowElement>(null);
    const [nextLine, setNextLine] = useState(1);
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        const correct: string[] = [],
            incorrect: string[] = [];
        data.quiz.map((q) => {
            if (q.is_correct_action) {
                correct.push(q.icons.correct);
                incorrect.push(q.icons.incorrect);
            } else {
                correct.push(q.icons.incorrect);
                incorrect.push(q.icons.correct);
            }
        });
        console.log("correct", correct);
        console.log("incorrect", incorrect);
        const setRiddle = () => {
            const check = localStorage.getItem(data?._id);
            if (check && check !== "[]") {
                console.log("localStorage", check);
                setActive(JSON.parse(localStorage.getItem(data?._id) || "[]"));
            } else {
                setActive(() => {
                    let create = [];
                    let correctI = -1,
                        incorrectI = -1,
                        correctMax = correct.length - 1,
                        incorrectMax = incorrect.length - 1;
                    for (let i = 0; i < data.answer.toString().length; i++) {
                        let number: any = data.answer.toString()[i];
                        const arr = new Array(7).fill(null).map((_, i) => {
                            const isCorrect = checkObj[Number(number)].includes(i);
                            isCorrect
                                ? correctI === correctMax
                                    ? (correctI = 0)
                                    : correctI++
                                : incorrectI === incorrectMax
                                ? (incorrectI = 0)
                                : incorrectI++;
                            return {
                                status: false,
                                elem: isCorrect ? correct[correctI] : incorrect[incorrectI],
                            };
                        });
                        // console.log(arr);
                        create.push(arr);
                    }
                    return create;
                });
            }
        };

        setRiddle();
    }, []);
    useEffect(() => {
        data?._id && localStorage.setItem(data?._id, JSON.stringify(active));
        return () => {
            if (result === get_text("success", "he")) {
                localStorage.removeItem(data?._id);
            }
        };
    }, [active]);

    const checkAnswer = (
        answerArr: {
            status: boolean;
            elem: string;
        }[][]
    ) => {
        let finished = true;
        Array.from(data.answer.toString()).map((number, i) => {
            // console.log(number);
            // console.log(answerArr[i]);
            answerArr[i].map((elem, j) => {
                // console.log(elem, !checkObj[Number(number)].includes(j));
                if (
                    (checkObj[Number(number)].includes(j) && elem?.status === false) ||
                    (!checkObj[Number(number)].includes(j) && elem?.status === true)
                ) {
                    // console.log("wrong");
                    finished = false;
                    return setResult(get_text("wrong", "he"));
                }
            });
        });
        if (finished) {
            setResult(get_text("success", "he"));
        }
    };
    const toggleSegment = (position: number, index: number) => {
        disabled && setDisabled(false);
        result && setResult("");
        const updatedActive = [...active];
        updatedActive[position] = [...updatedActive[position]];
        updatedActive[position][index] = {
            ...updatedActive[position][index],
            status: !updatedActive[position][index].status,
        };
        setActive(updatedActive);
    };
    const func = () => {
        console.log("finished");
    };
    console.log(roomStyle, roomColor, roomFont);
    return (
        <div className="bg-gray-100 w-full rounded-md">
            <div
                className={` h-full max-h-96 sm:max-h-24 md:max-h-72 w-full overflow-y-auto border-4 border-b-cyan-900 rounded-t-md`}
                style={{
                    backgroundImage: `url(${
                        imageStyle[roomStyle as keyof typeof imageStyle].background
                    })`,
                }}>
                <table
                    className="table-auto w-full h-full text-right border border-amber-50 text-xl text-amber-50 overflow-y-auto"
                    dir="rtl">
                    <thead className="sticky top-0 z-10 bg-gray-700 opacity-70">
                        <tr>
                            <th className="border border-amber-50 whitespace-nowrap">
                                {get_text("situationAction", "he")}
                            </th>
                            <th className="border border-amber-50 whitespace-nowrap px-2">
                                {get_text("correct", "he")}
                            </th>
                            <th className="border border-amber-50 whitespace-nowrap px-2">
                                {get_text("incorrect", "he")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.quiz &&
                            data.quiz.map((q, i) => {
                                return (
                                    <tr
                                        key={i}
                                        className=""
                                        ref={i === nextLine ? nextLineRef : null}>
                                        <td className="border border-amber-50">
                                            {q.situationAndAction}
                                        </td>
                                        <td
                                            className="cursor-pointer border border-amber-50"
                                            onClick={() => {
                                                nextLineRef.current?.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "end",
                                                });
                                                setNextLine((prev) => prev + 1);
                                            }}>
                                            {q.icons.correct}
                                        </td>
                                        <td
                                            className="cursor-pointer border border-amber-50"
                                            onClick={() => {
                                                nextLineRef.current?.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "end",
                                                });
                                                setNextLine((prev) => prev + 1);
                                            }}>
                                            {q.icons.incorrect}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            <div
                className={`${
                    active.length < 4 ? "ts:flex" : "ph:flex"
                } hidden items-center justify-center`}
                style={{
                    backgroundImage: `url(${
                        imageStyle[roomStyle as keyof typeof imageStyle].background
                    })`,
                }}>
                {active.length > 0 && active[0]
                    ? active.map((number, i) => {
                          return (
                              <DigitalNumber
                                  key={i}
                                  position={i}
                                  number={number}
                                  toggleSegment={
                                      result !== get_text("success", "he") ? toggleSegment : func
                                  }
                                  amount={active.length}
                                  //   category={data.category}
                              />
                          );
                      })
                    : get_text("prepare", "he")}
            </div>
            <div className={`flex ${active.length < 4 ? "ts:hidden" : "ph:hidden"}`} dir="rtl">
                {get_text("phone_on_side", "he")}
            </div>
            <div className={`${active.length < 4 ? "ts:flex" : "ph:flex"} hidden`}>
                {result !== get_text("success", "he") && (
                    <Button
                        label={get_text("check_answer", "he")}
                        onClick={() => checkAnswer(active)}
                        disabled={disabled}
                        className="min-w-fit"
                    />
                )}
                <div className="w-full pt-2 text-center" dir="rtl">
                    {result}
                </div>
            </div>
        </div>
    );
};
