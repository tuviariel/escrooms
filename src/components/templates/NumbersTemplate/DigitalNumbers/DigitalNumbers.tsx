import { useEffect, useState } from "react";
import DigitalNumber from "./DigitalNumber";
import Button from "../../../Button";
import { quizData } from "../../../../pages/Room/Room";
import { get_text } from "../../../../util/language";
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
            const check = localStorage.getItem(data?._id);
            if (check && check !== "[]") {
                console.log("localStorage", check);
                setActive(JSON.parse(localStorage.getItem(data?._id) || "[]"));
            } else {
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
    console.log(active);
    return (
        <div className="bg-gray-100 w-full rounded-md">
            <div className="max-h-96 sm:max-h-24 md:max-h-72 w-full overflow-auto border-4 border-b-cyan-900 rounded-t-md">
                <img src={data.quizImg} alt="Quiz Image" className=" scroll-auto max-w-full" />
            </div>
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
                                  toggleSegment={
                                      result !== get_text("success", "he") ? toggleSegment : func
                                  }
                                  amount={active.length}
                                  category={data.category}
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
