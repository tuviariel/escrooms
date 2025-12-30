import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRoomContext } from "../../contexts/roomStyleContext";
import { colorPalette } from "../../util/UIstyle";
import { get_text } from "../../util/language";
import { useUserContext } from "../../contexts/userStyleContext";

interface RoomTimerProps {
    totalHotspots?: number;
    completedHotspots?: number;
    roomId?: string;
    completed?: boolean;
    roomName?: string;
    small?: boolean;
}

export const RoomTimer = ({
    totalHotspots = 6,
    completedHotspots = 0,
    roomId,
    completed = false,
    roomName = "",
    small = false,
}: RoomTimerProps) => {
    const { roomColor } = useRoomContext();
    const { userLanguage } = useUserContext();
    const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
    const timeRemainingRef = useRef(3600); // Keep ref for cleanup

    const activeColor = colorPalette[roomColor as keyof typeof colorPalette]?.dark || "#06b6d4";
    const completedColor = colorPalette[roomColor as keyof typeof colorPalette]?.light || "#10b981";
    const timerKey = `roomTimer_${roomId || roomName || "default"}`;

    // Keep ref in sync with state
    useEffect(() => {
        timeRemainingRef.current = timeRemaining;
    }, [timeRemaining]);

    useEffect(() => {
        // Load saved timer data from localStorage
        const savedData = localStorage.getItem(timerKey);
        if (savedData) {
            try {
                const { remaining, timestamp } = JSON.parse(savedData);
                console.log("last played time:", timestamp);
                // const now = Date.now();
                // const elapsed = Math.floor((now - timestamp) / 1000);
                // const newRemaining = Math.max(0, remaining - elapsed);
                setTimeRemaining(remaining);
                timeRemainingRef.current = remaining;

                // Update saved data with new remaining time and current timestamp
                localStorage.setItem(
                    timerKey,
                    JSON.stringify({ remaining: remaining, timestamp: Date.now() })
                );
            } catch (e) {
                console.error("Failed to parse saved timer data:", e);
                // Start new timer if parsing fails
                setTimeRemaining(3600);
                timeRemainingRef.current = 3600;
                localStorage.setItem(
                    timerKey,
                    JSON.stringify({ remaining: 3600, timestamp: Date.now() })
                );
            }
        } else {
            // Start new timer
            setTimeRemaining(3600);
            timeRemainingRef.current = 3600;
            localStorage.setItem(
                timerKey,
                JSON.stringify({ remaining: 3600, timestamp: Date.now() })
            );
        }

        // Only run countdown if not completed
        if (completed) return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0) {
                    // Clear timer data when it reaches 0
                    localStorage.removeItem(timerKey);
                    return 0;
                }
                const newTime = prev - 1;
                timeRemainingRef.current = newTime;
                // Save remaining time and timestamp on each update
                localStorage.setItem(
                    timerKey,
                    JSON.stringify({ remaining: newTime, timestamp: Date.now() })
                );
                return newTime;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            // Save remaining time on unmount using ref to get current value
            const currentTime = timeRemainingRef.current;
            if (currentTime > 0 && !completed) {
                localStorage.setItem(
                    timerKey,
                    JSON.stringify({ remaining: currentTime, timestamp: Date.now() })
                );
            }
        };
    }, [timerKey, completed]);

    // Clear timer data when room is completed
    useEffect(() => {
        if (completed && roomId) {
            localStorage.removeItem(timerKey);
            // TODO- here would be the best place to update the users score of the room.
        }
    }, [completed, timerKey, roomId]);

    // Format time for digital display (large segmented style)
    const formatTimeForDisplay = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return {
            minutes: mins.toString().padStart(2, "0"),
            seconds: secs.toString().padStart(2, "0"),
        };
    };

    const timeDisplay = formatTimeForDisplay(timeRemaining);
    const displayColor =
        completed || timeRemaining > 600 || timeRemaining === 0 ? completedColor : activeColor;

    return (
        <motion.div
            className={`absolute z-90 pointer-events-none ${small ? "right-0 top-2" : "right-8 top-4"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
            }}>
            <div
                className="relative px-4 py-3 rounded-2xl backdrop-blur-md opacity-70 border-4 shadow-2xl border-double"
                style={{
                    borderColor: displayColor,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    boxShadow: `0 0 30px ${displayColor}40, inset 0 0 20px ${displayColor}20`,
                    transform: "rotateY(-35deg) rotateX(5deg)",
                    transformStyle: "preserve-3d",
                }}>
                {/* Title */}
                {!small && (
                    <h3
                        className="text-xl md:text-2xl font-bold mb-3 text-center"
                        style={{
                            color: displayColor,
                            textShadow: `0 0 10px ${displayColor}, 0 0 20px ${displayColor}80`,
                        }}
                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                        {get_text("emergency_protocol", userLanguage)}
                        {roomName}
                    </h3>
                )}

                {/* Timer Display */}
                <div
                    className={`flex items-center justify-center gap-2 ${small ? "mb-0" : "mb-2"}`}>
                    <div
                        className={`font-mono font-bold tracking-wider ${small ? "text-xl md:text-2xl" : "text-2xl md:text-4xl"}`}
                        style={{
                            color: displayColor,
                            textShadow: `0 0 15px ${displayColor}, 0 0 30px ${displayColor}80, 0 0 45px ${displayColor}60`,
                            fontFamily: "'Orbitron', 'Courier New', monospace",
                        }}>
                        {timeDisplay.minutes}:{timeDisplay.seconds}
                    </div>
                </div>

                {/* Instruction */}
                {!small && (
                    <p
                        className="text-sm md:text-base text-center"
                        style={{
                            color: displayColor,
                            textShadow: `0 0 5px ${displayColor}60`,
                        }}
                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                        {completed
                            ? get_text("room_finished", userLanguage)
                            : get_text("emergency_protocol_instruction", userLanguage).replace(
                                  "{count}",
                                  (totalHotspots - completedHotspots).toString()
                              )}
                    </p>
                )}
            </div>
        </motion.div>
    );
};
