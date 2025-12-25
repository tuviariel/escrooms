import { createContext, ReactNode, useContext, useState } from "react";
// import data from "../services/dummyRoomData";
interface ContextType {
    roomStyle: string;
    roomColor: string;
    roomFont: string;
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
const RoomContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [roomStyle, setRoomStyle] = useState<string>("abstract");
    const [roomColor, setRoomColor] = useState<string>("blueToRed");
    const [roomFont, setRoomFont] = useState<string>("Arial");
    console.log(roomStyle, roomColor, roomFont);
    return (
        <RoomStyleContext.Provider
            value={{
                roomStyle,
                roomColor,
                roomFont,
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
        throw new Error("RoomStyleContext must be used within the RoomStyleProvider");
    }
    return context;
};
// exporting external usage:
export { useRoomContext, RoomContextProvider };
