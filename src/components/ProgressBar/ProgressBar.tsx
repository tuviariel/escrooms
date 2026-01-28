import React, { useEffect, useRef, useState } from "react";
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
    loading: boolean;
    roomId?: string;
};

export const ProgressBar: React.FC<Props> = ({
    step,
    setStep,
    stepInfo,
    className,
    loading,
    roomId = "",
}) => {
    const { userLanguage } = useUserContext();
    console.log(loading);
    const steps = Object.keys(stepInfo).length;
    // clamp step to valid range
    const current = Object.keys(stepInfo).indexOf(step);

    // When there's only one step avoid divide-by-zero
    const denom = steps > 1 ? steps - 1 : 1;

    const actualProgressPercent = (current / denom) * 100;

    // Track the step when loading starts (for rollback on error)
    const stepWhenLoadingStartedRef = useRef<stepType | null>(null);
    const [targetProgress, setTargetProgress] = useState<number>(actualProgressPercent);
    const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);
    const prevLoadingRef = useRef<boolean>(loading);
    const prevStepRef = useRef<stepType>(step);
    const prevRoomIdRef = useRef<string>(roomId);

    // Get duration from the step we're transitioning FROM (the one before loading started)
    // If loading, use the step that was active when loading started, otherwise use current step
    const transitionFromStep = stepWhenLoadingStartedRef.current || step;
    const transitionFromStepDuration = stepInfo[transitionFromStep]?.duration || 0;
    const transitionDuration =
        transitionFromStepDuration > 0 ? `${transitionFromStepDuration}s` : "300ms";

    // Reset immediately when roomId becomes empty (new room started)
    useEffect(() => {
        // If roomId changed from a value to empty string, reset immediately without animation
        if (roomId === "" && prevRoomIdRef.current !== "") {
            // Disable animation for instant reset
            setShouldAnimate(false);
            // Reset to first step's progress (0%)
            setTargetProgress(0);
            // Clear any loading state references
            stepWhenLoadingStartedRef.current = null;

            // Re-enable animation after the reset is applied
            setTimeout(() => {
                setShouldAnimate(true);
            }, 5000);
        }

        prevRoomIdRef.current = roomId;
    }, [roomId]);

    // Handle loading state changes
    useEffect(() => {
        const currentIndex = Object.keys(stepInfo).indexOf(step);

        // Loading just started
        if (loading && !prevLoadingRef.current) {
            // Store the current step as the "from" step
            stepWhenLoadingStartedRef.current = step;

            // Calculate next step's progress
            const nextIndex = currentIndex + 1;
            if (nextIndex < steps) {
                const nextProgress = (nextIndex / denom) * 100;
                setTargetProgress(nextProgress);
            }
        }
        // Loading just ended
        else if (!loading && prevLoadingRef.current) {
            const fromStep = stepWhenLoadingStartedRef.current;

            if (fromStep && step === fromStep) {
                // Step didn't change (error occurred) - revert to current step's progress
                setTargetProgress(actualProgressPercent);
            } else {
                // Step changed successfully - update to actual progress
                setTargetProgress(actualProgressPercent);
            }

            // Clear the reference
            stepWhenLoadingStartedRef.current = null;
        }
        // Step changed while not loading (normal navigation)
        else if (!loading && step !== prevStepRef.current) {
            const prevIndex = Object.keys(stepInfo).indexOf(prevStepRef.current);
            const currentIndex = Object.keys(stepInfo).indexOf(step);

            // If moving to a lower step (backwards), change instantly without animation
            if (currentIndex < prevIndex) {
                setShouldAnimate(false);
                setTargetProgress(actualProgressPercent);
                // Re-enable animation after the instant change is applied
                setTimeout(() => {
                    setShouldAnimate(true);
                }, 5000);
            } else {
                // Moving forward, use normal animation
                setTargetProgress(actualProgressPercent);
            }
        }

        prevLoadingRef.current = loading;
        prevStepRef.current = step;
    }, [loading, step, stepInfo, steps, denom, actualProgressPercent]);

    // Use target progress for the bar width
    const progressPercent = targetProgress;

    // const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    //     if (e.key === "Enter" || e.key === " ") {
    //         e.preventDefault();
    //         setStep(index);
    //     }
    // };

    return (
        <div
            className={`w-9/12 py-2 px-2 mx-auto ${className}`}
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
                        transition: shouldAnimate ? `width ${transitionDuration} ease` : "none",
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
