import openLock from "../../assets/images/openLock.gif";
import Button from "../Button";
import useSound from "use-sound";
import honkMP3 from "../../assets/sounds/honk.mp3";
import { useEffect, useState } from "react";
import { get_text } from "../../util/language";
interface quizSuccessProps {
    setOpenLock: () => void;
}

export const QuizSuccess = (props: quizSuccessProps) => {
    const { setOpenLock } = props;
    const [honk] = useSound(honkMP3, { volume: 1.25 });
    const [play, setPlay] = useState(false);
    useEffect(() => {
        honk();
    }, [play]);
    return (
        <div className="">
            <img src={openLock} alt="Opening Lock" className="" />
            <Button label={get_text("close", "he")} onClick={setOpenLock} />
            <Button label={get_text("close_quiz", "he")} onClick={setOpenLock} />
        </div>
    );
};
