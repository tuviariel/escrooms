import { useEffect, useState } from "react";
import Button from "../../../Button";
import { quizData } from "../../../../pages/Room/Room";
interface TurnProps {
    data: quizData;
    result: string;
    setResult: (newResult: string) => void;
}
interface literalObject {
    width: number;
    points: number[][];
}
export const TurnRound = (props: TurnProps) => {
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
    const [cardAnswer, setCardAnswer] = useState(true);
    // useEffect(() => {
    //     const setRiddle = () => {
    //         setActive(() => {
    //             let create: any[] = [];
    //             let correctI = -1,
    //                 incorrectI = -1,
    //                 correctMax = data.correctOptions.length - 1,
    //                 incorrectMax = data.inCorrectOptions.length - 1;
    //             for (let j = 0; j < 7; j++) {
    //                 let level: any[] = [];
    //                 for (let i = 0; i < data.answer.toString().length; i++) {
    //                     let number: string = data.answer.toString()[i];
    //                     const arr = new Array(1 + checkObj[Number(number)].width)
    //                         .fill(null)
    //                         .map((_, i) => {
    //                             // console.log(checkObj[Number(number)].points[j - 1]);
    //                             const isCorrect = checkObj[Number(number)].points[j].includes(
    //                                 (j - 1) * 3 + i
    //                             );
    //                             isCorrect
    //                                 ? correctI === correctMax
    //                                     ? (correctI = 0)
    //                                     : correctI++
    //                                 : incorrectI === incorrectMax
    //                                 ? (incorrectI = 0)
    //                                 : incorrectI++;
    //                             return {
    //                                 status: false,
    //                                 elem: isCorrect
    //                                     ? data.correctOptions[correctI]
    //                                     : data.inCorrectOptions[incorrectI],
    //                                 answer: isCorrect ? true : false,
    //                             };
    //                         });
    //                     // console.log(arr, i);

    //                     level = level.concat(arr);
    //                     // console.log(level);
    //                 }
    //                 // console.log(level);
    //                 incorrectI === incorrectMax ? (incorrectI = 0) : incorrectI++;
    //                 level.push({
    //                     status: false,
    //                     elem: data.inCorrectOptions[incorrectI],
    //                     answer: false,
    //                 });
    //                 create.push(level);
    //                 level = [];
    //             }
    //             // console.log(create);
    //             return create;
    //         });
    //     };
    //     setRiddle();
    // }, []);

    // const checkAnswer = () => {
    //     let finished = true;
    //     active.map((line) => {
    //         line.map((elem) => {
    //             if (
    //                 (elem?.answer === true && elem?.status === false) ||
    //                 (elem?.answer === false && elem?.status === true)
    //             ) {
    //                 finished = false;
    //                 return setResult("Wrong answer! Try again..");
    //             }
    //         });
    //     });
    //     if (finished) {
    //         setResult("Great!");
    //     }
    // };

    // const toggleSegment = (position: number, index: number) => {
    //     disabled && setDisabled(false);
    //     result && setResult("");
    //     const updatedActive = [...active];
    //     updatedActive[position] = [...updatedActive[position]];
    //     updatedActive[position][index] = {
    //         ...updatedActive[position][index],
    //         status: !updatedActive[position][index].status,
    //     };
    //     setActive(updatedActive);
    // };
    // console.log(active);
    return (
        <div className="bg-gray-100 w-full">
            <>
                <p
                    data-id="questionType"
                    className="mb-3 text-center text-lg font-bold text-newBlue">
                    Click to show the {cardAnswer ? "question" : "answer"}
                </p>
                <div className="flex">
                    <div
                        className="mx-auto mb-4 flex h-72 w-500 flex-col p-8 text-xl perspective"
                        onClick={() => setCardAnswer(cardAnswer ? false : true)}>
                        <div
                            className={`relative h-full w-full duration-1000 preserve-3d ${
                                cardAnswer ? "my-rotate-y-180" : ""
                            }`}>
                            <div className="absolute flex h-full w-full flex-col rounded-lg bg-bgGray2 p-3 text-left backface-hidden">
                                <span className="mb-2 font-bold">Question:</span>
                                <span
                                    className={`overflow-y-auto ${
                                        "question".length > 100 ? "w-full" : "mx-auto w-2/3"
                                    }`}>
                                    "question"
                                </span>
                            </div>
                            <div className="absolute flex h-full w-full flex-col rounded-lg bg-bgGray2 p-3 my-rotate-y-180 backface-hidden">
                                <span className="mb-2 text-left font-bold">Answer:</span>
                                <span
                                    className={`overflow-y-auto text-center ${
                                        "answer".length > 100 ? "w-full" : "mx-auto w-2/3"
                                    }`}>
                                    "answer"
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            <div className={`flex ${active[0]?.length < 4 ? "ts:hidden" : "ph:hidden"}`}>
                Please turn your phone on its side
            </div>
            <div className={`${active.length < 4 ? "ts:flex" : "ph:flex"} hidden`}>
                {/* <Button label="Check Answer" onClick={() => checkAnswer()} disabled={disabled} /> */}
                <div className="pt-2">{result}</div>
            </div>
        </div>
    );
};
