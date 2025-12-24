import { useLocation, useNavigate, Outlet } from "react-router"; //Outlet
import Logo from "../../assets/images/vaivrach-big.png";
import Login from "../Login";
import { useSelector } from "react-redux";
import { userType } from "../Login/Login";
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
            <div className="h-16 w-screen bg-gray-900 text-white flex items-center justify-between px-6 fixed top-0 left-0 z-30 border-b border-cyan-500/20">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    {location.pathname !== "/" &&
                        location.pathname !== "/home" &&
                        location.pathname !== "/room-builder" && (
                            <button
                                className="text-cyan-400 hover:text-cyan-300 mr-4"
                                onClick={() => navigate("/")}>
                                {"<"}
                            </button>
                        )}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                            location.pathname !== "/" && navigate("/");
                        }}>
                        <img src={Logo} alt="Logo" className="w-12 h-10" />
                    </div>
                </div>

                {/* Navigation Links */}
                <nav
                    className="hidden md:flex items-center gap-6 ml-auto mr-12"
                    dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    {/* <button className="text-white hover:text-cyan-400 transition-colors">
                        {get_text("examples", userLanguage)}
                    </button> */}
                    <button
                        onClick={() => navigate("/")}
                        className="text-white hover:text-cyan-400 transition-colors">
                        {get_text("home", userLanguage)}
                    </button>
                    <button className="text-white hover:text-cyan-400 transition-colors">
                        {get_text("subscription", userLanguage)}
                    </button>
                    <button className="text-white hover:text-cyan-400 transition-colors">
                        {get_text("about", userLanguage)}
                    </button>
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {userRedux?.user?.roomsLeft > 0 && location.pathname !== "/room-builder" && (
                        <button
                            onClick={() => navigate("/room-builder")}
                            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded-full transition-colors shadow-lg shadow-cyan-500/50">
                            <Plus size={20} />
                            {get_text("create_escape_room", userLanguage)}
                        </button>
                    )}
                    <div className="relative">
                        <Login />
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
};
