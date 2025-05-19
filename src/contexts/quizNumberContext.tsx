import { createContext, ReactNode, useContext, useState } from "react";

interface ContextType {
    quizNumber: number;
    setQuizNumber: React.Dispatch<React.SetStateAction<number>>;
}
// Create the context with a default value:
const AppContext = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
    children: ReactNode;
}
// The Provider wrapped around the app:
const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [quizNumber, setQuizNumber] = useState<number>(-1);
    //TODO- add back ground color theam that would also be wrapped around the room
    console.log(quizNumber);
    return (
        <AppContext.Provider value={{ quizNumber, setQuizNumber }}>{children}</AppContext.Provider>
    );
};
// The context to be used in other pages / components:
const useQuizContext = (): ContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("quizNumber must be used within the Room route");
    }
    return context;
};
// exporting external usage:
export { useQuizContext, ContextProvider };
