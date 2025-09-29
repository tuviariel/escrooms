import { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Button from "../Button";
import { Sortable } from "./Sortable/Sortable";
import { TemplateProps } from "../../pages/QuizTemplate/QuizTemplate";
import { get_text } from "../../util/language";
import { imageStyle } from "../../util/UIstyle";
import { useRoomContext } from "../../contexts/roomStyleContext";
// import { get } from "aws-amplify/api";
export const Puzzle6: React.FC<Partial<TemplateProps>> = ({ data, setOpenLock }) => {
    const initialPositions = [5, 3, 4, 1, 0, 2]; // scattered order
    const [items, setItems] = useState(initialPositions);
    const [showEnd, setShowEnd] = useState(false);
    const { roomStyle } = useRoomContext();
    // --- DND Kit sensors ---
    const sensors =
        window.outerWidth > 768
            ? useSensors(
                  useSensor(PointerSensor),
                  useSensor(KeyboardSensor, {
                      coordinateGetter: sortableKeyboardCoordinates,
                  })
              )
            : useSensors(
                  useSensor(TouchSensor),
                  useSensor(KeyboardSensor, {
                      coordinateGetter: sortableKeyboardCoordinates,
                  })
              );

    // --- Images state ---
    type DraggableImage = {
        id: number;
        src: string;
        answerSrc: string | undefined;
    };

    // Build images array based on initialPositions
    const getImages = (): DraggableImage[] => {
        return initialPositions.map((idx) => ({
            id: idx,
            src: data?.quiz[idx].image,
            answerSrc: data?.quiz[idx].title + " " + data?.quizData[idx],
        }));
    };

    const [images] = useState<DraggableImage[]>(getImages());

    // --- DND Kit drag end handler ---
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    useEffect(() => {
        const isCorrectOrder = items.every((item, index) => item === index);
        if (isCorrectOrder) {
            setOpenLock && setOpenLock(true);
            setShowEnd(true);
        }
    }, [items]);

    console.log("Items:", items);
    return (
        <div
            className="w-screen h-screen"
            style={{
                backgroundImage: `url(${imageStyle[roomStyle as keyof typeof imageStyle].semiBackground})`,
                backgroundSize: "cover",
            }}>
            <div className="text-center text-2xl font-semibold p-2 pt-5">
                {get_text("puzzle6_inst", "he")}
            </div>
            <div className="pt-10 columns-6 gap-0" dir="rtl">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}>
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((itemId) => {
                            const image = images.find((img) => img.id === itemId);
                            if (!image) return null;
                            return (
                                <Sortable key={image.id} id={image.id}>
                                    <div className="relative pt-14">
                                        <img
                                            src={image.src}
                                            alt={`#${image.id}`}
                                            className="cursor-grab w-full h-auto"
                                        />
                                        {image.answerSrc && (
                                            <div className="absolute z-20 top-0 right-1/2 translate-1/2 text-xl bg-white rounded-md p-1 whitespace-nowrap">
                                                {image.answerSrc}
                                            </div>
                                        )}
                                    </div>
                                </Sortable>
                            );
                        })}
                    </SortableContext>
                </DndContext>
            </div>
            {showEnd && (
                <div className="flex ml-2 mr-auto">
                    <Button onClick={() => setOpenLock && setOpenLock(true)}>
                        <div>{get_text("finish", "he")}</div>
                    </Button>
                </div>
            )}
        </div>
    );
};

/* {images &&
                images.slice(0, 3).map((img, idx) => (
                    <div className="relative" key={img.id}>
                        <img
                            src={img.src}
                            alt={`#${idx + 4}`}
                            className=""
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(idx)}
                            style={{ opacity: draggedIdx === idx ? 0.5 : 1, cursor: "grab" }}
                        />
                        {img.answerSrc && (
                            <img
                                src={img.answerSrc}
                                alt=""
                                className="absolute z-20 -bottom-4 right-24 h-28 w-52"
                            />
                        )}
                    </div>
                ))}
            {images &&
                images.slice(3, 6).map((img, idx) => (
                    <div className="relative" key={img.id + 3}>
                        <img
                            src={img.src}
                            alt={`#${idx + 1}`}
                            className=""
                            draggable
                            onDragStart={() => handleDragStart(idx + 3)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(idx + 3)}
                            style={{ opacity: draggedIdx === idx + 3 ? 0.5 : 1, cursor: "grab" }}
                        />
                        {img.answerSrc && (
                            <img
                                src={img.answerSrc}
                                alt=""
                                className="absolute z-20 -bottom-4 right-24 h-28 w-52"
                            />
                        )}
                    </div>
                ))} */

//         </div>
//     );
// };
