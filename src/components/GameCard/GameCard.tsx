import { useNavigate } from "react-router";
// import { Room } from "../../pages/Dashboard/Dashboard";
import { get_text } from "../../util/language";
import { fileStorage } from "../../services/service";
import { useEffect, useState } from "react";
// import { firstLowercaseGroup } from "../../util/UIstyle";

import { useUserContext } from "../../contexts/userStyleContext";

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
            className={`relative border border-black bg-white rounded-2xl h-72 w-46 cursor-pointer overflow-hidden flex flex-col hover:shadow-2xl hover:scale-105 transition-transform duration-200`}
            title={`${get_text("enter_room", userLanguage)} "${data.name}"`}
            onClick={() => {
                navigate("/room/" + data.id);
            }}>
            {data.mainImage && (
                <img src={URL} alt="game image" className={`h-36 w-full object-cover`} />
            )}
            <div className="text-xl md:text-2xl font-bold">{data.name}</div>
            <p className="text-base">{data.description}</p>
            <p className="text-sm mt-auto mb-1 text-gray-600">
                {get_text("last_updated", userLanguage)}:{" "}
                {new Date(data.updatedAt).toLocaleDateString()}
            </p>
        </div>
    );
};
