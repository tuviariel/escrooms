import { useEffect, useState } from "react";
import DigitalNumber from "./DigitalNumber";
import Button from "../../../Button";
interface DigitalNumbersProps {
    data: {
        answer: number;
        quizImg: string;
        correctOptions: string[];
        inCorrectOptions: string[];
    };
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
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        const setRiddle = () => {
            setActive(() => {
                let create = [];
                let correctI = -1,
                    incorrectI = -1,
                    correctMax = data.correctOptions.length - 1,
                    incorrectMax = data.inCorrectOptions.length - 1;
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
                            elem: isCorrect
                                ? data.correctOptions[correctI]
                                : data.inCorrectOptions[incorrectI],
                        };
                    });
                    // console.log(arr);
                    create.push(arr);
                }
                return create;
            });
        };
        setRiddle();
    }, []);

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
                    active.length < 4 ? "ts:flex" : "ph:flex"
                } hidden items-center justify-center`}>
                {active.length > 0 && active[0]
                    ? active.map((number, i) => {
                          return (
                              <DigitalNumber
                                  key={i}
                                  position={i}
                                  number={number}
                                  toggleSegment={toggleSegment}
                                  amount={active.length}
                              />
                          );
                      })
                    : "Preparing Riddle"}
            </div>
            <div className={`flex ${active.length < 4 ? "ts:hidden" : "ph:hidden"}`}>
                Please turn your phone on its side
            </div>
            <div className={`${active.length < 4 ? "ts:flex" : "ph:flex"} hidden`}>
                <Button
                    label="Check Answer"
                    onClick={() => checkAnswer(active)}
                    disabled={disabled}
                />
                <div className="pt-2">{result}</div>
            </div>
        </div>
    );
};
