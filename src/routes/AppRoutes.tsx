import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Dashboard from "../pages/Dashboard";
import { ContextProvider } from "../contexts/roomStyleContext";
import { route_paths } from "../util/config";
// import { ContextProvider } from "./contexts/context";
import { Provider } from "react-redux";
import store from "../reduxStor/index";
const DASHBOARD = route_paths["DASHBOARD"];
const ROOM = route_paths["ESCROOM"];
const Room = React.lazy(() => import("../pages/Room"));

/**
 * the app's router center- currently only one main route ('/')
 * @param props none. has an option of adding the react.lazy fallback with Suspense
 * @returns app's routes map
 */

export default function AppRoutes() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Provider store={store}>
                    <Routes>
                        {/* <Route path="/" element={<NavBar />}> */}
                        {/* <Route path="/add" element={<Add />} /> */}
                        <Route
                            path={ROOM}
                            element={
                                <ContextProvider>
                                    <Room />
                                </ContextProvider>
                            }
                        />
                        <Route path={DASHBOARD} element={<Dashboard />} />
                    </Routes>
                </Provider>
            </Suspense>
        </Router>
    );
}
