import { JSX, useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBar";
import RoomInfoForm from "./RoomInfoForm";
import GeneratingMainImage from "./GeneratingMainImage";
import CreateQuizzes from "./CreateQuizzes";
import PreviewPublish from "./PreviewPublish";
import { get_text } from "../../util/language";
import { useUserContext } from "../../contexts/userStyleContext";
import Prev from "../../assets/images/pagePaginate.svg";
type stepInfo = {
    key: number;
    name: string;
    isComplete: boolean;
    component: JSX.Element;
};

export const RoomBuilder = () => {
    const [step, setStep] = useState<number>(0);
    const { userLanguage } = useUserContext();
    const [roomId, setRoomId] = useState<string>("");
    const [stepInfo, setStepInfo] = useState<stepInfo[]>([
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
        <div className="text-left flex flex-col lg:justify-center">
            <div className="fixed top-0 w-full mt-12 bg-white z-30">
                <h5 className="text-center text-3xl">{get_text("creating_room", userLanguage)}</h5>
                <ProgressBar step={step} setStep={setStep} stepInfo={stepInfo} className="" />
            </div>
            <div className="h-48 bg-white"></div>
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
            )}
            <h5
                className={`text-2xl font-bold mb-4 mx-20 ${userLanguage === "he" ? "text-right" : "text-left"} `}
                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                {stepInfo[step].name}
            </h5>
            {stepInfo[step].component}
        </div>
    );
};
