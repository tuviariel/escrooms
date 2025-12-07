import { useEffect, useState } from "react";
import Button from "../../Button";
import { GridCharObj } from "../../../util/utils";
// import { quizData } from "../../../pages/Room/Room";
import { colorPalette, imageStyle } from "../../../util/UIstyle";
import { useRoomContext } from "../../../contexts/roomStyleContext";
import { TemplateProps } from "../../../pages/QuizTemplate/QuizTemplate";
import { get_text } from "../../../util/language";

import { useUserContext } from "../../../contexts/userStyleContext";
// interface GridProps {
//     data: quizData;
//     result: string;
//     setResult: (newResult: string) => void;
// }
// type TableContentType = {
//     index: number;
//     icon: string;
// };
export const Grid = (props: TemplateProps) => {
    const { data, result, setResult, setOpenLock } = props;
    const { userLanguage } = useUserContext();
    console.log(data);
    const [active, setActive] = useState<
        {
            status: boolean;
            elem: {
                icon: string;
                title: string;
            };
            answer: boolean;
        }[][]
    >([]);
    const [disabled, setDisabled] = useState(true);
    const { roomStyle, roomColor } = useRoomContext();
    useEffect(() => {
        const setGrid = () => {
            setActive(() => {
                let rightAnswer = "";
                if (/\d/.test(data.answer[0]) || /[a-zA-Z]/.test(data.answer[0])) {
                    //checking if answer is a number or a letter in English-
                    rightAnswer = data.answer;
                } else {
                    //if it is a letter in hebrew the answer should first be reversed:
                    for (let i = 0; i < data.answer.length; i++) {
                        rightAnswer = data.answer[i] + rightAnswer;
                    }
                }
                // console.log(rightAnswer);
                // const correct: TableContentType[] = [],
                //     incorrect: TableContentType[] = [];
                // data.quiz.map((q, i) => {
                //     if (q.is_correct_action) {
                //         correct.push({ index: i, icon: q.icons.correct });
                //         incorrect.push({ index: i, icon: q.icons.incorrect });
                //     } else {
                //         correct.push({ index: i, icon: q.icons.incorrect });
                //         incorrect.push({ index: i, icon: q.icons.correct });
                //     }
                // });
                let create: any[] = [];
                let correctI = -1,
                    incorrectI = -1,
                    correctMax = data.quiz[0].length - 1,
                    incorrectMax = data.quiz[1].length - 1;
                for (let levelI = 0; levelI < 5; levelI++) {
                    let level: any[] = [];
                    for (let charI = 0; charI < rightAnswer.length; charI++) {
                        let char: string = rightAnswer[charI];
                        const arr = new Array(
                            charI === 0 ? GridCharObj[char].width : 1 + GridCharObj[char].width
                        )
                            .fill(null)
                            .map((_, IInChar) => {
                                const isCorrect = GridCharObj[char].points[levelI].includes(
                                    charI === 0 ? levelI * 4 + IInChar + 1 : levelI * 4 + IInChar
                                );
                                isCorrect
                                    ? correctI === correctMax
                                        ? (correctI = 0)
                                        : correctI++
                                    : incorrectI === incorrectMax
                                      ? (incorrectI = 0)
                                      : incorrectI++;
                                return {
                                    status: false,
                                    elem: isCorrect
                                        ? data.quiz[0][correctI]
                                        : data.quiz[1][incorrectI],
                                    answer: isCorrect ? true : false,
                                };
                            });
                        // console.log(arr, i);
                        level = level.concat(arr);
                        // console.log(level);
                    }
                    create.push(level);
                    level = [];
                }
                // console.log(create);
                return create;
            });
        };
        setGrid();
    }, []);

    const checkAnswer = () => {
        let finished = true;
        active.map((line) => {
            line.map((elem) => {
                if (
                    (elem?.answer === true && elem?.status === false) ||
                    (elem?.answer === false && elem?.status === true)
                ) {
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
    console.log(active);
    return (
        <div
            className="bg-gray-100 flex flex-col w-screen h-screen p-3"
            style={{
                backgroundImage: `url(${
                    imageStyle[roomStyle as keyof typeof imageStyle].background
                })`,
            }}>
            <div
                className={`${
                    active[0]?.length < 4 ? "ts:flex" : "ph:flex"
                } hidden items-center justify-center mt-2`}
                dir="rtl">
                <>
                    {active.length > 0 ? (
                        <div className=" border-4 border-amber-800" dir="ltr">
                            {active.map((line, i) => {
                                // console.log(line);
                                return (
                                    <div className="flex " key={i}>
                                        {line.map((box, j) => {
                                            return (
                                                <div
                                                    key={i + " " + j}
                                                    className={`border border-amber-800 h-18 w-14 cursor-pointer text-4xl pt-3`}
                                                    style={{
                                                        backgroundColor: box.status
                                                            ? colorPalette[
                                                                  roomColor as keyof typeof colorPalette
                                                              ].dark
                                                            : colorPalette[
                                                                  roomColor as keyof typeof colorPalette
                                                              ].light,
                                                    }}
                                                    onClick={() => toggleSegment(i, j)}
                                                    title={box.elem.title}>
                                                    {box.elem.icon}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        "Preparing Riddle"
                    )}
                </>
            </div>
            <div className={`flex ${active[0]?.length < 4 ? "ts:hidden" : "ph:hidden"}`}>
                {get_text("phone_on_side", userLanguage)}
            </div>
            <div className={`${active.length < 4 ? "ts:flex" : "ph:flex"} hidden`}>
                <Button
                    label={
                        result === get_text("success", userLanguage)
                            ? get_text("finish", userLanguage)
                            : get_text("check_answer", userLanguage)
                    }
                    onClick={() =>
                        result === get_text("success", userLanguage)
                            ? setOpenLock(true)
                            : checkAnswer()
                    }
                    className="mx-10"
                />
                {result && (
                    <div
                        className="mr-10 py-1 px-4 rounded-xl text-center bg-amber-50"
                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
};
