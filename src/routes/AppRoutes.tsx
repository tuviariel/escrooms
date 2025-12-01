import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Subscription from "../pages/Subscription";
import RoomBuilder from "../pages/RoomBuilder";
import NavBar from "../components/Navbar";
import { ContextProvider } from "../contexts/roomStyleContext";
import { route_paths } from "../util/config";
// import { ContextProvider } from "./contexts/context";
import { Provider } from "react-redux";
import store from "../reduxStor/index";
const ROOM = route_paths["ESCROOM"];
const PROFILE = route_paths["PROFILE"];
const SUBSCRIPTION = route_paths["SUBSCRIPTION"];
const ROOMBUILDER = route_paths["ROOMBUILDER"];
const HOME = route_paths["HOME"];
const Room = React.lazy(() => import("../pages/Room"));

/**
 * the app's router center
 * @param props none. has an option of adding the react.lazy fallback with Suspense
 * @returns app's routes map
 */

export default function AppRoutes() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Provider store={store}>
                    <Routes>
                        <Route path="/" element={<NavBar />}>
                            <Route index element={<Dashboard />} />
                            <Route path={HOME} element={<Dashboard />} />
                            <Route path={SUBSCRIPTION} element={<Subscription />} />
                            <Route path={PROFILE} element={<Profile />} />
                            <Route path={ROOMBUILDER} element={<RoomBuilder />} />
                        </Route>
                        <Route
                            path={ROOM}
                            element={
                                <ContextProvider>
                                    <Room />
                                </ContextProvider>
                            }
                        />
                    </Routes>
                </Provider>
            </Suspense>
        </Router>
    );
}
