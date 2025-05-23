import { useCallback, useEffect, useState } from "react";
import fraudImage from "../../assets/images/הונאות ומעילות.png";
import GameCard from "../../components/GameCard";
import Loading from "../../assets/images/loading.gif";
import { get_text } from "../../util/language";
import NavBar from "../../components/Navbar";
export interface ListObject {
    id: string;
    name: string;
    image: string | any;
}
/**
 * Dashboard page- currently the apps main page ('/' route)
 * @param props none. Gets data by calling the CryptoGecko API.
 * @returns the main dashboard page with sub components.
 */

export const Dashboard = () => {
    //TODO- this list should be connected to the DB with all the room's quiz's data...
    const [roomsList, setRoomsList] = useState<ListObject[]>([
        { id: "rfvwkjf34v43", name: get_text("sexual_harassment", "he"), image: "url" },
        { id: "rfvwkjf34v45", name: get_text("first_aid", "he"), image: "url" },
        { id: "kjbhdfvksjdf", name: get_text("fraud", "he"), image: fraudImage },
        { id: "rfvwkjf34v44", name: get_text("sexual_harassment", "he"), image: "url" },
        { id: "rfvwkjf34v42", name: get_text("first_aid", "he"), image: "url" },
        { id: "kjbhdfvksjd4", name: get_text("fraud", "he"), image: fraudImage },
        { id: "rfvwkjf34v46", name: get_text("sexual_harassment", "he"), image: "url" },
        { id: "rfvwkjf34v47", name: get_text("first_aid", "he"), image: "url" },
        { id: "kjbhdfvksjd6", name: get_text("fraud", "he"), image: fraudImage },
    ]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }

        //getting info through API service:
        const getList = async () => {};
        getList();
    }, []);
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0]">
            <NavBar />
            <h2 className="font-semibold text-3xl mb-12 underline">{get_text("title", "he")}</h2>
            {roomsList.length > 0 ? (
                <div className="grid grid-cols-3 gap-10 px-10">
                    {roomsList.map((item) => {
                        return (
                            <GameCard
                                key={item.id}
                                name={item.name}
                                id={item.id}
                                image={item.image}
                            />
                        );
                    })}
                </div>
            ) : errorMessage ? (
                <div>{errorMessage}</div>
            ) : (
                <div className="flex flex-col-reverse">
                    <div>Loading...</div>
                    <img src={Loading} alt="Loading..." className="mx-auto" />
                </div>
            )}
        </div>
    );
};
