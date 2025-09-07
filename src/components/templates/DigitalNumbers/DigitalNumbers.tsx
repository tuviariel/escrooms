import { useRef, useEffect, useState } from "react";
import DigitalNumber from "./DigitalNumber";
import Button from "../../Button";
// import { quizData } from "../../../../pages/Room/Room";
import { get_text } from "../../../util/language";
import { imageStyle } from "../../../util/UIstyle";
import { useRoomContext } from "../../../contexts/roomStyleContext";
import { TemplateProps } from "../../../pages/QuizTemplate/QuizTemplate";
// interface DigitalNumbersProps {
//     data: quizData;
//     result: string;
//     setResult: (newResult: string) => void;
//     setOpenLock: (open: boolean) => void;
// }
type TableContentType = {
    index: number;
    icon: string;
};
export const DigitalNumbers = (props: TemplateProps) => {
    const { data, result, setResult, setOpenLock } = props;
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
    const { roomStyle, roomColor } = useRoomContext();
    const [active, setActive] = useState<
        {
            status: boolean;
            elem: {
                index: number;
                icon: string;
            };
        }[][]
    >(
        []
        // Array.from({ length: data.answer.toString().length }, () =>
        //     Array.from({ length: 7 }, () => ({ status: false, elem: "" }))
        // )
    );
    const nextLineRef = useRef<HTMLTableRowElement>(null);
    const digitsRef = useRef<HTMLDivElement>(null);
    const [nextLine, setNextLine] = useState(1);
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        const correct: TableContentType[] = [],
            incorrect: TableContentType[] = [];
        data.quiz.map((q, i) => {
            if (q.is_correct_action) {
                correct.push({ index: i, icon: q.icons.correct });
                incorrect.push({ index: i, icon: q.icons.incorrect });
            } else {
                correct.push({ index: i, icon: q.icons.incorrect });
                incorrect.push({ index: i, icon: q.icons.correct });
            }
        });
        // console.log("correct", correct);
        // console.log("incorrect", incorrect);
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
            elem: {
                index: number;
                icon: string;
            };
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
        setActive((prevActive) => {
            const updatedActive = [...prevActive];
            updatedActive[position] = [...updatedActive[position]];
            updatedActive[position][index] = {
                ...updatedActive[position][index],
                status: !updatedActive[position][index].status,
            };
            return updatedActive;
        });
    };

    const toggleFromTable = (icon: string, index: number) => {
        active.map((num, i) => {
            num.map((elem, j) => {
                if (elem.elem.icon === icon && elem.elem.index === index) {
                    console.log("Element found:", i, j, elem.elem);
                    toggleSegment(i, j);
                }
            });
        });
    };

    const func = () => {
        console.log("finished");
    };

    // console.log(roomColor);
    return (
        <div
            className="bg-gray-100 w-full rounded-md"
            style={{
                backgroundImage: `url(${
                    imageStyle[roomStyle as keyof typeof imageStyle].background
                })`,
            }}>
            <div
                className={` h-full max-h-96 sm:max-h-24 md:max-h-72 w-full overflow-y-auto border-4 border-b-cyan-900 rounded-t-md`}>
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
                                                setNextLine((prev) => {
                                                    console.log(prev);
                                                    if (prev === i) {
                                                        return prev + 1;
                                                    } else {
                                                        return i + 1;
                                                    }
                                                });
                                                toggleFromTable(q.icons.correct, i);
                                                setTimeout(() => {
                                                    nextLineRef.current?.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "end",
                                                    });
                                                }, 400);
                                            }}>
                                            {q.icons.correct}
                                        </td>
                                        <td
                                            className="cursor-pointer border border-amber-50"
                                            onClick={() => {
                                                setNextLine((prev) => {
                                                    console.log(prev);
                                                    if (prev === i) {
                                                        return prev + 1;
                                                    } else {
                                                        return i + 1;
                                                    }
                                                });
                                                toggleFromTable(q.icons.incorrect, i);
                                                setTimeout(() => {
                                                    nextLineRef.current?.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "end",
                                                    });
                                                }, 400);
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
                ref={digitsRef}>
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
                              />
                          );
                      })
                    : get_text("prepare", "he")}
            </div>
            <div className={`flex ${active.length < 4 ? "ts:hidden" : "ph:hidden"}`} dir="rtl">
                {get_text("phone_on_side", "he")}
            </div>
            <div className={`${active.length < 4 ? "ts:flex" : "ph:flex"} hidden`}>
                <Button
                    label={
                        result === get_text("success", "he")
                            ? get_text("finish", "he")
                            : get_text("check_answer", "he")
                    }
                    onClick={() =>
                        result === get_text("success", "he")
                            ? setOpenLock(true)
                            : checkAnswer(active)
                    }
                    className="flex w-auto mx-10 min-w-fit "
                />
                {result && (
                    <div className="m-auto p-1 rounded-xl text-center bg-amber-50" dir="rtl">
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
};
