import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Dashboard from "../pages/Dashboard";
import NavBar from "../components/Navbar";
import { route_paths } from "../util/config";
const DASHBOARD = route_paths["DASHBOARD"];
const ROOM = route_paths["ESCROOM"];
const Room = React.lazy(() => import("../pages/Room"));
// import Add from "./pages/....";
/**
 * the app's router center- currently only one main route ('/')
 * @param props none. has an option of adding the react.lazy fallback with Suspense
 * @returns app's routes map
 */

export default function AppRoutes() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* <Route path="/" element={<NavBar />}> */}
                    {/* <Route path="/add" element={<Add />} /> */}
                    <Route path={ROOM} element={<Room />} />
                    <Route path={DASHBOARD} element={<Dashboard />} />
                    {/* </Route> */}
                </Routes>
            </Suspense>
        </Router>
    );
}
