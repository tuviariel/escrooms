import { useNavigate } from "react-router";
import { get_text } from "../../util/language";
import { fileStorage } from "../../services/service";
import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userStyleContext";
// import { Edit } from "lucide-react";
import { formatDate } from "../../util/utils";

export const GameCard = (props: any) => {
    const { data } = props;
    const { userLanguage } = useUserContext();
    console.log("GameCard props:", data);
    const navigate = useNavigate();
    const [URL, setURL] = useState<any | null>(null);
    useEffect(() => {
        const getUrl = async (mainImage: string | null) => {
            if (!mainImage) return "";
            console.log("Getting URL for image:", mainImage);
            const url = await fileStorage.getFileUrl(mainImage);
            console.log("Got URL for image:", url);
            setURL(url);
        };
        getUrl(data.mainImage);
    }, []);

    return (
        <div
            className="relative border-2 border-cyan-500 bg-gray-800 rounded-lg overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
            dir={userLanguage === "he" ? "rtl" : "ltr"}>
            {/* Image */}
            {data.mainImage && URL && (
                <div className="relative h-48 w-full overflow-hidden">
                    <img src={URL} alt="game image" className="w-full h-full object-cover" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{data.name}</h3>
                <p className="text-sm text-gray-300 mb-4 flex-1">{data.description}</p>
                <p className="text-xs text-gray-400 mb-4">
                    {formatDate(userLanguage, data.updatedAt || data.createdAt)}
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/room/" + data.id);
                        }}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded transition-colors">
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
