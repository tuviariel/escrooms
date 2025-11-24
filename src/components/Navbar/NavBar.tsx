import { useLocation, useNavigate, Outlet } from "react-router"; //Outlet
import Logo from "../../assets/images/vaivrach.png";
import Login from "../Login";
import { useSelector } from "react-redux";
import { userType } from "../Login/Login";
// import Button from "../Button";
import { get_text } from "../../util/language";

export const NavBar = () => {
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    console.log("NavBar render", userRedux);
    return (
        <div className="min-h-screen h-screen">
            <div className="h-12 w-screen border-b-8 border-cyan-700 text-xl text-center flex fixed top-0 left-0 bg-white z-10 opacity-70">
                {location.pathname !== "/" && (
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
                    className="ml-5 h-10 w-10 cursor-pointer"
                />
                {!userRedux?.user.displayName && (
                    <h2 className="font-semibold text-3xl mx-auto flex underline">
                        {get_text("welcome", "he")}
                    </h2>
                )}
                {userRedux?.user.roomsLeft > 0 && (
                    <div
                        onClick={() => {
                            navigate("/room-builder");
                        }}
                        className="mr-5 ml-auto bg-cyan-700 text-white hover:bg-cyan-800 inline-block h-8 border-cyan-950 border rounded-full px-4 mt-1 cursor-pointer items-center justify-center">
                        {get_text("new_room", "he")}
                    </div>
                )}
                <div className={`relative inline-block mx-5`}>
                    <Login />
                </div>
            </div>
            <Outlet />
        </div>
    );
};
