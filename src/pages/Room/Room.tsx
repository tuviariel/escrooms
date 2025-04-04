import { useLocation, useNavigate } from "react-router";
export const Room = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.pathname);
    return (
        <div
            onClick={() => {
                navigate("/");
            }}>
            {location.pathname}
        </div>
    );
};
