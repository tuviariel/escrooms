import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundaryFallback from "./components/ErrorBoundaryFallback";
// import { ContextProvider } from "./contexts/context";
function App() {
    return (
        <ErrorBoundaryFallback>
            {/* <ContextProvider> */}
            <AppRoutes />
            {/* </ContextProvider> */}
        </ErrorBoundaryFallback>
    );
}

export default App;
