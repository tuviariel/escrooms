import { useState } from "react";
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
    disabled: boolean;
};

export const SortableCard = ({ index, id, data, borders, disabled }: Card) => {
    // console.log("id in sortable card:", id, data, borders);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });
    const { roomColor } = useRoomContext();
    const [infoShow, setInfoShow] = useState<boolean>(false);
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
    console.log(infoShow);
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${borders.includes("T") ? "border-t-8" : ""} 
                ${borders.includes("R") ? "border-r-8" : ""} 
                ${borders.includes("L") ? "border-l-8" : ""} 
                ${borders.includes("B") ? "border-b-8" : ""} 
                ${index % 2 !== 0 ? "mb-4" : "mb-1"} p-4 w-4/5 rounded shadow cursor-grab relative`}
            dir="rtl">
            {disabled && <div className="font-bold">{data.title}</div>}
            <div className="font-semibold">{data.content}</div>
            <div className="text-sm italic text-gray-700">{data.explanation}</div>
            <div className="absolute bottom-1 right-1">
                <div
                    onClick={() => setInfoShow((prev) => !prev)}
                    onMouseLeave={() => setInfoShow(false)}
                    // onTouchCancel={() => setInfoShow(false)}
                    className="rounded-4xl h-7 w-7 font-bold text-white text-center p-0.5 cursor-pointer"
                    style={{
                        backgroundColor:
                            colorPalette[roomColor as keyof typeof colorPalette].bright,
                    }}>
                    !
                </div>
                {infoShow && (
                    <>
                        <div className="absolute bottom-2 right-9 z-10 w-3 h-3 bg-black rotate-45"></div>
                        <div className="absolute bottom-0 right-10 z-20 p-2 w-96 bg-white rounded shadow-lg border-2">
                            <div className="text-sm font-semibold text-gray-600">
                                {data.interesting_insights}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
