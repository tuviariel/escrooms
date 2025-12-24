import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Settings } from "lucide-react";
import { RoomType } from "../../Dashboard/Dashboard";
import { userType } from "../../../components/Login/Login";
import { roomsService } from "../../../services/service";
import { get_text } from "../../../util/language";
import { useUserContext } from "../../../contexts/userStyleContext";
import RoomCard from "./RoomCard";

type CreatorConsoleProps = {
    user: userType;
    setSidebarOpen: (o: boolean) => void;
    sidebarOpen: boolean;
    setStep: (i: number) => void;
    step: number;
};

export const CreatorConsole = ({
    user,
    setSidebarOpen,
    sidebarOpen,
    setStep,
    step,
}: CreatorConsoleProps) => {
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [openOptions, setOpenOptions] = useState<boolean[]>([]);
    const { userLanguage } = useUserContext();
    useEffect(() => {
        const getUserRooms = async () => {
            console.log(user);
            if (user.id !== "") {
                const userId = user.id;
                const rooms = await roomsService.getRoomByUser(userId);
                console.log(rooms);
                setRooms(rooms);
                setOpenOptions(Array(rooms.length).fill(false));
            } else {
                console.log(user);
            }
        };
        getUserRooms();
    }, []);
    const handleDeleteRoom = (id: string) => {
        // setRooms(rooms.filter((room) => room.id !== id));
        console.log("delete room: " + id);
    };
    const handleOpenDots = (index: number) => {
        setOpenOptions((prev) => {
            const isOpen = prev[index];
            return prev.map((item, i) => (i === index ? !isOpen : item));
        });
    };
    const publishRoom = async (roomId: string, isPublic: boolean) => {
        try {
            const result = await roomsService.updateRoom(roomId, {
                public: isPublic,
            });
            console.log(result);
            if (result) {
                setRooms((prev) => {
                    return prev.map((room) =>
                        room.id === roomId ? { ...room, public: isPublic } : room
                    );
                });
            }
        } catch (error) {
            console.error("room updated no:", error);
        }
    };

    return (
        <div
            className={`fixed ${sidebarOpen ? "w-3/12" : "w-1/12"} bg-gray-800 transition-all duration-300 flex flex-col border-r h-full border-cyan-500/30`}>
            {/* Create New Room Button */}
            <div className="p-3 border-b border-gray-700 flex">
                {step !== 0 && (
                    <button
                        className={`ml-auto bg-cyan-500 text-white hover:bg-cyan-600 h-8 px-3 text-sm cursor-pointer items-center justify-center w-full flex gap-2 p-3 rounded-lg font-semibold transition-colors ${
                            !sidebarOpen && ""
                        }`}
                        onClick={() => {
                            setStep(0);
                        }}>
                        <Plus size={20} />
                        {sidebarOpen && <span>{get_text("new_room", userLanguage)}</span>}
                    </button>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-2 ${sidebarOpen ? "ml-auto" : "mx-auto"} hover:bg-gray-700 rounded-lg transition-colors h-8 text-white`}>
                    {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>
            {/* Header with Toggle Button */}
            <div className="flex items-center justify-between p-4">
                {sidebarOpen && (
                    <h1
                        className={`text-xl font-bold text-white ${userLanguage === "en" ? "text-left" : "text-right"}`}>
                        {get_text("my_rooms", userLanguage)}
                    </h1>
                )}
            </div>

            {/* Room Cards */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
                {rooms.map((room, i) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        i={i}
                        sidebarOpen={sidebarOpen}
                        openOptions={openOptions}
                        handleOpenDots={handleOpenDots}
                        handleDeleteRoom={handleDeleteRoom}
                        publishRoom={publishRoom}
                    />
                ))}
            </div>

            {/* User Options at Bottom */}
            <div className="p-3 border-t border-gray-700 space-y-2">
                <button className="w-full flex items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors text-sm text-white">
                    <Settings size={18} />
                    {sidebarOpen && <span>Settings</span>}
                </button>
            </div>
        </div>

        // {/* Main Content Area
        // <div className="flex-1 p-8">
        //     <h2 className="text-3xl font-bold mb-4">Creator Console</h2>
        //     <p className="text-gray-400">
        //         Select a room from the sidebar to manage your escape rooms.
        //     </p>
        // </div> */}
        // </div>
    );
};
