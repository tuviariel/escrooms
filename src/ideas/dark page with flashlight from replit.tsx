import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, Activity, AlertCircle } from "lucide-react";
import roomBg from "@assets/generated_images/mysterious_first_aid_room_background.png";

export default function RoomHub() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [, setLocation] = useLocation();
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-black cursor-none"
            data-testid="room-hub">
            {/* Background Layer - The Room */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-100 ease-out"
                style={{
                    backgroundImage: `url(${roomBg})`,
                    transform: `scale(1.05) translate(${(mousePos.x - window.innerWidth / 2) * -0.02}px, ${(mousePos.y - window.innerHeight / 2) * -0.02}px)`,
                }}
            />

            {/* Dark Overlay with Flashlight Effect */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(10,10,12, 0.98) 100%)`,
                }}
            />

            {/* Interactive Nodes Layer */}
            <div className="absolute inset-0 z-20">
                {/* Active Node: First Aid Station */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <InteractiveNode
                        title="FIRST AID STATION"
                        icon={<Activity className="w-8 h-8 text-primary animate-pulse" />}
                        status="CRITICAL"
                        active={true}
                        onClick={() => setLocation("/quiz/first-aid")}
                        x={mousePos.x}
                        y={mousePos.y}
                        nodeX={window.innerWidth / 2}
                        nodeY={window.innerHeight / 2}
                    />
                </div>

                {/* Locked Node: Storage */}
                <div className="absolute top-1/3 right-1/4">
                    <InteractiveNode
                        title="STORAGE"
                        icon={<Lock className="w-6 h-6 text-muted-foreground" />}
                        status="LOCKED"
                        active={false}
                        x={mousePos.x}
                        y={mousePos.y}
                        nodeX={window.innerWidth * 0.75}
                        nodeY={window.innerHeight * 0.33}
                    />
                </div>

                {/* Locked Node: Exit */}
                <div className="absolute bottom-1/4 left-1/4">
                    <InteractiveNode
                        title="EMERGENCY EXIT"
                        icon={<Lock className="w-6 h-6 text-muted-foreground" />}
                        status="SEALED"
                        active={false}
                        x={mousePos.x}
                        y={mousePos.y}
                        nodeX={window.innerWidth * 0.25}
                        nodeY={window.innerHeight * 0.75}
                    />
                </div>
            </div>

            {/* Cursor Follower */}
            <div
                className="fixed top-0 left-0 w-8 h-8 border-2 border-white/20 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
            />

            {/* HUD / Overlay Text */}
            <div className="absolute bottom-8 left-8 z-30 font-mono text-xs text-primary/80 animate-pulse">
                SYSTEM_STATUS: CRITICAL FAILURE
                <br />
                OXYGEN_LEVEL: 18%
                <br />
                LIGHTING: AUXILIARY ONLY
            </div>
        </div>
    );
}

function InteractiveNode({ title, icon, status, active, onClick, x, y, nodeX, nodeY }: any) {
    // Calculate distance to reveal content
    const dist = Math.hypot(x - nodeX, y - nodeY);
    const isVisible = dist < 250; // Only visible when flashlight is near

    return (
        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={active ? onClick : undefined}
            className={`
        group relative flex flex-col items-center gap-4 p-6 rounded-xl border backdrop-blur-md
        transition-all duration-300
        ${
            active
                ? "bg-black/40 border-primary/50 hover:bg-primary/10 hover:border-primary hover:scale-105 cursor-pointer"
                : "bg-black/60 border-white/10 cursor-not-allowed grayscale opacity-50"
        }
      `}
            data-testid={`node-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            <div
                className={`
        p-4 rounded-full border-2 
        ${active ? "border-primary bg-primary/20" : "border-white/10 bg-white/5"}
      `}>
                {icon}
            </div>

            <div className="text-center">
                <h3 className="font-mono text-lg font-bold tracking-widest text-white mb-1">
                    {title}
                </h3>
                <span
                    className={`
          text-xs font-mono px-2 py-1 rounded
          ${active ? "bg-primary text-black font-bold" : "bg-white/10 text-white/50"}
        `}>
                    [{status}]
                </span>
            </div>

            {/* Hover Effect Lines */}
            {active && (
                <>
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
            )}
        </motion.button>
    );
}
