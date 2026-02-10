import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ProgressBar from "../../components/ProgressBar";
import { TopicAndData } from "./TopicAndData/TopicAndData";
// import RoomInfoForm from "./RoomInfoForm";
// import GeneratingMainImage from "./GeneratingMainImage";
import CreateQuizzes from "./CreateQuizzes";
import PreviewPublish from "./PreviewPublish";
import CreatorConsole from "./CreatorConsole";
import RoomViewer from "./RoomViewer";
// import RoomEditor from "./RoomEditor";
import { get_text } from "../../util/language";
import { useUserContext } from "../../contexts/userStyleContext";
import { userType } from "../../components/Login/Login";
import { useSelector } from "react-redux";
import loadingSpinner from "../../assets/images/loading.gif";

export type stepType =
    | "topic_and_data"
    | "room_info"
    | "generating_main_image"
    | "create_quizzes"
    | "preview_publish"
    | "completed";
export type stepInfoType = {
    [key: string]: {
        key: number;
        name: string;
        isComplete: boolean;
        duration: number;
        sections: number;
    };
};

export type RoomBuilderStatus = "creating" | "viewing" | "editing" | "starting";

export type subTopicsType = {
    name: string;
    mysterious_name: string;
    content: string;
    quiz_type: string;
    explanation: string;
    used: boolean;
}[];

export const RoomBuilder = () => {
    const location = useLocation();
    const [roomId, setRoomId] = useState<string>(
        location.search.includes("roomId") ? location.search.split("roomId=")[1] : "",
    );
    const [step, setStep] = useState<stepType>(
        location.search.includes("roomId") ? "create_quizzes" : "topic_and_data",
    );
    const { userLanguage } = useUserContext();
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [roomName, setRoomName] = useState<string>("");
    const [status, setStatus] = useState<RoomBuilderStatus>(
        location.search.includes("roomId") ? "editing" : "creating",
    );
    const [subTopics, setSubTopics] = useState<subTopicsType>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [stepInfo, setStepInfo] = useState<stepInfoType>({
        topic_and_data: {
            key: 0,
            name: get_text("topic_and_data", userLanguage),
            isComplete: false,
            duration: 60,
            sections: 1,
        },
        // room_info: {
        //     key: 1,
        //     name: get_text("room_info", userLanguage),
        //     isComplete: false,
        //     duration: 60,
        //     component: <RoomInfoForm roomId={roomId} subTopics={subTopics} />,
        // },
        // generating_main_image: {
        //     key: 2,
        //     duration: 60,
        //     name: get_text("gen_image", userLanguage),
        //     isComplete: false,
        //     component: <GeneratingMainImage />,
        // },
        create_quizzes: {
            key: 1,
            name: get_text("create_quizzes", userLanguage),
            isComplete: false,
            duration: 15,
            sections: 6,
        },
        // preview_publish: {
        //     key: 2,
        //     name: get_text("preview_publish", userLanguage),
        //     isComplete: false,
        //     duration: 0,
        //     sections: 1,
        // },
    });
    const handleMainShow = (
        status: RoomBuilderStatus,
        step: stepType,
        id?: string,
        name?: string,
    ) => {
        console.log(
            "in handleMainShow: status-" +
                status +
                ", step-" +
                step +
                ", id-" +
                id +
                ", name-" +
                name,
        );
        if (status === "starting") {
            setStep("topic_and_data");
            setStatus("creating");
            setRoomId("");
            setRoomName("");
            setSubTopics([]);
            setStepInfo((prev: stepInfoType) => {
                const resetStepInfo: stepInfoType = {} as stepInfoType;
                Object.keys(prev).forEach((k) => {
                    resetStepInfo[k as stepType] = {
                        ...prev[k as stepType],
                        isComplete: false,
                    };
                });
                return resetStepInfo;
            });
        } else {
            setStatus(status);
            setStepInfo((prev: stepInfoType) => {
                // Mark current step as complete
                const updatedStepInfo = {
                    ...prev,
                    [step]: {
                        ...prev[step],
                        isComplete: true,
                    },
                };
                // Find the key of the next step
                const currentKey = prev[step].key;
                // Find next step name by key
                const nextStepName = Object.keys(updatedStepInfo).find(
                    (k) => updatedStepInfo[k as stepType].key === currentKey + 1,
                ) as stepType | undefined;
                if (nextStepName) {
                    setStep(nextStepName);
                }
                return updatedStepInfo;
            });
            setRoomId(id || "");
            setRoomName(name || "");
            setSubTopics([]);
        }
    };

    useEffect(() => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        // getting all room data if in middle of creating room:
    }, []);
    useEffect(() => {
        setStepInfo((prev) => {
            return {
                ...prev,
                [step]: {
                    ...prev[step],
                    isComplete: true,
                },
            };
        });
        // Remove query params from the URL when entering the "topic_and_data" step
        if (location.search.includes("roomId")) {
            window.history.replaceState({}, "", location.pathname);
        }
    }, [step]);
    // console.log("subTopics:", subTopics);

    return (
        <div className="flex w-full bg-gray-900 min-h-screen pt-16 overflow-x-hidden">
            <div className={`${sidebarOpen ? "w-3/12" : "w-1/12"}`}>
                <CreatorConsole
                    user={userRedux}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                    status={status}
                    step={step}
                    handleMainShow={handleMainShow}
                    roomId={roomId}
                />
            </div>
            <div
                className={`${sidebarOpen ? "w-9/12" : "w-11/12"} text-left flex-col lg:justify-center overflow-x-hidden bg-gray-900`}
                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                {/* Status indicator */}
                <h5
                    className={`${status === "creating" ? "mt-22" : "mt-8"} text-center text-2xl font-bold mb-4 text-white ${userLanguage === "he" ? "text-right mr-14" : "text-left ml-14"}`}
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
                    <div className="relative">
                        <div
                            className={`${sidebarOpen ? "w-9/12" : "w-11/12"} fixed top-16 z-10 bg-gray-900`}>
                            <ProgressBar
                                step={step}
                                setStep={setStep}
                                stepInfo={stepInfo}
                                loading={loading}
                                roomId={roomId}
                            />
                        </div>
                        <h5
                            className={`mt-8 text-center text-2xl font-bold mb-4 text-white ${userLanguage === "he" ? "text-right mr-14" : "text-left ml-14"}`}
                            dir={userLanguage === "he" ? "rtl" : "ltr"}>
                            {stepInfo[step].name}
                        </h5>
                        <div className="w-full">
                            {stepInfo[step].name === get_text("create_quizzes", userLanguage) ? (
                                <CreateQuizzes
                                    // setStep={setStep}
                                    roomId={roomId}
                                    roomName={roomName}
                                    subTopics={subTopics}
                                    setSubTopics={setSubTopics}
                                    setLoading={setLoading}
                                    loading={loading}
                                    status={status}
                                />
                            ) : stepInfo[step].name === get_text("topic_and_data", userLanguage) ? (
                                <TopicAndData
                                    setStep={setStep}
                                    setRoomId={setRoomId}
                                    setSubTopics={setSubTopics}
                                    setLoading={setLoading}
                                    loading={loading}
                                />
                            ) : stepInfo[step].name ===
                              get_text("preview_publish", userLanguage) ? (
                                <PreviewPublish />
                            ) : null}
                        </div>
                        {loading && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-80 h-full w-full flex items-center justify-center ">
                                <img
                                    src={loadingSpinner}
                                    alt="loading"
                                    title="Loading..."
                                    className="w-32 h-32 m-auto animate-spin"
                                />
                            </div>
                        )}
                    </div>
                )}

                {status === "viewing" && roomId && (
                    <div className="w-full h-full">
                        <RoomViewer roomId={roomId} />
                    </div>
                )}

                {status === "editing" && roomId && (
                    <div className="w-full">
                        <CreateQuizzes
                            // setStep={setStep}
                            roomId={roomId}
                            roomName={roomName}
                            subTopics={subTopics}
                            setSubTopics={setSubTopics}
                            setLoading={setLoading}
                            loading={loading}
                            status={status}
                        />
                        {/* <RoomEditor roomId={roomId} setStep={setStep} setRoomId={setRoomId} /> */}
                    </div>
                )}
            </div>
        </div>
    );
};
