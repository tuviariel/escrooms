import { createContext, ReactNode, useContext, useState } from "react";
// import data from "../services/dummyRoomData";
interface ContextType {
    userLanguage: string;
    setUserLanguage: React.Dispatch<React.SetStateAction<string>>;
}
// Create the context with a default value:
const UserStyleContext = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
    children: ReactNode;
}
// The Provider wrapped around the room component:
const UserContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [userLanguage, setUserLanguage] = useState<string>("he");
    console.log(userLanguage);
    return (
        <UserStyleContext.Provider
            value={{
                userLanguage,
                setUserLanguage,
            }}>
            {children}
        </UserStyleContext.Provider>
    );
};
// The context to be used in other pages / components:
const useUserContext = (): ContextType => {
    const context = useContext(UserStyleContext);
    if (context === undefined) {
        throw new Error("userContext must be used within the UserContextProvider");
    }
    return context;
};
// exporting external usage:
export { useUserContext, UserContextProvider };
