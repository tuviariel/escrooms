import { useLocation, useNavigate, Outlet } from "react-router";
import Logo from "../../assets/images/vaivrach.jpg";
// import Button from "../Button";

export const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div>
            <div className="h-12 w-screen border-b-8 border-cyan-700 text-xl text-center flex ">
                {location.pathname !== "/" && (
                    <div
                        className="text-2xl font-bold text-cyan-700 mr-auto"
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
                    className="ml-5 h-10 w-10"
                />
            </div>
            {/* <Outlet /> */}
        </div>
    );
};
