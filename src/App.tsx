import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundaryFallback from "./components/ErrorBoundaryFallback";

function App() {
    return (
        <ErrorBoundaryFallback>
            <AppRoutes />
        </ErrorBoundaryFallback>
    );
}

export default App;
