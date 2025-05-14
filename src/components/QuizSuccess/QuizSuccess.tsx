import openLock from "../../assets/images/openLock.gif";
import Button from "../Button";
import useSound from "use-sound";
import honkMP3 from "../../assets/sounds/honk.mp3";
import { useEffect, useState } from "react";

export const QuizSuccess = () => {
    const [honk] = useSound(honkMP3, { volume: 1.25 });
    const [play, setPlay] = useState(false);
    useEffect(() => {
        honk();
    }, [play]);
    return (
        <div className="">
            <img src={openLock} alt="Opening Lock" className="" />
            <Button label="close quiz" onClick={() => setPlay((prev) => !prev)} />
        </div>
    );
};
