import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Schema } from "../../../amplify/data/resource";
import GameCard from "../../components/GameCard";
import Loading from "../../assets/images/loading.gif";
import { get_text } from "../../util/language";
import dashboardBackground from "../../assets/images/dashboardBackground.png";
import { roomsService, fileStorage, quizService } from "../../services/service"; //fileStorage, quizService,
import { useUserContext } from "../../contexts/userStyleContext";
import { dummyQuizzes as quizzes } from "../../services/dummyRoomData";

export type RoomType = Schema["Room"]["type"];
export interface ListObject {
    id: string;
    name: string;
    coverImage: string | null;
    description: string | null;
    updatedAt: string | null;
}
/**
 * Dashboard page- currently the apps main page ('/' route)
 * @param props none. Gets data by calling the Rooms API.
 * @returns the main dashboard page with sub components.
 */

export const Dashboard = () => {
    const navigate = useNavigate();
    const [roomsList, setRoomsList] = useState<ListObject[] | undefined>(undefined);
    const { userLanguage } = useUserContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        const getRooms = async () => {
            //getting all rooms:
            try {
                const rooms = await roomsService.listRooms();
                console.log("Fetched rooms:", rooms);
                if (rooms?.length === 0) {
                    setErrorMessage("No Escape-Rooms found");
                } else {
                    setRoomsList(rooms);
                }
            } catch (errors) {
                console.error("Error fetching rooms:", errors);
                setErrorMessage("Error fetching Escape-Rooms");
            }
        };
        getRooms();
    }, []);
    useEffect(() => {
        document.title = get_text("ai_escape_rooms", userLanguage);
    }, [userLanguage]);

    const createRoom = async (e: React.ChangeEvent<HTMLInputElement>) => {
        //auto creating a full first-aid room with quizzes from dummy data by uploading the main image:
        console.log("creating room...");
        try {
            const result = await roomsService.createRoom({
                creatorId: "403cc9cc-d011-7073-5948-fd2fd17a9b28",
                name: "עזרה ראשונה",
                mainImage: "", //make sure image begins with "main"
                coverImage: "", //make sure image begins with "cover"
                colorPalette: "blueToRed",
                imageStyle: "realistic",
                fontFamily: "sansSerif",
                public: true,
                completed: "completed",
                description: "משחק חינוכי ללימוד על עזרה ראשונה",
            });
            console.log("Room created:", result);
            if (result && result.id && e.target.files && e.target.files.length > 0) {
                // Upload multiple files
                const filesArray = Array.from(e.target.files);
                const res = await fileStorage.uploadFiles(filesArray, result.id);
                console.log("Files uploaded successfully:", res);
                if (res && res.length > 0) {
                    // uploading 2 files as images- one beginning with "main" and one beginning with "cover"...
                    const result2 = await roomsService.updateRoom(result.id, {
                        mainImage: `images/${result.id}/${filesArray.find((file) => file.name.startsWith("main"))?.name}`,
                        coverImage: `images/${result.id}/${filesArray.find((file) => file.name.startsWith("cover"))?.name}`,
                    });
                    console.log("updated room:", result2);
                    for (const q of quizzes) {
                        q.roomId = result.id;
                        const cleanQuiz = JSON.stringify(q.quiz);
                        q.quiz = cleanQuiz as any;
                        const cleanHints = JSON.stringify(q.hints);
                        q.hints = cleanHints as any;
                        const responseQuiz = await quizService.createQuiz(q);
                        console.log("Creating quiz with data:", q);
                        if (responseQuiz) {
                            console.log("Quiz created:", responseQuiz);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    return (
        <div
            className="min-h-screen pt-16 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${dashboardBackground})` }}>
            {/* Hero Section */}
            <section className="relative mt-20 flex items-center justify-center overflow-hidden">
                {/* Hero Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <h3
                        className="text-1xl md:text-3xl font-bold text-white mb-6 leading-tight mx-24"
                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                        {get_text("hero_title", userLanguage)}
                    </h3>
                    {/* <input type="file" multiple onChange={createRoom} className="" /> */}
                    <p
                        className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
                        dir={userLanguage === "he" ? "rtl" : "ltr"}>
                        {get_text("hero_subtitle", userLanguage)}
                    </p>
                    <button
                        onClick={() => navigate("/room-builder")}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-8 py-4 rounded-full text-3xl transition-colors shadow-4xl drop-shadow-orange-500 shadow-orange-500">
                        {get_text("start_creating_free", userLanguage)}
                    </button>
                </div>
            </section>

            {/* My Recent Games Section */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <h2
                    className="text-3xl font-bold text-white mb-8"
                    dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    {get_text("my_recent_games", userLanguage)}
                </h2>
                {roomsList && roomsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {roomsList.map((room) => {
                            return <GameCard key={room.id} data={room} />;
                        })}
                    </div>
                ) : errorMessage ? (
                    <div className="text-white">{errorMessage}</div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <img src={Loading} alt="Loading..." className="h-24 w-24 mb-4" />
                        <div className="text-white" dir={userLanguage === "he" ? "rtl" : "ltr"}>
                            {get_text("loading", userLanguage)}
                        </div>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 border-t border-cyan-500/20 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">👋</span>
                            </div>
                            <h3 className="text-white font-semibold mb-2">
                                {get_text("easy_to_use", userLanguage)}
                            </h3>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔧</span>
                            </div>
                            <h3 className="text-white font-semibold mb-2">
                                {get_text("full_customization", userLanguage)}
                            </h3>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h3 className="text-white font-semibold mb-2">
                                {get_text("mobile_adapted", userLanguage)}
                            </h3>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mb-6">
                        <a
                            href="https://chat.whatsapp.com/IpUsLQiRGnTBgLnF02xLzs"
                            className="text-cyan-400 hover:text-cyan-300">
                            <span className="text-2xl">📘</span>
                        </a>
                        <a href="#" className="text-cyan-400 hover:text-cyan-300">
                            <span className="text-2xl">📷</span>
                        </a>
                        <a href="#" className="text-cyan-400 hover:text-cyan-300">
                            <span className="text-2xl">📺</span>
                        </a>
                        <a href="#" className="text-cyan-400 hover:text-cyan-300">
                            <span className="text-2xl">🎵</span>
                        </a>
                    </div>
                    <div className="text-center text-gray-400 text-sm">
                        © 2025 ויברח. כל הזכויות שמורות.
                    </div>
                </div>
            </footer>
        </div>
    );
};
