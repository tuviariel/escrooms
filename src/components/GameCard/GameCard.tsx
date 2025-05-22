import { useNavigate } from "react-router";
import { ListObject } from "../../pages/Dashboard/Dashboard";
import { get_text } from "../../util/language";
export const GameCard: React.FC<ListObject> = (props) => {
    const { name, id, image } = props;
    const navigate = useNavigate();
    const openRoom = (id: string) => {
        console.log(id);
        navigate("/room/" + id);
    };
    return (
        <div
            className="relative border border-black rounded-2xl h-36 w-full cursor-pointer overflow-hidden"
            title={`${get_text("enter_room", "he")} "${name}"`}
            onClick={() => {
                openRoom(id);
            }}>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl text-amber-50 font-bold">
                {name}
            </div>
            <img src={image} alt="" className="" />
        </div>
    );
};
