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
        <div className="flex w-screen">
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
                className={`${sidebarOpen ? "w-9/12" : "w-11/12"} text-left flex-col lg:justify-center overflow-x-hidden"`}
                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                {/* <div
                    className={`fixed ${sidebarOpen ? "w-9/12" : "w-11/12"} mt-12 bg-white border-b border-cyan-700 z-30`}>
                    <h5 className="text-center text-3xl">
                        {get_text("creating_room", userLanguage)}
                    </h5>
                    <ProgressBar step={step} setStep={setStep} stepInfo={stepInfo} className="" />
                </div>
                <div className={`${sidebarOpen ? "w-9/12" : "w-11/12"} h-48 bg-white`}></div>
                {step > 0 && (
                    <button
                        className={`bg-teal-400 py-2 px-4 rounded-full border-2 border-gray-700 flex ${userLanguage === "he" ? "ml-auto mr-5 flex-row-reverse" : "mr-auto ml-5"}`}
                        onClick={() => setStep((prev) => (prev > 0 ? prev - 1 : prev))}
                        disabled={step === 0}>
                        <img
                            src={Prev}
                            alt="back"
                            className={`${userLanguage === "he" ? "rotate-180" : ""} h-6 w-auto`}
                        />
                        {get_text("prev_page", userLanguage)}
                    </button>
                )} */}
                <h5
                    className={`mt-22 text-center text-2xl font-bold mb-4 ${userLanguage === "he" ? "text-right mr-14" : "text-left ml-14"} `}
                    dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    {stepInfo[step].name}
                </h5>
                <div className={sidebarOpen ? "w-9/12" : "w-11/12"}>{stepInfo[step].component}</div>
            </div>
        </div>
    );
};
