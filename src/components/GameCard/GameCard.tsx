import { useNavigate } from "react-router";
import { get_text } from "../../util/language";
import { fileStorage } from "../../services/service";
import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userStyleContext";
// import { Edit } from "lucide-react";
import { formatDate, timeFormat, timeLeftFormat } from "../../util/utils";
import defaultCoverImage from "../../assets/images/defaultCoverImage.png";
export const GameCard = (props: any) => {
    const { data } = props;
    const { userLanguage } = useUserContext();
    console.log("GameCard props:", data);
    const navigate = useNavigate();
    const [URL, setURL] = useState<any | null>(null);
    const [lastPlayed, setLastPlayed] = useState<{ remaining: number; timestamp: number } | null>(
        null
    );
    useEffect(() => {
        const getUrl = async (mainImage: string | null) => {
            if (!mainImage) return "";
            console.log("Getting URL for image:", mainImage);
            const url = await fileStorage.getFileUrl(mainImage);
            console.log("Got URL for image:", url);
            setURL(url );
        };
        getUrl(data.coverImage || "");
        if (localStorage.getItem(`roomTimer_${data.id}`)) {
            const { remaining, timestamp } = JSON.parse(
                localStorage.getItem(`roomTimer_${data.id}`) || "{}"
            );
            setLastPlayed({ remaining, timestamp });
        }
    }, []);

    return (
        <div
            className="relative border-2 border-cyan-500 bg-gray-800 rounded-lg overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
            dir={userLanguage === "he" ? "rtl" : "ltr"}
            onClick={(e) => {
                e.stopPropagation();
                navigate("/room/" + data.id);
            }}>
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
                <img src={data.coverImage ? URL : defaultCoverImage} alt="game image" className="w-full h-full object-cover" />
            </div>
            {/* Content */}
            <div className="flex-1 p-4 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{data.name}</h3>
                <p className="text-sm text-gray-300 mb-4 flex-1">{data.description}</p>
                <div
                    className="text-xs text-gray-400 mb-4 flex flex-col"
                    dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    <div>{`${get_text("last_updated", userLanguage)}: ${formatDate(userLanguage, data.updatedAt || data.createdAt)}`}</div>
                    <div>
                        {lastPlayed &&
                            `${get_text("last_played", userLanguage)}: ${timeFormat(userLanguage, lastPlayed.timestamp)}`}
                    </div>
                    <div>
                        {lastPlayed &&
                            `${get_text("time_left", userLanguage)}: ${timeLeftFormat(lastPlayed.remaining)}`}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded transition-colors cursor-pointer">
                        {get_text("play_now", userLanguage)}
                    </button>
                    {/* <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/room-builder?edit=" + data.id);
                        }}
                        className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors">
                        <Edit size={18} />
                    </button> */}
                </div>
            </div>
        </div>
    );
};
