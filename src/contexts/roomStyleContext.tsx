import { createContext, ReactNode, useContext, useState } from "react";
// import data from "../services/dummyRoomData";
interface ContextType {
    userLanguage: string;
    roomStyle: string;
    roomColor: string;
    roomFont: string;
    setUserLanguage: React.Dispatch<React.SetStateAction<string>>;
    setRoomStyle: React.Dispatch<React.SetStateAction<string>>;
    setRoomColor: React.Dispatch<React.SetStateAction<string>>;
    setRoomFont: React.Dispatch<React.SetStateAction<string>>;
}
// Create the context with a default value:
const RoomStyleContext = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
    children: ReactNode;
}
// The Provider wrapped around the room component:
const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [userLanguage, setUserLanguage] = useState<string>("he");
    const [roomStyle, setRoomStyle] = useState<string>("abstract");
    const [roomColor, setRoomColor] = useState<string>("redBlueGray");
    const [roomFont, setRoomFont] = useState<string>("Arial");
    console.log(userLanguage, roomStyle, roomColor, roomFont);
    return (
        <RoomStyleContext.Provider
            value={{
                userLanguage,
                roomStyle,
                roomColor,
                roomFont,
                setUserLanguage,
                setRoomStyle,
                setRoomColor,
                setRoomFont,
            }}>
            {children}
        </RoomStyleContext.Provider>
    );
};
// The context to be used in other pages / components:
const useRoomContext = (): ContextType => {
    const context = useContext(RoomStyleContext);
    if (context === undefined) {
        throw new Error("quizNumber must be used within the Room route");
    }
    return context;
};
// exporting external usage:
export { useRoomContext, ContextProvider };
