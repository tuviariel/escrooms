import { useEffect, useRef, useState } from "react";
import Typing from "../../assets/images/typing.gif";
interface chatContent {
    user: string;
    text: string;
}
interface hintChatProps {
    hints: string[];
}
export const HintChat = (props: hintChatProps) => {
    const { hints } = props;
    // const hintsAmount = hints.length;
    const [open, setOpen] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    const [chat, setChat] = useState<chatContent[]>([
        { user: "bot", text: "Hello!! I can help you by giving you hints..." },
        { user: "bot", text: "Do you want a hint?" },
    ]);
    // const [userInput, setUserInput] = useState<string>("");
    const [botTyping, setBotTyping] = useState<boolean>(false);
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
                    text: hints[counter] ? hints[counter] : "can't help you any more...",
                });
                return newArray;
            });
            setCounter((prev) => {
                return prev + 1;
            });
            if (hints[counter]) {
                setTimeout(() => {
                    setChat((prev) => {
                        let newArray = [...prev];
                        newArray.push({
                            user: "bot",
                            text: "Do you want another hint?",
                        });
                        return newArray;
                    });
                    setBotTyping(false);
                }, 3000);
            } else {
                setBotTyping(false);
            }
        }, 5000);
    };

    return (
        <>
            <div className="relative flex">
                <div
                    className={`bg-amber-500 rounded-full h-12 w-12 p-auto text-pink-800 text-3xl cursor-pointer border-2 ${
                        open ? "border-amber-600" : "border-amber-900"
                    }`}
                    onClick={() => setOpen((prev) => !prev)}>
                    ?
                </div>
                {open && (
                    <div className="absolute bottom-16 right-0 rounded-3xl bg-amber-300 h-80 w-64 flex flex-col p-2">
                        <div className="overflow-auto scrollbar flex flex-col">
                            {chat.map((item, i) => {
                                if (item.user === "bot")
                                    return (
                                        <div
                                            key={i}
                                            className="mr-auto ml-2 text-left bg-amber-400 p-1 rounded-2xl mb-0.5"
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
                                            className="ml-auto mr-2 text-right bg-amber-500 p-1 rounded-2xl mb-0.5"
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

                        <div className="flex mt-auto h-12 w-56 border-t-2 border-amber-950">
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
                            <div
                                onClick={() => userSend("Yes, please give me a hint...")}
                                className={`bg-amber-600 rounded-2xl p-0.5 pl-3 mt-2 cursor-pointer border border-t-2`}>
                                Yes, please give me a hint...
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
