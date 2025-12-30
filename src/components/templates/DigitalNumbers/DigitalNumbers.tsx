import { useRef, useEffect, useState } from "react";
import DigitalNumber from "./DigitalNumber";
import Button from "../../Button";
import { get_text } from "../../../util/language";
import { colorPalette } from "../../../util/UIstyle";
import { useRoomContext } from "../../../contexts/roomStyleContext";
import { TemplateProps } from "../../../pages/QuizTemplate/QuizTemplate";
import { segmentsCheckObj } from "../../../util/utils";

import { useUserContext } from "../../../contexts/userStyleContext";
import AnswerButton from "../../AnswerButton";

type TableContentType = {
    index: number;
    icon: string;
};
export const DigitalNumbers = (props: TemplateProps) => {
    const { data, result, setResult, setOpenLock } = props;
    const { userLanguage } = useUserContext();
    const { roomColor } = useRoomContext();
    const nextLineRef = useRef<HTMLTableRowElement>(null);
    const digitsRef = useRef<HTMLDivElement>(null);
    const [nextLine, setNextLine] = useState(1);
    const [disabled, setDisabled] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize active state from localStorage or create default
    const initializeActive = () => {
        const check = localStorage.getItem(data?.id);
        console.log("check", check);
        if (check && check !== "[]") {
            console.log("localStorage", check);
            try {
                const parsed = JSON.parse(check);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse localStorage:", e);
            }
        }
        const correct: TableContentType[] = [],
            incorrect: TableContentType[] = [];
        data.quiz.map((q, i) => {
            if (q.is_correct_action) {
                correct.push({ index: i, icon: q.correctIcon });
                incorrect.push({ index: i, icon: q.incorrectIcon });
            } else {
                correct.push({ index: i, icon: q.incorrectIcon });
                incorrect.push({ index: i, icon: q.correctIcon });
            }
        });
        // Create default state
        let create = [];
        let correctI = -1,
            incorrectI = -1,
            correctMax = correct.length - 1,
            incorrectMax = incorrect.length - 1;
        for (let i = 0; i < data.answer.toString().length; i++) {
            let number: any = data.answer.toString()[i];
            const arr = new Array(7).fill(null).map((_, i) => {
                const isCorrect = segmentsCheckObj[Number(number)].includes(i);
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
            create.push(arr);
        }
        return create;
    };

    const [active, setActive] = useState<
        {
            status: boolean;
            elem: {
                index: number;
                icon: string;
            };
        }[][]
    >(() => initializeActive());

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        console.log("data?.id", data?.id);
        // Only save to localStorage after initialization and if active is not empty
        if (isInitialized && data?.id && active.length > 0) {
            localStorage.setItem(data?.id, JSON.stringify(active));
        }
        return () => {
            if (result === get_text("success", userLanguage)) {
                localStorage.removeItem(data?.id);
            }
        };
    }, [active, isInitialized, data?.id]);

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
                    (segmentsCheckObj[Number(number)].includes(j) && elem?.status === false) ||
                    (!segmentsCheckObj[Number(number)].includes(j) && elem?.status === true)
                ) {
                    // console.log("wrong");
                    finished = false;
                    return setResult(get_text("wrong", userLanguage));
                }
            });
        });
        if (finished) {
            setResult(get_text("success", userLanguage));
        }
    };

    const toggleSegment = (position: number, index: number) => {
        // console.log("Toggling segment:", position, index);
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
        // console.log("Toggling from table:", icon, index);
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
            className="bg-gray-900 flex flex-col w-screen h-screen p-3 pt-5 lg:p-44 relative"
            style={{
                backgroundImage: `url(${
                    colorPalette[roomColor as keyof typeof colorPalette].background
                })`,
                backgroundSize: "100% auto",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
            }}>
            <div
                className={`h-full max-h-96 sm:max-h-24 lg:max-h-72 w-3/4 lg:w-3/5 mx-auto overflow-y-auto`}
                style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                }}>
                <table
                    className="table-auto w-full h-full text-right border-amber-50 text-medium overflow-y-auto border-4"
                    style={{
                        borderColor: colorPalette[roomColor as keyof typeof colorPalette].dark,
                        transform: "rotateX(20deg)",
                        transformOrigin: "bottom center",
                    }}
                    dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    <thead
                        className="sticky top-0 z-10"
                        style={{
                            backgroundColor:
                                colorPalette[roomColor as keyof typeof colorPalette].light,
                            color: colorPalette[roomColor as keyof typeof colorPalette].dark,
                        }}>
                        <tr>
                            <th className="border border-amber-50 whitespace-nowrap">
                                {get_text("situationAction", userLanguage)}
                            </th>
                            <th className="border border-amber-50 whitespace-nowrap px-2">
                                {get_text("correct", userLanguage)}
                            </th>
                            <th className="border border-amber-50 whitespace-nowrap px-2">
                                {get_text("incorrect", userLanguage)}
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        style={{
                            color: colorPalette[roomColor as keyof typeof colorPalette].light,
                        }}>
                        {data?.quiz &&
                            data.quiz.map((q, i) => {
                                return (
                                    <tr
                                        key={i}
                                        className=""
                                        ref={i === nextLine ? nextLineRef : null}>
                                        <td className="border border-amber-50 px-2">
                                            {q.situationAndAction}
                                        </td>
                                        <td
                                            className="cursor-pointer border border-amber-50 text-center"
                                            onClick={() => {
                                                setNextLine((prev) => {
                                                    console.log(prev);
                                                    if (prev === i) {
                                                        return prev + 1;
                                                    } else {
                                                        return i + 1;
                                                    }
                                                });
                                                toggleFromTable(q.correctIcon, i);
                                                setTimeout(() => {
                                                    nextLineRef.current?.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "end",
                                                    });
                                                }, 400);
                                            }}>
                                            {q.correctIcon}
                                        </td>
                                        <td
                                            className="cursor-pointer border border-amber-50 text-center"
                                            onClick={() => {
                                                setNextLine((prev) => {
                                                    console.log(prev);
                                                    if (prev === i) {
                                                        return prev + 1;
                                                    } else {
                                                        return i + 1;
                                                    }
                                                });
                                                toggleFromTable(q.incorrectIcon, i);
                                                setTimeout(() => {
                                                    nextLineRef.current?.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "end",
                                                    });
                                                }, 400);
                                            }}>
                                            {q.incorrectIcon}
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
                } hidden items-center justify-center gap-5`}
                ref={digitsRef}>
                {active.length > 0 && active[0]
                    ? active.map((number, i) => {
                          return (
                              <DigitalNumber
                                  key={i}
                                  position={i}
                                  number={number}
                                  toggleSegment={
                                      result !== get_text("success", userLanguage)
                                          ? toggleSegment
                                          : func
                                  }
                                  amount={active.length}
                              />
                          );
                      })
                    : get_text("prepare", userLanguage)}
            </div>
            <AnswerButton
                result={result}
                onClick={() => {
                    result === get_text("success", userLanguage)
                        ? setOpenLock(true)
                        : checkAnswer(active);
                }}
                active={active}
            />
        </div>
    );
};
