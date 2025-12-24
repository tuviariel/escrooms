import { JSX, useEffect, useState } from "react";
// import ProgressBar from "../../components/ProgressBar";
import RoomInfoForm from "./RoomInfoForm";
// import GeneratingMainImage from "./GeneratingMainImage";
// import CreateQuizzes from "./CreateQuizzes";
import PreviewPublish from "./PreviewPublish";
import CreatorConsole from "./CreatorConsole";
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

export const RoomBuilder = () => {
    const [step, setStep] = useState<number>(0);
    const { userLanguage } = useUserContext();
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [roomId, setRoomId] = useState<string>("");
    const [stepInfo, setStepInfo] = useState<stepInfo[]>([
        {
            key: 1,
            name: get_text("room_info", userLanguage),
            isComplete: false,
            component: <RoomInfoForm setRoomId={setRoomId} roomId={roomId} setStep={setStep} />,
        },
        // {
        //     key: 2,
        //     name: get_text("gen_image", userLanguage),
        //     isComplete: false,
        //     component: <GeneratingMainImage />,
        // },
        // {
        //     key: 3,
        //     name: get_text("create_quizzes", userLanguage),
        //     isComplete: false,
        //     component: <CreateQuizzes />,
        // },
        {
            key: 4,
            name: get_text("preview_publish", userLanguage),
            isComplete: false,
            component: <PreviewPublish />,
        },
    ]);

    useEffect(() => {
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
                    setStep={setStep}
                    step={step}
                />
            </div>
            <div
                className={`${sidebarOpen ? "w-9/12" : "w-11/12"} text-left flex-col lg:justify-center overflow-x-hidden bg-gray-900`}
                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                <h5
                    className={`mt-8 text-center text-2xl font-bold mb-4 text-white ${userLanguage === "he" ? "text-right mr-14" : "text-left ml-14"}`}
                    dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    {stepInfo[step].name}
                </h5>
                <div className="w-full">{stepInfo[step].component}</div>
            </div>
        </div>
    );
};
