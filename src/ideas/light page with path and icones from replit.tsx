import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Lock, Activity, Sun, CheckCircle2, HeartPulse, Zap, Bandage, Pill, DoorOpen, ArrowRight } from "lucide-react";
import roomBg from "@assets/generated_images/bright_sunlit_medical_room.png";

// Quiz Modules Configuration
const QUIZ_MODULES = [
  { id: 1, title: "TRIAGE", icon: <Activity />, x: 50, y: 50, status: "active" },
  { id: 2, title: "CPR", icon: <HeartPulse />, x: 20, y: 30, status: "locked" },
  { id: 3, title: "DEFIB", icon: <Zap />, x: 80, y: 40, status: "locked" },
  { id: 4, title: "WOUNDS", icon: <Bandage />, x: 15, y: 70, status: "locked" },
  { id: 5, title: "MEDS", icon: <Pill />, x: 85, y: 75, status: "locked" },
  { id: 6, title: "EVAC", icon: <DoorOpen />, x: 50, y: 85, status: "locked" },
];

export default function RoomHub() {
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModuleId, setActiveModuleId] = useState(1); // Simulate progress

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the movement
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Extreme Parallax Transforms
  const bgX = useTransform(springX, [-0.5, 0.5], ["5%", "-5%"]);
  const bgY = useTransform(springY, [-0.5, 0.5], ["5%", "-5%"]);
  const bgScale = useTransform(springY, [-0.5, 0.5], [1.1, 1.15]);

  const uiX = useTransform(springX, [-0.5, 0.5], ["-3%", "3%"]);
  const uiY = useTransform(springY, [-0.5, 0.5], ["-3%", "3%"]);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-3deg", "3deg"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-white perspective-1000"
      data-testid="room-hub"
    >
      <motion.div 
        className="relative w-full h-full"
        style={{ 
          rotateX, 
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Layer 1: Background */}
        <motion.div 
          className="absolute inset-[-10%] w-[120%] h-[120%] bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url(${roomBg})`,
            x: bgX,
            y: bgY,
            scale: bgScale,
            filter: "brightness(1.05) contrast(1.05)"
          }}
        />

        {/* Layer 2: Atmosphere */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-50"
          style={{
            background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.9) 0%, transparent 60%)",
            x: useTransform(springX, [-0.5, 0.5], ["1%", "-1%"]),
          }}
        />

        {/* Layer 3: Dust */}
        <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <DustParticle key={i} mouseX={springX} mouseY={springY} />
          ))}
        </div>

        {/* Layer 4: Modules */}
        <motion.div 
          className="absolute inset-0 z-20"
          style={{ x: uiX, y: uiY }}
        >
          {QUIZ_MODULES.map((module, index) => (
            <div 
              key={module.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${module.x}%`, 
                top: `${module.y}%`,
                zIndex: module.id === activeModuleId ? 50 : 10
              }}
            >
              <InteractiveNode 
                {...module}
                isActive={module.id === activeModuleId}
                isLocked={module.id > activeModuleId}
                isCompleted={module.id < activeModuleId}
                total={QUIZ_MODULES.length}
                onClick={() => setLocation("/quiz/first-aid")}
                delay={index * 0.1}
              />
            </div>
          ))}
          
          {/* Connecting Lines (SVG Overlay) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
             <motion.path
               d={`M${QUIZ_MODULES.map(m => `${m.x * window.innerWidth / 100},${m.y * window.innerHeight / 100}`).join(" L")}`}
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeDasharray="5,5"
               className="text-primary"
             />
          </svg>
        </motion.div>

        {/* HUD */}
        <HUD activeId={activeModuleId} total={QUIZ_MODULES.length} />
      </motion.div>
    </div>
  );
}

function InteractiveNode({ 
  title, 
  icon, 
  isActive, 
  isLocked, 
  isCompleted,
  id,
  total,
  onClick,
  delay
}: any) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring" }}
      onClick={isActive ? onClick : undefined}
      className={`
        group relative flex flex-col items-center justify-center
        transition-all duration-500
        ${isActive ? "scale-125 z-50" : "scale-90 grayscale hover:grayscale-0"}
        ${isLocked ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"}
      `}
    >
      {/* Status Ring */}
      <div className={`
        relative p-4 rounded-full border-4 shadow-2xl backdrop-blur-xl
        transition-all duration-500
        ${isActive ? "bg-white border-primary animate-pulse shadow-primary/50" : ""}
        ${isCompleted ? "bg-green-500/20 border-green-500 text-green-600" : ""}
        ${isLocked ? "bg-gray-200/50 border-gray-300 text-gray-400" : ""}
      `}>
        {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : 
         isLocked ? <Lock className="w-6 h-6" /> : 
         React.cloneElement(icon, { className: "w-8 h-8 text-primary" })}
        
        {/* Orbiting Particle for Active State */}
        {isActive && (
          <motion.div 
            className="absolute inset-[-8px] border-2 border-primary/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-primary" />
          </motion.div>
        )}
      </div>

      {/* Label Plate */}
      <div className={`
        mt-4 px-4 py-2 rounded-lg font-mono font-bold text-sm tracking-widest shadow-lg
        transition-all duration-300
        ${isActive ? "bg-primary text-white translate-y-0 opacity-100" : "bg-white/80 text-gray-500 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"}
      `}>
        {id < 10 ? `0${id}` : id} // {title}
      </div>
      
      {/* Connecting Line Stub */}
      {!isLocked && id < total && (
        <div className="absolute top-full left-1/2 w-0.5 h-8 bg-primary/20 -z-10 origin-top" />
      )}
    </motion.button>
  );
}

function HUD({ activeId, total }: { activeId: number, total: number }) {
  const progress = (activeId / total) * 100;

  return (
    <motion.div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-96 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex justify-between items-end mb-2">
        <div className="text-xs font-mono font-bold text-gray-400">ESCAPE PROGRESS</div>
        <div className="text-2xl font-black text-primary">{Math.round(progress)}%</div>
      </div>
      
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "circOut" }}
        />
      </div>

      <div className="mt-4 flex justify-between text-xs font-mono text-gray-500">
        <span>CURRENT OBJECTIVE:</span>
        <span className="font-bold text-black flex items-center gap-1">
          <Activity className="w-3 h-3" /> FIND MODULE 0{activeId}
        </span>
      </div>
    </motion.div>
  );
}

function DustParticle({ mouseX, mouseY }: { mouseX: any, mouseY: any }) {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const size = Math.random() * 6 + 2;
  
  const x = useTransform(mouseX, [-0.5, 0.5], [`${-30 * (Math.random() + 0.5)}px`, `${30 * (Math.random() + 0.5)}px`]);
  const y = useTransform(mouseY, [-0.5, 0.5], [`${-30 * (Math.random() + 0.5)}px`, `${30 * (Math.random() + 0.5)}px`]);

  return (
    <motion.div
      className="absolute rounded-full bg-white shadow-white/50 shadow-lg pointer-events-none"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        width: size,
        height: size,
        x,
        y,
      }}
      animate={{
        y: [0, -150, 0],
        opacity: [0, 0.8, 0],
        scale: [0.8, 1.2, 0.8]
      }}
      transition={{
        duration: Math.random() * 8 + 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}
