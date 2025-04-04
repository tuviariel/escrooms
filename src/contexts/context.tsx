import { createContext, ReactNode, useContext, useState } from "react";
//the ListObject interface used also in other components:
export interface ListObject {
    id: string;
    name: string;
    image: string;
}

interface ContextType {
    modalCurrencyObject: ListObject | undefined;
    setModalCurrencyObject: React.Dispatch<React.SetStateAction<ListObject | undefined>>;
}
// Create the context with a default value:
const AppContext = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
    children: ReactNode;
}
// The Provider wrapped around the app:
const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [modalCurrencyObject, setModalCurrencyObject] = useState<ListObject | undefined>();
    console.log(modalCurrencyObject);
    return (
        <AppContext.Provider value={{ modalCurrencyObject, setModalCurrencyObject }}>
            {children}
        </AppContext.Provider>
    );
};
// The context to be used in other pages / components:
const useAppContext = (): ContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useCrypto must be used within a CryptoProvider");
    }
    return context;
};
// exporting external usage:
export { useAppContext, ContextProvider };
