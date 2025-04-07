// import { useState } from "react";
interface ElemObject {
    status: boolean;
    elem: string;
}
interface DigitalNumberProps {
    position: number;
    toggleSegment: (position: number, index: number) => void;
    number: ElemObject[];
}

export const DigitalNumber = (props: DigitalNumberProps) => {
    const { position, number, toggleSegment } = props;

    // const toggleSegment = (index: number) => {
    //     const updatedActive = [...active];
    //     updatedActive[index] = !updatedActive[index];
    //     setActive(updatedActive);
    // };

    return (
        <div className="relative w-40 h-60 flex flex-col items-center justify-center bg-gray-100">
            {/* Top horizontal line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 top-2 left-6 w-28 h-6 ${
                    number[0].status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 0)}>
                {number[0].elem}
            </div>

            {/* Top-left vertical line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 top-8 left-6 w-6 h-18 ${
                    number[1].status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 1)}>
                {number[1].elem}
            </div>

            {/* Top-right vertical line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 top-8 right-6 w-6 h-18 ${
                    number[2].status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 2)}>
                {number[2].elem}
            </div>

            {/* Middle horizontal line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 top-26 left-6 w-28 h-6 ${
                    number[3].status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 3)}>
                {number[3].elem}
            </div>

            {/* Bottom-left vertical line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 bottom-8 left-6 w-6 h-20 ${
                    number[4].status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 4)}>
                {number[4].elem}
            </div>

            {/* Bottom-right vertical line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 bottom-8 right-6 w-6 h-20 ${
                    number[5].status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 5)}>
                {number[5].elem}
            </div>

            {/* Bottom horizontal line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 bottom-2 left-6 w-28 h-6 ${
                    number[6].status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 6)}>
                {number[6].elem}
            </div>
        </div>
    );
};
