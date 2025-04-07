import { useNavigate } from "react-router";
import { ListObject } from "../../contexts/context";
export const GameCard: React.FC<ListObject> = (props) => {
    const { name, id, image } = props;
    const navigate = useNavigate();
    const openRoom = (id: string) => {
        console.log(id);
        navigate("/room/" + id);
    };
    return (
        <div
            className="relative border border-black rounded-2xl h-36 w-full cursor-pointer"
            title={`Open "${name}"`}
            onClick={() => {
                openRoom(id);
            }}>
            <div className="absolute">{name}</div>
            <img src={image} alt="" className="" />
        </div>
    );
};
