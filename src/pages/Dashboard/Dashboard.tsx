import { useCallback, useEffect, useState } from "react";
// import Dialog from "../../components/Dialog";
import GameCard from "../../components/GameCard";
import Loading from "../../assets/images/loading.gif";
// import { getRoomsList } from "../../services/service";

import NavBar from "../../components/Navbar";
interface ListObject {
    id: string;
    name: string;
    image: string;
}
/**
 * Dashboard page- currently the apps main page ('/' route)
 * @param props none. Gets data by calling the CryptoGecko API.
 * @returns the main dashboard page with sub components.
 */

export const Dashboard = () => {
    //TODO- this list should be connected to the DB with all the room's quiz's data...
    const [roomsList, setRoomsList] = useState<ListObject[]>([
        { id: "rfvwkjf34v43", name: "Sexual Harassment", image: "url" },
        { id: "rfvwkjf34v45", name: "First Aid", image: "url" },
        { id: "kjbhdfvksjdf", name: "Embezzlement and fraud", image: "url" },
    ]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            // } else if (document.webkitExitFullscreen) { // Safari
            //   document.webkitExitFullscreen();
            // } else if (document.msExitFullscreen) { // IE/Edge
            //   document.msExitFullscreen();
        }

        //getting info through API service:
        const getList = async () => {
            // try {
            //     let queryParams = { vs_currency: "usd" };
            //     const res: any = await getRoomsList(queryParams);
            //     if (!res.data) {
            //         throw new Error(`Response status: ${res.status}`);
            //     }
            //     setRoomsList(res.data);
            //     // console.log(res);
            // } catch (err: any) {
            //     console.error(err.message);
            //     setErrorMessage(err.message);
            // }
        };
        getList();
    }, []);
    // console.log(modalCurrencyObject);
    return (
        <>
            <NavBar />
            <h2 className="font-semibold text-3xl mb-12 underline">Educational Escape Rooms</h2>
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
        </>
    );
};
