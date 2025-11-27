import { useNavigate } from "react-router";
import { ListObject } from "../../pages/Dashboard/Dashboard";
import { get_text } from "../../util/language";
import { fileStorage } from "../../services/service";
import { useEffect, useState } from "react";
export const GameCard = (props: any) => {
    const { name, id, mainImage, description } = props.data as ListObject;
    const navigate = useNavigate();
    const [URL, setURL] = useState<string>("");
    const openRoom = (id: string) => {
        console.log(id);
        navigate("/room/" + id);
    };
    useEffect(() => {
        const getUrl = async (mainImage: string | null) => {
            if (!mainImage) return "";
            const url = await fileStorage.getFileUrl(mainImage);
            setURL(url);
        };
        getUrl(mainImage);
    });

    console.log("GameCard render:", name, id, mainImage, description);

    return (
        <div
            className="relative border border-black rounded-2xl h-36 w-full cursor-pointer overflow-hidden"
            title={`${get_text("enter_room", "he")} "${name}"`}
            onClick={() => {
                openRoom(id);
            }}>
            <div
                title={description ? description : ""}
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl text-amber-50 font-bold">
                {name}
            </div>
            {mainImage && <img src={URL} alt="" className="" />}
        </div>
    );
};
