import { useEffect, useState } from "react";
import Button from "../../../Button";
import { GridCharObj } from "../../../../util/utils";
import { quizData } from "../../../../pages/Room/Room";
interface GridProps {
    data: quizData;
    result: string;
    setResult: (newResult: string) => void;
}

export const Grid = (props: GridProps) => {
    const { data, result, setResult } = props;
    console.log(data);
    const [active, setActive] = useState<
        {
            status: boolean;
            elem: string;
            answer: boolean;
        }[][]
    >([]);
    const [disabled, setDisabled] = useState(true);
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
                let create: any[] = [];
                let correctI = -1,
                    incorrectI = -1,
                    correctMax = data.correctOptions.length - 1,
                    incorrectMax = data.inCorrectOptions.length - 1;
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
                                        ? data.correctOptions[correctI]
                                        : data.inCorrectOptions[incorrectI],
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
                    return setResult("Wrong answer! Try again..");
                }
            });
        });
        if (finished) {
            setResult("Great!");
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
        <div className="bg-gray-100 w-full">
            <div
                className={`${
                    active[0]?.length < 4 ? "ts:flex" : "ph:flex"
                } hidden items-center justify-center`}>
                <>
                    {active.length > 0 ? (
                        <div className="">
                            {active.map((line, i) => {
                                // console.log(line);
                                return (
                                    <div className="flex " key={i}>
                                        {line.map((box, j) => {
                                            return (
                                                <div
                                                    key={i + " " + j}
                                                    className={`border border-amber-800 h-10 w-8 cursor-pointer ${
                                                        box.status ? "bg-amber-700" : "bg-amber-200"
                                                    }`}
                                                    onClick={() => toggleSegment(i, j)}>
                                                    {box.elem}
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
                Please turn your phone on its side
            </div>
            <div className={`${active.length < 4 ? "ts:flex" : "ph:flex"} hidden`}>
                <Button label="Check Answer" onClick={() => checkAnswer()} disabled={disabled} />
                <div className="pt-2">{result}</div>
            </div>
        </div>
    );
};
