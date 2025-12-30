import { get_text } from "../../../../util/language";
import { Edit2, EllipsisVertical, Eye, EyeOff, Share2, Trash2 } from "lucide-react";
import { useUserContext } from "../../../../contexts/userStyleContext";
import { useEffect, useState } from "react";
import { fileStorage } from "../../../../services/service";
import { RoomType } from "../../../Dashboard/Dashboard";
import { useSelector } from "react-redux";
import { userType } from "../../../../components/Login/Login";

type RoomCardProps = {
    room: RoomType;
    i: number;
    sidebarOpen: boolean;
    openOptions: boolean[];
    handleOpenDots: (i: number) => void;
    handleDeleteRoom: (id: string) => void;
    publishRoom: (id: string, i: boolean) => void;
};

export const RoomCard = ({
    room,
    i,
    sidebarOpen,
    openOptions,
    handleOpenDots,
    handleDeleteRoom,
    publishRoom,
}: RoomCardProps) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const { userLanguage } = useUserContext();
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
            className={`bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors cursor-pointer ${
                !sidebarOpen ? "flex justify-center" : ""
            }`}
            onClick={() => console.log("preview room-" + room.id)}
            onMouseLeave={() => openOptions[i] && handleOpenDots(i)}>
            {sidebarOpen ? (
                <>
                    <div className="flex relative justify-between">
                        {room.coverImage && (
                            <img src={imageUrl} alt="image" className="h-11 w-11 mr-1 rounded" />
                        )}
                        <div className="space-y-2">
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
                                className={`px-1 rounded-full ${openOptions[i] ? "border-cyan-400 border" : ""}`}>
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
                                            console.log("edit room-" + room.id);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 hover:bg-cyan-600 text-white p-1.5 rounded text-xs transition-colors">
                                        <Edit2 size={14} />
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
                                    <button
                                        title={get_text("delete", userLanguage)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRoom(room.id);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 hover:bg-red-600 text-white p-1.5 rounded text-xs transition-colors">
                                        <Trash2 size={14} />
                                    </button>
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
                    </div>
                </>
            ) : (
                <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{room.name.charAt(0)}</span>
                </div>
            )}
        </div>
    );
};
