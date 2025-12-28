import { useEffect, useRef, useState } from "react";
import Typing from "../../assets/images/typing.gif";
import { get_text } from "../../util/language";
import { useUserContext } from "../../contexts/userStyleContext";
import { colorPalette } from "../../util/UIstyle";
import { useRoomContext } from "../../contexts/roomStyleContext";
interface chatContent {
    user: string;
    text: string;
}
interface hintChatProps {
    hints: string[];
    quizText: string;
}
export const HintChat = (props: hintChatProps) => {
    const { hints, quizText } = props;
    const { userLanguage } = useUserContext();
    const { roomColor } = useRoomContext();
    // const hintsAmount = hints.length;
    const [open, setOpen] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    const [chat, setChat] = useState<chatContent[]>([
        { user: "bot", text: get_text("instructions", userLanguage) + quizText },
        { user: "bot", text: get_text("welcome_hint", userLanguage) },
        { user: "bot", text: get_text("do_want_hint", userLanguage) },
    ]);
    // const [userInput, setUserInput] = useState<string>("");
    const [botTyping, setBotTyping] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat]);

    const userSend = (userChose: string) => {
        // console.log(userInput);
        // if (userInput === "") return;
        setChat((prev) => {
            let newArray = [...prev];
            newArray.push({ user: "user", text: userChose });
            return newArray;
        });
        setBotTyping(true);
        // setUserInput("");
        setTimeout(() => {
            setChat((prev) => {
                let newArray = [...prev];
                newArray.push({
                    user: "bot",
                    text: hints[counter]
                        ? hints[counter]
                        : get_text("cant_help_more", userLanguage),
                });
                return newArray;
            });
            setCounter((prev) => {
                return prev + 1;
            });
            setTimeout(() => {
                setChat((prev) => {
                    let newArray = [...prev];
                    newArray.push({
                        user: "bot",
                        text: hints[counter]
                            ? get_text("do_want_another_hint", userLanguage)
                            : get_text("you_can_do_it", userLanguage),
                    });
                    return newArray;
                });
                !hints[counter] && setFinished(true);
                setBotTyping(false);
            }, 2000);
        }, 4000);
    };
    //TODO: add ability to check which stage the user got to and give him the relevant hint.

    return (
        <div
            className="fixed right-9 lg:right-18 bottom-1 lg:bottom-8 z-20"
            dir={userLanguage === "he" ? "rtl" : "ltr"}>
            <div className="relative flex">
                <div
                    className={`bg-amber-500 rounded-full w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 p-auto text-black md:text-3xl text-xl lg:text-5xl text-center cursor-pointer border-2 border-black ${
                        open ? "border-amber-600" : "border-amber-900"
                    }`}
                    style={{
                        backgroundColor: open
                            ? colorPalette[roomColor as keyof typeof colorPalette].light
                            : colorPalette[roomColor as keyof typeof colorPalette].bright,
                    }}
                    onClick={() => setOpen((prev) => !prev)}
                    title={
                        open
                            ? get_text("close_hint", userLanguage)
                            : get_text("get_hint", userLanguage)
                    }>
                    ?
                </div>
                {open && (
                    <div className="absolute md:bottom-14 bottom-10 right-0 rounded-3xl bg-amber-300 md:h-88 h-72 w-64 flex flex-col p-2 md:text-base text-sm">
                        <div className="overflow-auto scrollbar flex flex-col">
                            {chat.map((item, i) => {
                                if (item.user === "bot")
                                    return (
                                        <div
                                            key={i}
                                            className="flex mr-5 ml-1 text-right bg-amber-400 p-1 rounded-2xl mb-0.5"
                                            dir="rtl"
                                            ref={
                                                i === chat.length - 1 && !botTyping
                                                    ? lastMessageRef
                                                    : null
                                            }>
                                            {item.text}
                                        </div>
                                    );
                                else
                                    return (
                                        <div
                                            key={i}
                                            className="flex ml-5 mr-1 text-right bg-amber-500 p-1 rounded-2xl mb-0.5"
                                            dir="rtl"
                                            ref={
                                                i === chat.length - 1 && !botTyping
                                                    ? lastMessageRef
                                                    : null
                                            }>
                                            {item.text}
                                        </div>
                                    );
                            })}
                            {botTyping && (
                                <div ref={lastMessageRef}>
                                    <img
                                        src={Typing}
                                        alt="botTyping"
                                        className="mr-auto ml-2 h-10 w-20"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex mt-auto h-12 w-56">
                            {/* <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="border-l border-y rounded-l-2xl border-amber-700"
                            />
                            <div
                                onClick={userSend}
                                className={`${
                                    userInput === "" ? "bg-amber-300" : "bg-amber-700"
                                } rounded-2xl p-0.5 pl-4 cursor-pointer`}>
                                send
                            </div> */}
                            {!botTyping && !finished && (
                                <div
                                    dir="rtl"
                                    onClick={() => userSend(get_text("give_hint", userLanguage))}
                                    className={`bg-amber-600 rounded-2xl md:p-2 p-1 md:h-10 h-8 md:mt-2 mt-4 cursor-pointer border-black border-b-2`}>
                                    {get_text("give_hint", userLanguage)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
