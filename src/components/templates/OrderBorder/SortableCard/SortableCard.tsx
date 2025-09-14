import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { colorPalette } from "../../../../util/UIstyle";
import { useRoomContext } from "../../../../contexts/roomStyleContext";

type Card = {
    index: number;
    id: number;
    data: {
        title: string;
        content: string;
        explanation: string;
        interesting_insights: string;
    };
    borders: string;
};

export const SortableCard = ({ index, id, data, borders }: Card) => {
    // console.log("id in sortable card:", id, data, borders);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });
    const { roomColor } = useRoomContext();
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        cursor: "grab",
        borderColor: colorPalette[roomColor as keyof typeof colorPalette].dark,
        backgroundColor: isDragging
            ? "white"
            : colorPalette[roomColor as keyof typeof colorPalette].light,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${borders.includes("T") ? "border-t-4" : ""} 
                ${borders.includes("R") ? "border-r-4" : ""} 
                ${borders.includes("L") ? "border-l-4" : ""} 
                ${borders.includes("B") ? "border-b-4" : ""} 
                ${index % 2 !== 0 ? "mb-4" : "mb-1"} p-4 w-4/5 rounded shadow cursor-grab`}>
            <div className="font-bold">{data.title}</div>
            <div className="font-semibold">{data.content}</div>
            <div className="text-sm italic text-gray-500">{data.explanation}</div>
            <div className="text-sm text-gray-700">{data.interesting_insights}</div>
        </div>
    );
};
