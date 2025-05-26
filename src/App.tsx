import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundaryFallback from "./components/ErrorBoundaryFallback";
// import { ContextProvider } from "./contexts/context";
import { Provider } from "react-redux";
import store from "./reduxStor/index";
function App() {
    return (
        <ErrorBoundaryFallback>
            <Provider store={store}>
                <AppRoutes />
            </Provider>
        </ErrorBoundaryFallback>
    );
}

export default App;
