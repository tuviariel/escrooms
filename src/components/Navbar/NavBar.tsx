import { useLocation, useNavigate, Outlet } from "react-router"; //Outlet
import Logo from "../../assets/images/vaivrach-big.png";
import Login from "../Login";
import { useSelector } from "react-redux";
import { userType } from "../Login/Login";
// import Button from "../Button";
import { get_text } from "../../util/language";
import { useUserContext } from "../../contexts/userStyleContext";
import { Plus } from "lucide-react";

export const NavBar = () => {
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const { userLanguage } = useUserContext();
    console.log("NavBar render", userRedux);
    return (
        <div className="h-screen">
            <div className="h-12 w-screen border-b-2 border-cyan-700 text-xl text-center flex fixed top-0 left-0 bg-white z-30">
                {location.pathname !== "/" &&
                    location.pathname !== "/home" &&
                    location.pathname !== "/room-builder" && (
                        <div
                            className="text-2xl font-bold text-cyan-700 cursor-pointer ml-3 mt-1"
                            onClick={() => {
                                navigate("/");
                            }}>
                            {"<"}
                        </div>
                    )}
                <img
                    src={Logo}
                    alt="Vaivrach"
                    onClick={() => {
                        location.pathname !== "/" && navigate("/");
                    }}
                    className="ml-5 h-9 w-12 my-auto cursor-pointer"
                />
                {!userRedux?.user?.displayName && (
                    <h2 className="font-semibold text-3xl mx-auto flex underline">
                        {get_text("welcome", userLanguage)}
                    </h2>
                )}
                {userRedux?.user?.roomsLeft > 0 && location.pathname !== "/room-builder" && (
                    <button
                        onClick={() => {
                            navigate("/room-builder");
                        }}
                        className="flex mr-5 ml-auto bg-cyan-700 text-white hover:bg-cyan-600 h-8 border-black border-2 rounded-full px-3 text-sm mt-1.5 cursor-pointer items-center justify-center">
                        <Plus size={20} />
                        {get_text("new_room", userLanguage)}
                    </button>
                )}
                <div
                    className={`relative inline-block ${userRedux?.user?.roomsLeft === 0 || location.pathname === "/room-builder" ? "ml-auto" : "ml-5"} mr-5 mt-0.5`}>
                    <Login />
                </div>
            </div>
            <Outlet />
        </div>
    );
};
