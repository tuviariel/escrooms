import { useEffect, useState } from "react";
import first_aid from "../../assets/images/First-aid.jpg";
import { useNavigate } from "react-router";
// import data from "../../services/dummyRoomData";
import type { Schema } from "../../../amplify/data/resource";
// import { quizzes } from "../../services/dummyRoomData";
import GameCard from "../../components/GameCard";
import Loading from "../../assets/images/loading.gif";
import { get_text } from "../../util/language";
// import NavBar from "../../components/Navbar";
import { roomsService } from "../../services/service";
// import { fileStorage } from "../../services/service";
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
    const [roomsList, setRoomsList] = useState<Room[] | undefined>(undefined);
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
        <div className="flex flex-col items-center lg:justify-center mt-12 bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0]">
            <div
                className="font-bold my-8 relative flex flex-col items-center cursor-pointer"
                onClick={() => {
                    navigate("/room/" + "kjbhdfvksjdf");
                }}>
                <img
                    src={first_aid}
                    alt="First-aid"
                    className="w-1/3 lg:w-1/2 rounded-2xl border-red-600 border-4"
                />
                <div className="absolute top-32 md:top-44 right-1/2 translate-1/2 text-4xl md:text-6xl mt-1 md:mt-4 text-red-600">
                    {get_text("first_aid", "he")}
                </div>
            </div>
            {/* uploading file: <input type="file" onChange={(e) => handleUpload(e)} /> */}
            {roomsList && roomsList.length > 0 ? (
                <div className="grid grid-cols-3 gap-10 px-10">
                    {roomsList.map((room) => {
                        return <GameCard key={room.id} data={room} />;
                    })}
                </div>
            ) : errorMessage ? (
                <div>{errorMessage}</div>
            ) : (
                <div className="flex flex-col-reverse">
                    <div>Loading...</div>
                    <img src={Loading} alt="Loading..." className="mx-auto h-24 w-24" />
                </div>
            )}
        </div>
    );
};
