import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Gift, HelpCircle, MessageCircle, Plus } from "lucide-react";
import { RoomType } from "../../Dashboard/Dashboard";
import { userType } from "../../../components/Login/Login";
import { roomsService } from "../../../services/service";
import { get_text } from "../../../util/language";
import { useUserContext } from "../../../contexts/userStyleContext";
import RoomCard from "./RoomCard";
import { RoomBuilderStatus, stepType } from "../RoomBuilder";

type CreatorConsoleProps = {
    user: userType;
    roomId: string;
    setSidebarOpen: (o: boolean) => void;
    sidebarOpen: boolean;
    status: RoomBuilderStatus;
    step: stepType;
    handleMainShow: (status: RoomBuilderStatus, step: stepType, id?: string, name?: string) => void;
};

export const CreatorConsole = ({
    handleMainShow,
    roomId,
    user,
    setSidebarOpen,
    sidebarOpen,
    status,
    step,
}: CreatorConsoleProps) => {
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [openOptions, setOpenOptions] = useState<boolean[]>([]);
    const { userLanguage } = useUserContext();
    const currentRoomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getUserRooms = async () => {
            console.log(user);
            if (user.id !== "") {
                const rooms = await roomsService.getRoomByUser(user.id);
                console.log(rooms);
                // After fetching, iterate all rooms and update something about them to manually change users rooms collection in the database:
                // if (rooms && Array.isArray(rooms)) {
                //     // Update 'completed' to "completed" for all rooms
                // await Promise.all(
                //     rooms.map(async (room: any) => {
                //         // Only update if not already set
                //         // if (room.name === "Apples") {
                //             await roomsService.deleteRoom(room.id);
                //         // }
                //     })
                // );
                // }
                setRooms(rooms);
                setOpenOptions(Array(rooms.length).fill(false));
            } else {
                console.log(user);
            }
        };
        console.log(user, user.id, !roomId, rooms, rooms.length);
        if (
            (user && !roomId && rooms && rooms.length === 0) ||
            (roomId &&
                ((rooms &&
                    rooms.length > 0 &&
                    rooms.findIndex((room) => room.id === roomId) === -1) ||
                    rooms.length === 0))
        ) {
            getUserRooms();
        }
    }, [user, roomId]);
    // Auto scroll to show the roomCard of the roomId if it exists
    useEffect(() => {
        const currentIndex = rooms.findIndex((room) => room.id === roomId);
        if (currentIndex !== -1 && currentRoomRef.current) {
            currentRoomRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [rooms, roomId]);

    const deleteAllRooms = async () => {
        try {
            await Promise.all(
                rooms.map(async (room: any) => {
                    // Only update if not already set
                    // if (room.name === "Apples") {
                    await roomsService.deleteRoom(room.id);
                    // }
                }),
            );
            console.log("rooms deleted");
        } catch (error) {
            console.error("rooms deleted no:", error);
        }
    };

    const handleDeleteRoom = async (id: string) => {
        try {
            const result = await roomsService.deleteRoom(id);
            console.log(result);
            if (result) {
                setRooms((prev) => {
                    return prev.filter((room) => room.id !== id);
                });
                setOpenOptions((prev) => {
                    const newLength = prev.length - 1;
                    return Array(newLength).fill(false);
                });
            }
        } catch (error) {
            console.error("no room deleted:", error);
        }
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
                        room.id === roomId ? { ...room, public: isPublic } : room,
                    );
                });
            }
        } catch (error) {
            console.error("room updated no:", error);
        }
    };
    console.log(status, step);
    return (
        <div
            className={`fixed ${sidebarOpen ? "w-3/12" : "w-1/12"} bg-gray-800 transition-all duration-300 flex flex-col border-r h-full border-cyan-500/30`}>
            {/* Create New Room Button */}
            <div className="lg:p-3 p-2 border-b border-gray-700 flex">
                {status !== "starting" && step !== "topic_and_data" && (
                    <button
                        className={`ml-auto bg-cyan-500 text-white hover:bg-cyan-600 lg:h-8 h-6 px-3 text-sm cursor-pointer items-center justify-center w-full flex gap-2 p-3 rounded-lg font-semibold transition-colors ${
                            !sidebarOpen && ""
                        }`}
                        onClick={() => {
                            handleMainShow("starting", "topic_and_data");
                        }}>
                        <Plus size={20} />
                        {sidebarOpen && <span>{get_text("new_room", userLanguage)}</span>}
                    </button>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`lg:p-2 p-1 ${sidebarOpen ? "ml-auto" : "mx-auto"} hover:bg-gray-700 rounded-lg transition-colors lg:h-8 h-6 text-white`}>
                    {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>
            {/* Header with Toggle Button */}
            <div className="flex items-center justify-between lg:p-4 p-2">
                {sidebarOpen && (
                    <h1
                        dir={userLanguage === "he" ? "rtl" : "ltr"}
                        className={`font-bold text-white lg:text-xl text-lg ${userLanguage === "en" ? "mr-auto" : "ml-auto"}`}>
                        {get_text("my_rooms", userLanguage)}
                        <span className="text-green-600"> ({rooms.length}) </span>
                        <span className="" onClick={deleteAllRooms}>
                            :
                        </span>
                    </h1>
                )}
            </div>
            <div className="flex-1 overflow-y-auto lg:max-h-96 max-h-44 scrollbar overflow-x-hidden px-3 py-2 space-y-3">
                {rooms.map((room, i) => {
                    return (
                        <div key={room.id} ref={room.id === roomId ? currentRoomRef : null}>
                            <RoomCard
                                room={room}
                                step={step}
                                i={i}
                                sidebarOpen={sidebarOpen}
                                openOptions={openOptions}
                                handleOpenDots={handleOpenDots}
                                handleDeleteRoom={handleDeleteRoom}
                                publishRoom={publishRoom}
                                handleMainShow={handleMainShow}
                                isSelected={room.id === roomId}
                            />
                        </div>
                    );
                })}
            </div>

            {/* User Options at Bottom */}
            <div className="p-3 border-t border-gray-700 space-y-2">
                <a
                    href="https://chat.whatsapp.com/IpUsLQiRGnTBgLnF02xLzs"
                    target="_blank"
                    rel="noopener noreferrer">
                    <button className="w-full flex items-center gap-2 hover:bg-green-600 p-2 rounded-lg transition-colors text-sm text-white cursor-pointer">
                        {/* <Whatsapp size={18} /> */}
                        <MessageCircle size={18} />
                        {sidebarOpen && <span>{get_text("join_our_community", userLanguage)}</span>}
                    </button>
                </a>
                <a href="https://wa.me/+972509315511" target="_blank" rel="noopener noreferrer">
                    <button className="w-full flex items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors text-sm text-white cursor-pointer">
                        <HelpCircle size={18} />
                        {sidebarOpen && <span>{get_text("contact_support", userLanguage)}</span>}
                    </button>
                </a>
                {user.subscription === "free" && (
                    <button className="w-full flex items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors text-sm text-white cursor-pointer">
                        <Gift size={18} />
                        {sidebarOpen && (
                            <span>{get_text("get_free_escape_room", userLanguage)}</span>
                        )}
                    </button>
                )}
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
