import { JSX, useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBar";
import { TopicAndData } from "./TopicAndData/TopicAndData";
import RoomInfoForm from "./RoomInfoForm";
import GeneratingMainImage from "./GeneratingMainImage";
import CreateQuizzes from "./CreateQuizzes";
import PreviewPublish from "./PreviewPublish";
import CreatorConsole from "./CreatorConsole";
import RoomViewer from "./RoomViewer";
import RoomEditor from "./RoomEditor";
import { get_text } from "../../util/language";
import { useUserContext } from "../../contexts/userStyleContext";
import { userType } from "../../components/Login/Login";
import { useSelector } from "react-redux";
type stepInfo = {
    key: number;
    name: string;
    isComplete: boolean;
    component: JSX.Element;
};

export type RoomBuilderStatus = "creating" | "viewing" | "editing";

export const RoomBuilder = () => {
    const [step, setStep] = useState<number>(0);
    const { userLanguage } = useUserContext();
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [roomId, setRoomId] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("");
    const [status, setStatus] = useState<RoomBuilderStatus>("creating");
    const [stepInfo, setStepInfo] = useState<stepInfo[]>([
        {
            key: 0,
            name: get_text("topic_and_data", userLanguage),
            isComplete: false,
            component: <TopicAndData setStep={setStep} setRoomId={setRoomId} roomId={roomId} />,
        },
        {
            key: 1,
            name: get_text("room_info", userLanguage),
            isComplete: false,
            component: <RoomInfoForm setRoomId={setRoomId} roomId={roomId} setStep={setStep} />,
        },
        {
            key: 2,
            name: get_text("gen_image", userLanguage),
            isComplete: false,
            component: <GeneratingMainImage />,
        },
        {
            key: 3,
            name: get_text("create_quizzes", userLanguage),
            isComplete: false,
            component: <CreateQuizzes />,
        },
        {
            key: 4,
            name: get_text("preview_publish", userLanguage),
            isComplete: false,
            component: <PreviewPublish />,
        },
    ]);

    // Handle viewing an existing room
    const handleViewRoom = (id: string, name?: string) => {
        setRoomId(id);
        setRoomName(name || "");
        setStatus("viewing");
    };

    // Handle editing an existing room
    const handleEditRoom = (id: string, name?: string) => {
        setRoomId(id);
        setRoomName(name || "");
        setStatus("editing");
        setStep(0); // Start from the first step when editing
    };

    // Handle creating a new room
    const handleNewRoom = () => {
        setRoomId("");
        setRoomName("");
        setStatus("creating");
        setStep(0);
    };

    useEffect(() => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        // getting all room data if in middle of creating room:
    }, []);
    useEffect(() => {
        setStepInfo((prev) => {
            return prev.map((item, idx) => ({
                ...item,
                isComplete: idx < step,
            }));
        });
    }, [step]);

    return (
        <div className="flex w-full bg-gray-900 min-h-screen pt-16 overflow-x-hidden">
            <div className={`${sidebarOpen ? "w-3/12" : "w-1/12"}`}>
                <CreatorConsole
                    user={userRedux}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                    status={status}
                    handleEditRoom={handleEditRoom}
                    handleNewRoom={handleNewRoom}
                    handleViewRoom={handleViewRoom}
                    roomId={roomId}
                />
            </div>
            <div
                className={`${sidebarOpen ? "w-9/12" : "w-11/12"} text-left flex-col lg:justify-center overflow-x-hidden bg-gray-900`}
                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                {/* Status indicator */}
                <h5
                    className={`mt-8 text-center text-2xl font-bold mb-4 text-white ${userLanguage === "he" ? "text-right mr-14" : "text-left ml-14"}`}
                    dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                            status === "creating"
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                : status === "viewing"
                                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        }`}>
                        {status === "creating"
                            ? get_text("creating_new_room", userLanguage) || "Creating New Room"
                            : status === "viewing"
                              ? get_text("viewing_room", userLanguage) || "Viewing Room"
                              : get_text("editing_room", userLanguage) || "Editing Room"}
                        {(status === "editing" || status === "viewing") &&
                            roomId &&
                            (roomName ? (
                                <span className="text-xs opacity-75">
                                    {roomName}-({roomId.slice(0, 8)}...)
                                </span>
                            ) : (
                                <span className="text-xs opacity-75">
                                    ({roomId.slice(0, 8)}...)
                                </span>
                            ))}
                        {/* {(status === "editing" || status === "viewing") && !roomName  && (
                            <span className="text-xs opacity-75">({roomId.slice(0, 8)}...)</span>
                        )} */}
                    </span>
                </h5>

                {/* Conditional rendering based on status */}
                {status === "creating" && (
                    <>
                        <ProgressBar step={step} setStep={setStep} stepInfo={stepInfo} />
                        <h5
                            className={`mt-8 text-center text-2xl font-bold mb-4 text-white ${userLanguage === "he" ? "text-right mr-14" : "text-left ml-14"}`}
                            dir={userLanguage === "he" ? "rtl" : "ltr"}>
                            {stepInfo[step].name}
                        </h5>
                        <div className="w-full">{stepInfo[step].component}</div>
                    </>
                )}

                {status === "viewing" && roomId && (
                    <div className="w-full h-full">
                        <RoomViewer roomId={roomId} />
                    </div>
                )}

                {status === "editing" && roomId && (
                    <div className="w-full">
                        <RoomEditor roomId={roomId} setStep={setStep} setRoomId={setRoomId} />
                    </div>
                )}
            </div>
        </div>
    );
};
