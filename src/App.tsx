import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundaryFallback from "./components/ErrorBoundaryFallback";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

function App() {
    return (
        <ErrorBoundaryFallback>
            <AppRoutes />
        </ErrorBoundaryFallback>
    );
}

export default App;
