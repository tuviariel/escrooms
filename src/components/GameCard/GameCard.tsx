import { useNavigate } from "react-router";
import { Room } from "../../pages/Dashboard/Dashboard";
import { get_text } from "../../util/language";
import { fileStorage } from "../../services/service";
import { useEffect, useState } from "react";
export const GameCard = (props: any) => {
    // console.log("GameCard props:", props);
    const { data } = props;
    console.log("GameCard props:", data);
    const navigate = useNavigate();
    const [URL, setURL] = useState<string>("");
    const openRoom = async (id: string) => {
        console.log(id);
        const quizzes = await data.quizzes();
        console.log("Fetched quizzes for room:", quizzes);
        const cleanQuizzes = quizzes.data.map((quiz: any) => {
            return { ...quiz, room: "" };
        });
        const roomWithQuizzes = await {
            ...data,
            quizzes: cleanQuizzes,
            creator: [], //await data.creator(),
        };
        console.log("Navigating to room with data:", roomWithQuizzes);
        navigate("/room/" + id, { state: { roomData: roomWithQuizzes } });
    };
    useEffect(() => {
        const getUrl = async (mainImage: string | null) => {
            if (!mainImage) return "";
            const url = await fileStorage.getFileUrl(mainImage);
            setURL(url);
        };
        getUrl(data.mainImage);
    }, []);

    // console.log("GameCard render:", name, id, mainImage, description);

    return (
        <div
            className="relative border border-black rounded-2xl h-36 w-full cursor-pointer overflow-hidden"
            title={`${get_text("enter_room", "he")} "${name}"`}
            onClick={() => {
                openRoom(data.id);
            }}>
            <div
                title={data.description ? data.description : ""}
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl text-amber-50 font-bold">
                {data.name}
            </div>
            {data.mainImage && <img src={URL} alt="" className="" />}
        </div>
    );
};
