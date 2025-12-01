import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { Schema } from "../../../amplify/data/resource";
import GameCard from "../../components/GameCard";
import Loading from "../../assets/images/loading.gif";
import { get_text } from "../../util/language";
import { roomsService } from "../../services/service";
// import { fileStorage } from "../../services/service";
import { useUserContext } from "../../contexts/userStyleContext";

export type Room = Schema["Room"]["type"];
export interface ListObject {
    id: string;
    name: string;
    mainImage: string | null;
    description: string | null;
}
/**
 * Dashboard page- currently the apps main page ('/' route)
 * @param props none. Gets data by calling the Rooms API.
 * @returns the main dashboard page with sub components.
 */

export const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [roomsList, setRoomsList] = useState<Room[] | undefined>(undefined);
    const { userLanguage } = useUserContext();
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        const getRooms = async () => {
            // if (!user) return;
            // console.log(quizzes);
            // console.log("Fetching rooms from DataStore...");
            // console.log("client:", client);
            // console.log("client.mutations:", client.mutations);
            // console.log("client.models:", client.models);
            // console.log("Quiz model:", client.models?.Quiz);
            // const selectionSet = ["roomId", "name", "description", "mainImage"] as const; //{selectionSet}

            //deleting room:
            // const rooms = await roomsService.deleteRoom("c9e8aeb8-01f1-43cc-b494-cde58418e7db");
            // console.log("Fetched rooms:", rooms);

            //getting all rooms:
            try {
                const rooms = await roomsService.listRooms();
                console.log("Fetched rooms:", rooms);
                setRoomsList(rooms);
            } catch (errors) {
                console.error("Error fetching rooms:", errors);
                setErrorMessage("Error fetching Escape-Rooms");
            }

            // const quizIds: string[] = [];
            // const quizData = quizzes;

            // --- quizzes create:
            // try {
            //     for (const q of quizzes) {
            //         q.roomId = "3b0c95f3-20ad-486c-9e54-8d16f48db39c";
            //         const cleanQuiz = JSON.stringify(q.quiz);
            //         q.quiz = cleanQuiz as any;
            //         const cleanHints = JSON.stringify(q.hints);
            //         q.hints = cleanHints as any;
            //         const quizy = await client.models.Quiz.create(q);
            //         console.log("Creating quiz with data:", q);
            //         if (quizy) {
            //             // quizIds.push(quiz.id);
            //             console.log("Quiz created:", quizy);
            //         }
            //     }
            // } catch (errors) {
            //     console.error("Error creating quiz:", errors);
            // }

            // --- room create:
            // try {
            //     const result = await client.models.Room.create({
            //         creatorId: user.userId || "d06c890c-d061-7063-e269-9e3040f72e67",
            //         name: "עזרה ראשונה",
            //         mainImage: MainFirstAid ?? null,
            //         colorPalette: "redBlueGray",
            //         imageStyle: "realistic",
            //         fontFamily: "sansSerif",
            //         description: "משחק חינוכי ללימוד על עזרה ראשונה",
            //     });

            // --- room update:
            // try {
            //     console.log("updating room...");
            //     const result = await roomsService.updateRoom(
            //         "3b0c95f3-20ad-486c-9e54-8d16f48db39c",
            //         { mainImage: "images/3b0c95f3-20ad-486c-9e54-8d16f48db39c/First-aid.jpg" }
            //     );
            //     // creatorId: "d06c890c-d061-7063-e269-9e3040f72e67",
            //     // name: "עזרה ראשונה",
            //     // mainImage: "images/3b0c95f3-20ad-486c-9e54-8d16f48db39c/First-aid.jpg",
            //     // colorPalette: "redBlueGray",
            //     // imageStyle: "realistic",
            //     // fontFamily: "sansSerif",
            //     // description: "משחק חינוכי ללימוד על עזרה ראשונה",
            //     // });
            //     console.log("updating room...", result);
            //     if (result) {
            //         console.log("room updated:", result);
            //     }
            // } catch (error) {
            //     console.error("room updated no:", error);
            // }

            // console.log("Game created:", rooms);
        };
        getRooms();
    }, []);
    //uploading file- image:
    // const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (!e.target.files?.[0]) return;
    //     fileStorage
    //         .uploadFile(e.target.files[0], "3b0c95f3-20ad-486c-9e54-8d16f48db39c")
    //         .then((res) => {
    //             console.log("File uploaded successfully:", res);
    //         })
    //         .catch((err) => {
    //             console.error("Error uploading file:", err);
    //         });
    // };
    return (
        <div className="flex w-screen">
            <div className="mx-auto flex flex-col items-center text-center lg:justify-center mt-12 bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0]">
                {location && location.pathname === "/home" && (
                    <section
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
                        onClick={() => navigate("/room-builder")}>
                        <div className="bg-teal-600 rounded-2xl p-12 text-white shadow-2xl">
                            <h2 className="mb-4">{get_text("build_room", userLanguage)}</h2>
                            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                                {get_text("build_room_explanation", userLanguage)}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                    {/* <Clock className="w-8 h-8 mb-3" /> */}
                                    <h3 className="text-white mb-2">
                                        {get_text("quick_creation", userLanguage)}
                                    </h3>
                                    <p className="text-purple-100 text-sm">
                                        {get_text("quick_creation_explanation", userLanguage)}
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                    {/* <Users className="w-8 h-8 mb-3" /> */}
                                    <h3 className="text-white mb-2">
                                        {get_text("share_publicly", userLanguage)}
                                    </h3>
                                    <p className="text-purple-100 text-sm">
                                        {get_text("share_publicly_explanation", userLanguage)}
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                    {/* <Trophy className="w-8 h-8 mb-3" /> */}
                                    <h3 className="text-white mb-2">
                                        {get_text("ai_powered", userLanguage)}
                                    </h3>
                                    <p className="text-purple-100 text-sm">
                                        {get_text("ai_powered_explanation", userLanguage)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
                {/* uploading file: <input type="file" onChange={(e) => handleUpload(e)} /> */}
                {roomsList && roomsList.length > 0 ? (
                    <div className="grid grid-cols-3 gap-10 px-10 my-12 lg:my-24">
                        {roomsList.map((room) => {
                            return <GameCard key={room.id} data={room} />;
                        })}
                    </div>
                ) : errorMessage ? (
                    <div>{errorMessage}</div>
                ) : (
                    <div className="flex flex-col-reverse">
                        <div>{get_text("loading", userLanguage)}</div>
                        <img src={Loading} alt="Loading..." className="mx-auto h-24 w-24" />
                    </div>
                )}
            </div>
        </div>
    );
};
