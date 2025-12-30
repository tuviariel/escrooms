import { get_text } from "../../util/language";
import { useUserContext } from "../../contexts/userStyleContext";
import { useRoomContext } from "../../contexts/roomStyleContext";
import { colorPalette } from "../../util/UIstyle";

interface AnswerButtonProps {
    result: string;
    onClick: () => void;
    active: any[];
}

export const AnswerButton = (props: AnswerButtonProps) => {
    const { result, onClick, active } = props;
    const { userLanguage } = useUserContext();
    const { roomColor } = useRoomContext();
    return (
        <div
            className={`${active.length < 4 ? "ts:flex" : "ph:flex"} absolute bottom-2 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 hidden flex-col-reverse items-center justify-center`}>
            {result ? (
                <div
                    className="w-fit py-1 px-4 rounded-xl text-center border-2 text-xl lg:text-3xl"
                    style={{
                        color: colorPalette[roomColor as keyof typeof colorPalette].light,
                        borderColor: colorPalette[roomColor as keyof typeof colorPalette].light,
                    }}
                    dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    {result}
                </div>
            ) : (
                <div
                    onClick={() => onClick()}
                    className="text-xl lg:text-3xl cursor-pointer border-2 border-gray-950 rounded-xl px-4 py-1 text-gray-950 hover:bg-gray-700"
                    style={{
                        backgroundColor:
                            colorPalette[roomColor as keyof typeof colorPalette].bright,
                    }}>
                    {result === get_text("success", userLanguage)
                        ? get_text("finish", userLanguage)
                        : get_text("check_answer", userLanguage)}
                </div>
            )}
        </div>
    );
};
