import { get_text } from "../../../../util/language";
import { Edit2, EllipsisVertical, Eye, EyeOff, Share2, Trash2, View } from "lucide-react";
import { useUserContext } from "../../../../contexts/userStyleContext";
import { useEffect, useState } from "react";
import { fileStorage } from "../../../../services/service";
import { RoomType } from "../../../Dashboard/Dashboard";
import { useSelector } from "react-redux";
import { userType } from "../../../../components/Login/Login";
import { useNavigate } from "react-router";

type RoomCardProps = {
    room: RoomType;
    i: number;
    isSelected: boolean;
    sidebarOpen: boolean;
    openOptions: boolean[];
    handleOpenDots: (i: number) => void;
    handleDeleteRoom: (id: string) => void;
    publishRoom: (id: string, i: boolean) => void;
    handleEditRoom: (id: string, name?: string) => void;
    handleViewRoom: (id: string, name?: string) => void;
};

export const RoomCard = ({
    room,
    isSelected,
    i,
    sidebarOpen,
    openOptions,
    handleOpenDots,
    handleDeleteRoom,
    publishRoom,
    handleEditRoom,
    handleViewRoom,
}: RoomCardProps) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const { userLanguage } = useUserContext();
    const navigate = useNavigate();
    const userRedux: any = useSelector((state: { user: userType }) => state.user);

    useEffect(() => {
        const getUrl = async (mainImage: string | null) => {
            if (!mainImage) return "";
            console.log("Getting URL for image:", mainImage);
            const url = await fileStorage.getFileUrl(mainImage);
            console.log("Got URL for image:", url);
            setImageUrl(url);
        };
        getUrl(room.coverImage || "");
    }, []);

    return (
        <div
            key={room.id}
            className={`bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors ${isSelected ? "bg-cyan-500/20 border border-cyan-500/30" : ""} ${
                !sidebarOpen ? "flex justify-center" : ""
            }`}
            // onClick={() => handleViewRoom(room.id, room.name)}
            onMouseLeave={() => openOptions[i] && handleOpenDots(i)}>
            <div className="flex relative justify-between">
                {room.coverImage && (
                    <>
                        <img src={imageUrl} alt="image" className="h-11 w-11 rounded" />
                        {!sidebarOpen && (
                            <h3
                                className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center text-xs truncate text-white"
                                dir={userLanguage === "he" ? "rtl" : "ltr"}>
                                {room.name.length > 5 ? room.name.slice(0, 5) + "..." : room.name}
                            </h3>
                        )}
                    </>
                )}
                {sidebarOpen && (
                    <>
                        <div className="space-y-2 ml-1">
                            <h3 className="font-semibold text-sm truncate text-white">
                                {room.name}
                            </h3>
                            {/* <p className="text-xs text-gray-300 truncate">{room.description}</p> */}
                            <p className="text-xs text-gray-400">
                                {get_text("created_at", userLanguage)}:{" "}
                                {new Date(room.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div
                                className={`px-1 rounded-full cursor-pointer border ${openOptions[i] ? "border-cyan-400" : "border-transparent"}`}>
                                <EllipsisVertical
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenDots(i);
                                    }}
                                    size={14}
                                    color={!openOptions[i] ? "white" : "cyan"}
                                />
                            </div>
                            {openOptions[i] && (
                                <div
                                    onMouseLeave={() => handleOpenDots(i)}
                                    className="absolute right-4 top-1 flex flex-row-reverse gap-2 m-2 bg-gray-800 border border-gray-600 p-1 rounded-lg shadow-lg">
                                    <button
                                        title={get_text("edit", userLanguage)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditRoom(room.id, room.name);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 hover:bg-yellow-600 text-white p-1.5 rounded text-xs transition-colors">
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        title={get_text("view_room", userLanguage)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // handleViewRoom(room.id, room.name);
                                            console.log(handleViewRoom);
                                            navigate(`/room/${room.id}?fromBuilder`);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 hover:bg-cyan-600 text-white p-1.5 rounded text-xs transition-colors">
                                        <View size={14} />
                                    </button>
                                    {room.public && (
                                        <button
                                            title={get_text("share", userLanguage)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log("share room-" + room.id);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1 hover:bg-cyan-600 text-white p-1.5 rounded text-xs transition-colors">
                                            <Share2 size={14} />
                                        </button>
                                    )}
                                    <button
                                        title={
                                            room.public
                                                ? get_text("unpublish", userLanguage)
                                                : get_text("publish", userLanguage)
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            room.public && userRedux.subscription === "free"
                                                ? console.log("show subscribe dialog")
                                                : publishRoom(room.id, !room.public || true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 hover:bg-green-600 text-white p-1.5 rounded text-xs transition-colors">
                                        {room.public ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    {/* {userRedux.subscription !== "free" && ( */}
                                    {/* <button
                                        title={get_text("delete", userLanguage)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRoom(room.id);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 hover:bg-red-600 text-white p-1.5 rounded text-xs transition-colors">
                                        <Trash2 size={14} />
                                    </button> */}
                                    {/* )} */}
                                </div>
                            )}
                            <div
                                className="px-1 text-white"
                                title={get_text(room.public ? "public" : "private", userLanguage)}>
                                {room.public ? (
                                    <Eye size={14} color="white" />
                                ) : (
                                    <EyeOff size={14} color="white" />
                                )}
                            </div>
                        </div>
                        {isSelected && (
                            <div className="absolute top-1/2 -translate-y-1/2 -right-14 h-14 w-14 rotate-45 bg-cyan-500/20 border-2 border-cyan-500/30 -z-10"></div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
