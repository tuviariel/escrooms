import { useEffect, useState } from "react";
import Button from "../../../Button";
interface GridProps {
    data: {
        answer: number;
        quizImg: string;
        correctOptions: string[];
        inCorrectOptions: string[];
    };
    result: string;
    setResult: (newResult: string) => void;
}
interface literalObject {
    width: number;
    points: number[][];
}
export const Grid = (props: GridProps) => {
    const { data, result, setResult } = props;
    console.log(data);
    const checkObj: Record<number, literalObject> = {
        1: { width: 1, points: [[], [1], [4], [7], [10], [13], []] },
        2: { width: 3, points: [[], [1, 2, 3], [6], [7, 8, 9], [10], [13, 14, 15], []] },
        3: { width: 3, points: [[], [1, 2, 3], [6], [7, 8, 9], [12], [13, 14, 15], []] },
        4: {
            width: 3,
            points: [[], [1, 3], [4, 6], [7, 8, 9], [12], [15], []],
        },
        5: { width: 3, points: [[], [1, 2, 3], [4], [7, 8, 9], [12], [13, 14, 15], []] },
        6: { width: 3, points: [[], [1, 2, 3], [4], [7, 8, 9], [10, 12], [13, 14, 15], []] },
        7: { width: 3, points: [[], [1, 2, 3], [6], [9], [12], [15], []] },
        8: {
            width: 3,
            points: [[], [1, 2, 3], [4, 6], [7, 8, 9], [10, 12], [13, 14, 15], []],
        },
        9: { width: 3, points: [[], [1, 2, 3], [4, 6], [7, 8, 9], [12], [13, 14, 15], []] },
        0: {
            width: 3,
            points: [[], [1, 2, 3], [4, 6], [7, 9], [10, 12], [13, 14, 15], []],
        },
    };
    const [active, setActive] = useState<
        {
            status: boolean;
            elem: string;
            answer: boolean;
        }[][]
    >([]);
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        const setRiddle = () => {
            setActive(() => {
                let create: any[] = [];
                let correctI = -1,
                    incorrectI = -1,
                    correctMax = data.correctOptions.length - 1,
                    incorrectMax = data.inCorrectOptions.length - 1;
                for (let j = 0; j < 7; j++) {
                    let level: any[] = [];
                    for (let i = 0; i < data.answer.toString().length; i++) {
                        let number: string = data.answer.toString()[i];
                        const arr = new Array(1 + checkObj[Number(number)].width)
                            .fill(null)
                            .map((_, i) => {
                                // console.log(checkObj[Number(number)].points[j - 1]);
                                const isCorrect = checkObj[Number(number)].points[j].includes(
                                    (j - 1) * 3 + i
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
                    // console.log(level);
                    incorrectI === incorrectMax ? (incorrectI = 0) : incorrectI++;
                    level.push({
                        status: false,
                        elem: data.inCorrectOptions[incorrectI],
                        answer: false,
                    });
                    create.push(level);
                    level = [];
                }
                // console.log(create);
                return create;
            });
        };
        setRiddle();
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
    // console.log(active);
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
