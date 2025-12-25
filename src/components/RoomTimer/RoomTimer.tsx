import { useEffect, useState } from "react";
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
}

export const RoomTimer = ({
    totalHotspots = 6,
    completedHotspots = 0,
    roomId,
    completed = false,
    roomName = "",
}: RoomTimerProps) => {
    const { roomColor } = useRoomContext();
    const { userLanguage } = useUserContext();
    const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds

    const activeColor = colorPalette[roomColor as keyof typeof colorPalette]?.dark || "#06b6d4";
    const completedColor = colorPalette[roomColor as keyof typeof colorPalette]?.light || "#10b981";
    const timerKey = roomId ? `roomTimer_${roomId}` : "roomTimer";

    useEffect(() => {
        // Load saved time from localStorage or start with default
        const savedTime = localStorage.getItem(timerKey);
        if (savedTime) {
            const savedTimestamp = parseInt(savedTime);
            const elapsed = Math.floor((Date.now() - savedTimestamp) / 1000);
            const remaining = Math.max(0, 3600 - elapsed);
            setTimeRemaining(remaining);
        } else {
            // Start new timer
            localStorage.setItem(timerKey, Date.now().toString());
        }

        // Only run countdown if not completed
        if (completed) return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timerKey, completed]);

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
    const displayColor = completed || timeRemaining === 0 ? completedColor : activeColor; // Green when completed

    return (
        <motion.div
            className="absolute top-4 right-8 z-90 pointer-events-none"
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
                    transform: "rotateY(-25deg) rotateX(5deg)",
                    transformStyle: "preserve-3d",
                }}>
                {/* Title */}
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

                {/* Timer Display */}
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div
                        className="text-2xl md:text-4xl font-mono font-bold tracking-wider"
                        style={{
                            color: displayColor,
                            textShadow: `0 0 15px ${displayColor}, 0 0 30px ${displayColor}80, 0 0 45px ${displayColor}60`,
                            fontFamily: "'Orbitron', 'Courier New', monospace",
                        }}>
                        {timeDisplay.minutes}:{timeDisplay.seconds}
                    </div>
                </div>

                {/* Instruction */}
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
            </div>
        </motion.div>
    );
};
