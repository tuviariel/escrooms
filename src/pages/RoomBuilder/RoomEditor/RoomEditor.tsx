import { useEffect, useState } from "react";
import { roomsService } from "../../../services/service";
import { RoomType } from "../../Dashboard/Dashboard";
// import { TopicAndData } from "../TopicAndData/TopicAndData";
// import RoomInfoForm from "../RoomInfoForm/RoomInfoForm";
// import GeneratingMainImage from "../GeneratingMainImage/GeneratingMainImage";
// import CreateQuizzes from "../CreateQuizzes/CreateQuizzes";
// import PreviewPublish from "../PreviewPublish/PreviewPublish";
// import ProgressBar from "../../../components/ProgressBar";
// import { get_text } from "../../../util/language";
import { useUserContext } from "../../../contexts/userStyleContext";
// import { quizData } from "../../Room/Room";
import { get_text } from "../../../util/language";
import { stepType } from "../RoomBuilder";

type RoomEditorProps = {
    roomId: string;
    setStep: (step: stepType) => void;
    setRoomId: (id: string) => void;
};

// type stepInfo = {
//     key: number;
//     name: string;
//     isComplete: boolean;
//     component: JSX.Element;
// };

/**
 * RoomEditor component for editing an escape room
 * Shows all editing steps with the ability to edit every element
 */
export const RoomEditor = ({ roomId, setStep, setRoomId }: RoomEditorProps) => {
    const [roomData, setRoomData] = useState<RoomType | null>(null);
    // const [roomQuizzes, setRoomQuizzes] = useState<quizData[] | any[]>([]);
    const [loading, setLoading] = useState(true);
    // const [step, setLocalStep] = useState<number>(0);
    const { userLanguage } = useUserContext();
    console.log(setStep, setRoomId);
    // const stepInfo: stepInfo[] = [
    //     {
    //         key: 0,
    //         name: get_text("topic_and_data", userLanguage),
    //         isComplete: false,
    //         component: (
    //             <TopicAndData setStep={setLocalStep} setRoomId={setRoomId} roomId={roomId} />
    //         ),
    //     },
    //     {
    //         key: 1,
    //         name: get_text("room_info", userLanguage),
    //         isComplete: false,
    //         component: (
    //             <RoomInfoForm setRoomId={setRoomId} roomId={roomId} setStep={setLocalStep} />
    //         ),
    //     },
    //     {
    //         key: 2,
    //         name: get_text("gen_image", userLanguage),
    //         isComplete: false,
    //         component: <GeneratingMainImage />,
    //     },
    //     {
    //         key: 3,
    //         name: get_text("create_quizzes", userLanguage),
    //         isComplete: false,
    //         component: <CreateQuizzes />,
    //     },
    //     {
    //         key: 4,
    //         name: get_text("preview_publish", userLanguage),
    //         isComplete: false,
    //         component: <PreviewPublish />,
    //     },
    // ];

    useEffect(() => {
        const loadRoom = async () => {
            if (!roomId) return;
            try {
                const rooms = await roomsService.getRoomById(roomId);
                if (rooms && rooms[0]) {
                    setRoomData(rooms[0]);
                    // setRoomQuizzes(rooms[0].quizzes());
                }
            } catch (error) {
                console.error("Error loading room:", error);
            } finally {
                setLoading(false);
            }
        };
        loadRoom();
    }, [roomId]);

    // Sync local step with parent step
    // RoomEditor manages its own step state internally
    console.log(roomData);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                {get_text("loading", userLanguage)}
            </div>
        );
    }

    if (!roomData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                {get_text("room_not_found", userLanguage)}
            </div>
        );
    }
    return (
        <div className="w-full">
            {/* <ProgressBar step={step} setStep={setLocalStep} stepInfo={stepInfo} /> */}
            <h5
                className={`mt-8 text-center text-2xl font-bold mb-4 text-white ${userLanguage === "he" ? "text-right mr-14" : "text-left ml-14"}`}
                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                {/* {stepInfo[step].name} */}Editing Room Data- Yet to come...
            </h5>
            {/* <div className="w-full">{stepInfo[step].component}</div> */}
        </div>
    );
};
