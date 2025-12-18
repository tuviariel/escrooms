import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRoomContext } from "../../contexts/roomStyleContext";
import { colorPalette } from "../../util/UIstyle";
import backArrow from "../../assets/images/backArrow.svg";
import { get_text } from "../../util/language";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { quizNumberActions } from "../../reduxStor/quizNumber";
import QuizTemplate from "../QuizTemplate";
import { fileStorage, roomsService } from "../../services/service";
import { quizListActions } from "../../reduxStor/quizList";
// import finishedRoomGif from "../../assets/images/finishedRoom.gif";
import { useUserContext } from "../../contexts/userStyleContext";
import { RoomType } from "../Dashboard/Dashboard";
import { CheckCircle2, Lock, Activity, Smartphone } from "lucide-react";

export interface quizDataProps {
    data: {
        _id: string;
        quiz: quizData[];
        name: string;
        mainImage: string;
    };
    index: number;
    back: () => void;
}
export interface quizDataP {
    data: quizData | any;
}
export interface quizData {
    _id: string;
    type: string;
    name: string;
    answer: string;
    quiz: any[];
    quizImg: string | any;
    quizText: string;
    quizData: string[] | any[];
    hints: string[];
}

export const Room = () => {
    const dispatch = useDispatch();
    //redux quizNumber:
    const quiz = useSelector((state: { quizNumber: { quizNumber: number } }) => state.quizNumber);
    const quizNumber = quiz?.quizNumber;
    const setQuizNumber = (number: number) => {
        dispatch(quizNumberActions.changeQuizNumber(number));
        console.log("setQuizNumber", number);
    };
    //redux quizList:
    const quizL = useSelector(
        (state: {
            quizList: {
                list: {
                    id: number;
                    status: string;
                    title: string;
                    answer: string;
                    image: string;
                    x: number;
                    y: number;
                }[];
            };
        }) => state.quizList
    );
    const quizList = quizL?.list;
    const setQuizList = (list: any[]) => {
        dispatch(quizListActions.createQuizList(list));
        console.log("setQuizList", list);
    };

    const { userLanguage } = useUserContext();
    const [checkLeave, setCheckLeave] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [roomData, setRoomData] = useState<RoomType>();
    const [roomQuizzes, setRoomQuizzes] = useState<any[]>([]);
    const [URLMainImage, setURLMainImage] = useState<string>("");
    const [activeModuleId, setActiveModuleId] = useState<number>(1);

    useEffect(() => {
        quizList.map((quiz) => {
            quiz.status === "active" && setActiveModuleId(quiz.id);
        });
    }, [quizList]);
    const navigate = useNavigate();
    const location = useLocation();
    const { setRoomColor, setRoomStyle, setRoomFont, roomColor } = useRoomContext();

    const id = location.pathname.split("/").pop();
    const quizLocation: { x: number; y: number }[] = [
        { x: 50, y: 50 },
        { x: 20, y: 30 },
        { x: 80, y: 40 },
        { x: 20, y: 70 },
        { x: 85, y: 75 },
        { x: 50, y: 80 },
        { x: 70, y: 25 },
        { x: 40, y: 65 },
    ];

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
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
    console.log("Room id:", id);
    useEffect(() => {
        const setRoom = async () => {
            if (!id) return;
            const roomDataFromServer = await roomsService.getRoomById(id);
            // console.log(roomDataFromServer);
            setRoomData(roomDataFromServer[0]);
            const quizzes = await roomDataFromServer[0].quizzes();
            console.log("Fetched quizzes for room:", quizzes);
            const cleanQuizzes = quizzes.data.map((quiz: any) => {
                const updatedHints = parseQuizData(quiz.hints);
                const updatedQuiz = parseQuizData(quiz.quiz);
                return {
                    ...quiz,
                    hints: updatedHints.hints,
                    quiz: updatedQuiz.questions,
                    room: "",
                };
            });
            setRoomQuizzes(cleanQuizzes);
            console.log(cleanQuizzes);
            const list = cleanQuizzes.map((quiz: any, i: number) => {
                return {
                    id: i + 1,
                    status: i === 0 ? "active" : "locked",
                    title: quiz.name,
                    answer: quiz.answer,
                    image: quiz.quizImg,
                    x: quizLocation[i].x,
                    y: quizLocation[i].y,
                };
            });
            console.log("Initializing quiz list:", list);
            setQuizList(list);
            setRoomStyle(roomDataFromServer[0].imageStyle || "");
            setRoomColor(roomDataFromServer[0].colorPalette || "");
            setRoomFont(roomDataFromServer[0].fontFamily || "");
        };
        const parseQuizData = (d: any) => {
            if (typeof d === "object" && d !== null) {
                console.log("1");
                return d;
            }
            const parsed1 = JSON.parse(d);
            if (typeof parsed1 === "object" && parsed1 !== null) {
                console.log(parsed1);
                return parsed1;
            } else {
                console.log("3");
                return JSON.parse(parsed1);
            }
        };
        setRoom();
    }, []);

    const [orientation, setOrientation] = useState(
        window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape"
    );
    useEffect(() => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
        window.matchMedia("(orientation: portrait)").addEventListener("change", (event) => {
            if (event.matches) {
                setOrientation("portrait");
            } else {
                setOrientation("landscape");
            }
        });
        console.log("orientation:", screen.orientation.type);
    }, [screen.orientation.type]);
    useEffect(() => {
        if (quizList && quizList.length > 0) {
            const allCompleted = quizList.every((quiz: any) => quiz.completed);
            if (allCompleted) {
                setCompleted(true);
            }
        }
    }, [quizList]);
    useEffect(() => {
        if (!roomData) return;
        const getUrl = async (mainImage: string | null) => {
            if (!mainImage) return;
            const url = await fileStorage.getFileUrl(mainImage);
            setURLMainImage(url);
        };
        getUrl(roomData.mainImage || "");
    }, [roomData]);
    console.log(roomQuizzes);
    return (
        <>
            {
                <>
                    <div className="h-screen w-screen relative flex justify-center items-center overflow-hidden lg:pt-12 lg:pb-12 bg-gray-900 perspective-1000">
                        {(window.innerWidth < 600 || orientation === "portrait") && (
                            <div className="absolute h-screen w-screen z-90 bg-gray-900 text-white text-center flex flex-col justify-center items-center">
                                {get_text("phone_on_side", userLanguage)}
                                <Smartphone />
                            </div>
                        )}

                        {quizNumber > -1 && (
                            <div className="z-60 w-screen">
                                <img
                                    src={backArrow}
                                    alt={get_text("back_to_main", userLanguage)}
                                    title={get_text("back_to_main", userLanguage)}
                                    className="cursor-pointer h-8 w-8 z-70 md:h-12 md:w-12 fixed left-3 top-3 p-1 rounded-full bg-gray-100 border-2 hover:border-amber-700"
                                    onClick={() => setQuizNumber(-1)}
                                />
                                <QuizTemplate data={roomQuizzes[quizNumber]} />
                            </div>
                        )}

                        <div className="h-full w-full relative bg-gray-900 flex justify-center items-center">
                            <motion.div
                                className="relative w-full h-full"
                                style={{
                                    rotateX,
                                    rotateY,
                                    transformStyle: "preserve-3d",
                                }}>
                                {/* Layer 1: Background */}
                                <motion.div
                                    className={`absolute inset-[-10%] w-[120%] h-[120%] bg-cover bg-center z-0`}
                                    style={{
                                        backgroundImage: `url(${URLMainImage})`,
                                        x: bgX,
                                        y: bgY,
                                        scale: bgScale,
                                        filter: "brightness(1.05) contrast(1.05)",
                                    }}
                                />

                                {/* Layer 2: Atmosphere */}
                                <motion.div
                                    className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-50"
                                    style={{
                                        background:
                                            "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.9) 0%, transparent 60%)",
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
                                    style={{ x: uiX, y: uiY }}>
                                    {quizList.map((module, index) => (
                                        <div
                                            key={module.id}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                            style={{
                                                left: `${module.x}%`,
                                                top: `${module.y}%`,
                                                zIndex: module.id === activeModuleId ? 50 : 10,
                                            }}>
                                            <InteractiveNode
                                                {...module}
                                                isActive={module.id === activeModuleId}
                                                isLocked={module.id > activeModuleId}
                                                isCompleted={module.id < activeModuleId}
                                                total={quizList.length}
                                                onClick={() =>
                                                    // quizList[index].status === "active" &&
                                                    setQuizNumber(quizList[index].id - 1)
                                                }
                                                delay={index * 0.2}
                                                roomColor={roomColor}
                                            />
                                        </div>
                                    ))}

                                    {/* Connecting Lines (SVG Overlay) */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                        <motion.path
                                            d={`M${quizList.map((m) => `${(m.x * window.innerWidth) / 100},${(m.y * window.innerHeight) / 100}`).join(" L")}`}
                                            fill="none"
                                            stroke={
                                                colorPalette[roomColor as keyof typeof colorPalette]
                                                    .dark
                                            }
                                            strokeWidth="3"
                                            strokeDasharray="5,5"
                                            className="text-primary"
                                        />
                                    </svg>
                                </motion.div>

                                {/* HUD */}
                                <HUD
                                    activeId={activeModuleId}
                                    total={quizList.length}
                                    roomColor={roomColor}
                                />
                            </motion.div>
                            {/*
                            {completed && (
                                <>
                                    <img
                                        src={finishedRoomGif}
                                        alt="mainImage"
                                        className="h-full w-auto object-cover z-90 blur-sm opacity-90 absolute top-0"
                                    />
                                    <div
                                        className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-4xl md:text-6xl font-bold text-white bg-opacity-90 rounded-md p-4"
                                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                                        {get_text("room_finished", userLanguage)}
                                    </div>
                                </>
                            )}
                            */}
                        </div>
                        <div
                            className="w-8 h-8 text-center fixed top-3 left-3 rounded-full font-bold z-20 border-2 text-black bg-white hover:text-red-500 hover:border-red-500 cursor-pointer"
                            title={get_text("exit_room", userLanguage)}
                            onClick={() => (!completed ? setCheckLeave(true) : navigate("/"))}>
                            x
                        </div>
                    </div>
                    <Dialog
                        open={checkLeave}
                        setOpen={setCheckLeave}
                        size="small"
                        disableOverlayClose={true}
                        data="">
                        <>
                            <div
                                className="p-4 text-right"
                                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                                <h2 className="text-lg font-semibold mb-2">
                                    {get_text("leave_room", userLanguage)}
                                </h2>
                                <p>{get_text("are_you_sure", userLanguage)}</p>
                            </div>
                            <div className="flex justify-end p-4 border-t">
                                <Button
                                    label={get_text("cancel", userLanguage)}
                                    onClick={() => setCheckLeave(false)}
                                    className="mr-2"
                                />
                                <Button
                                    label={get_text("confirm", userLanguage)}
                                    onClick={() => navigate("/")}
                                />
                            </div>
                        </>
                    </Dialog>
                </>
            }
        </>
    );
};

function InteractiveNode({
    title,
    image,
    isActive,
    isLocked,
    isCompleted,
    id,
    total,
    onClick,
    delay,
    roomColor,
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
      `}>
            {/* Status Ring */}
            <div
                onClick={isActive ? onClick : undefined}
                className={`
        relative p-4 rounded-full border-4 shadow-2xl backdrop-blur-xl
        transition-all duration-500
        ${isActive ? "bg-white border-primary animate-pulse shadow-primary/50" : ""}
        ${isCompleted ? "bg-green-500/20 border-green-500 text-green-600" : ""}
        ${isLocked ? "bg-gray-200/50 border-gray-300 text-gray-400" : ""}
      `}>
                {isCompleted ? (
                    <CheckCircle2 className="w-8 h-8" />
                ) : isLocked ? (
                    <Lock className="w-6 h-6" />
                ) : (
                    <img src={image} alt="" className="w-10 h-10 text-primary" />
                    //<div className="w-8 h-8 text-primary">{icon}</div>
                )}

                {/* Orbiting Particle for Active State */}
                {isActive && (
                    <motion.div
                        onClick={isActive ? onClick : undefined}
                        className="absolute -inset-2 border-2 border-primary/30 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                        <div
                            className="absolute top-0 left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-primary"
                            style={{
                                backgroundColor:
                                    colorPalette[roomColor as keyof typeof colorPalette].dark,
                            }}
                        />
                    </motion.div>
                )}
            </div>

            {/* Label Plate */}
            <div
                onClick={isActive ? onClick : undefined}
                className={`
        -mt-2 px-4 py-2 rounded-lg font-mono font-bold text-sm tracking-widest shadow-lg
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

function HUD({
    activeId,
    total,
    roomColor,
}: {
    activeId: number;
    total: number;
    roomColor: string;
}) {
    const progress = ((activeId - 1) / total) * 100;
    const { userLanguage } = useUserContext();

    return (
        <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-96 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-2 shadow-2xl border border-white/20"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}>
            <div className="flex justify-between items-end mb-2">
                <div className="text-xs font-mono font-bold text-gray-400">
                    {get_text("room_progress", userLanguage)}
                </div>
                <div className="text-2xl font-black text-primary">{Math.round(progress) || 0}%</div>
            </div>

            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full"
                    style={{
                        backgroundColor: colorPalette[roomColor as keyof typeof colorPalette].dark,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                />
            </div>

            <div
                className="mt-4 flex justify-between text-xs font-mono text-gray-500"
                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                <span>{get_text("current_objective", userLanguage)}</span>
                <span className="font-bold text-black flex items-center gap-1">
                    <Activity className="w-3 h-3" /> {get_text("find_quiz_num", userLanguage)}{" "}
                    {activeId}
                </span>
            </div>
        </motion.div>
    );
}

function DustParticle({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const size = Math.random() * 6 + 2;

    const x = useTransform(
        mouseX,
        [-0.5, 0.5],
        [`${-30 * (Math.random() + 0.5)}px`, `${30 * (Math.random() + 0.5)}px`]
    );
    const y = useTransform(
        mouseY,
        [-0.5, 0.5],
        [`${-30 * (Math.random() + 0.5)}px`, `${30 * (Math.random() + 0.5)}px`]
    );

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
                scale: [0.8, 1.2, 0.8],
            }}
            transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}
