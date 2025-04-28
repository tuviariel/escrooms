import { useCallback, useEffect, useState } from "react";
// import Dialog from "../../components/Dialog";
import GameCard from "../../components/GameCard";
import Loading from "../../assets/images/loading.gif";
// import { getRoomsList } from "../../services/service";
import { ListObject, useAppContext } from "../../contexts/context";
import NavBar from "../../components/Navbar";

/**
 * Dashboard page- currently the apps main page ('/' route)
 * @param props none. Gets data by calling the CryptoGecko API.
 * @returns the main dashboard page with sub components.
 */

export const Dashboard = () => {
    // const { modalCurrencyObject, setModalCurrencyObject } = useAppContext();
    const [roomsList, setRoomsList] = useState<ListObject[]>([
        { id: "rfvwkjf34v43", name: "Sexual Harassment", image: "url" },
        { id: "rfvwkjf34v45", name: "First Aid", image: "url" },
        { id: "rfvwkjf34v46", name: "Height Working", image: "url" },
    ]);
    // const [watchedList, setWatchedList] = useState<ListObject[]>([]);
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
            {/* <Dialog
                open={modalCurrencyObject?.id ? true : false}
                setOpen={setModalCurrencyObject}
                size="large"
                data="cryptoDetail"
                disableOverlayClose={true}>
                <CryptoDetail />
            </Dialog> */}
        </>
    );
};
