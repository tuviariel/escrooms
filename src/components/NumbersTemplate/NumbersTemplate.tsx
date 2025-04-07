import { useState } from "react";
import DigitalNumbers from "../DigitalNumbers";
export const NumbersTemplate = () => {
    const answer = 11;
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
    const [result, setResult] = useState("");
    const checkAnswer = (answerArr: any[][]) => {
        let finished = true;
        Array.from(answer.toString()).map((number, i) => {
            console.log(number);
            console.log(answerArr[i]);
            answerArr[i].map((elem, j) => {
                console.log(elem, !checkObj[Number(number)].includes(j));
                if (
                    (checkObj[Number(number)].includes(j) && elem?.status === false) ||
                    (!checkObj[Number(number)].includes(j) && elem?.status === true)
                ) {
                    console.log("wrong");
                    finished = false;
                    return setResult("Wrong answer! Try again..");
                }
            });
        });
        if (finished) {
            setResult("Great!");
        }
    };

    return (
        <div>
            <DigitalNumbers
                amount={answer.toString().length}
                checkAnswer={checkAnswer}
                result={result}
                setResult={setResult}
            />
            {/* <img src={riddle} alt="riddle - error..." className="" /> */}
        </div>
    );
};
