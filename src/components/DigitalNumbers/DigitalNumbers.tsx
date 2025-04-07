import { useState } from "react";
import DigitalNumber from "./DigitalNumber";
import Button from "../Button";
interface DigitalNumbersProps {
    amount: number;
    checkAnswer: (active: object[][]) => void;
    result: string;
    setResult: (newResult: string) => void;
}

export const DigitalNumbers = (props: DigitalNumbersProps) => {
    const { amount, checkAnswer, result, setResult } = props;
    const [active, setActive] = useState(
        Array.from({ length: amount }, () =>
            Array.from({ length: 7 }, () => ({ status: false, elem: "" }))
        )
    );
    const [disabled, setDisabled] = useState(true);
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

    return (
        <div className="bg-gray-100 w-full">
            <div className="flex items-center justify-center">
                {active.map((number, i) => {
                    return (
                        <DigitalNumber
                            key={i}
                            position={i}
                            number={number}
                            toggleSegment={toggleSegment}
                        />
                    );
                })}
            </div>
            <Button label="Check Answer" onClick={() => checkAnswer(active)} disabled={disabled} />
            <div>{result}</div>
        </div>
    );
};
