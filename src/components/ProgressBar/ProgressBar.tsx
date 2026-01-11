import React from "react";
import { useUserContext } from "../../contexts/userStyleContext";
import { stepInfoType, stepType } from "../../pages/RoomBuilder/RoomBuilder";

// type StepInfo = {
//     name: string;
//     isComplete?: boolean;
// };

type Props = {
    step: stepType;
    setStep: (step: stepType) => void;
    stepInfo: stepInfoType;
    className?: string;
};

export const ProgressBar: React.FC<Props> = ({ step, setStep, stepInfo, className }) => {
    const { userLanguage } = useUserContext();

    const steps = Object.keys(stepInfo).length;
    // clamp step to valid range
    const current = Object.keys(stepInfo).indexOf(step);

    // When there's only one step avoid divide-by-zero
    const denom = steps > 1 ? steps - 1 : 1;

    const progressPercent = (current / denom) * 100;

    // const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    //     if (e.key === "Enter" || e.key === " ") {
    //         e.preventDefault();
    //         setStep(index);
    //     }
    // };

    return (
        <div
            className={`w-9/12 py-4 px-2 mx-auto ${className}`}
            // style={{ boxSizing: "border-box" }}
            dir={userLanguage === "he" ? "rtl" : "ltr"}>
            <div className="relative h-5">
                {/* Track */}
                <div className="absolute top-4 left-0 right-0 h-2 rounded-full bg-gray-600" />
                {/* Progress */}
                <div
                    className="absolute top-4 left-0 h-2 rounded-full bg-cyan-600"
                    style={{
                        width: `${progressPercent}%`,
                        transition: "width 300ms ease",
                    }}
                />
                {/* Dots */}
                {Object.keys(stepInfo).map((info, i) => {
                    const leftPercent = (i / denom) * 100;
                    const completed = stepInfo[info].isComplete ?? i <= current;
                    const isActive = info === step;
                    return (
                        <button
                            key={i}
                            className={`absolute top-2 -translate-x-1/2 w-6 h-6 rounded-xl border-none p-0 flex items-center justify-center ${isActive ? "bg-cyan-500" : "bg-[#ffffff]"}`}
                            // onClick={() => completed && setStep(i)}
                            // onKeyDown={(e) => handleKeyDown(e, i)}
                            aria-current={isActive ? "step" : undefined}
                            aria-label={`Go to step ${i + 1}: ${stepInfo[info].name}`}
                            style={{
                                left: `${leftPercent}%`,
                                boxShadow: completed
                                    ? "0 0 0 4px rgba(37,99,235,0.12)"
                                    : "0 0 0 1px rgba(0,0,0,0.06)",
                                outline: isActive ? "2px solid rgba(37,99,235,0.2)" : "none",
                                transition: "background 150ms, box-shadow 150ms",
                            }}>
                            {/* small inner dot for visual contrast when completed */}
                            <span
                                className={`w-2.5 h-2.5 rounded-md ${completed ? "bg-[#ffffff]" : "bg-cyan-600"} block`}
                                aria-hidden
                            />
                        </button>
                    );
                })}
            </div>

            {/* Labels under dots */}
            <div className="relative my-3 min-h-4">
                {Object.keys(stepInfo).map((info, i) => {
                    const leftPercent = (i / denom) * 100;
                    const completed = stepInfo[info].isComplete ?? i <= current;
                    return (
                        <div
                            key={i}
                            onClick={() => completed && setStep(info as stepType)}
                            className="absolute -translate-x-1/2 text-center cursor-pointer w-32"
                            style={{
                                left: `${leftPercent}%`,
                                userSelect: "none",
                            }}>
                            <div
                                className={`text-xs ${completed ? "text-[#2563eb]" : "text-[#6b7280]"} overflow-hidden max-w-32`}
                                style={{
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                }}>
                                {stepInfo[info].name}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;
