import { quizDataP } from "../../pages/Room/Room";
import { useState } from "react";
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

import { Sortable } from "./Sortable/Sortable";

export const Puzzle6 = (props: quizDataP) => {
    const { data } = props;

    const initialPositions = [5, 3, 4, 1, 0, 2]; // scattered order
    // const targetOrder = [3, 4, 5, 0, 1, 2]; // final order as in your render
    const [items, setItems] = useState(initialPositions);

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
            src: data.quizData[idx],
            answerSrc: data.category && data.orderAnswer && data.category[data.orderAnswer[idx][0]],
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

    return (
        <div className="w-full h-full columns-2 gap-0">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {items.map((itemId) => {
                        const image = images.find((img) => img.id === itemId);
                        if (!image) return null;
                        // console.log("Items:", image);
                        return (
                            <Sortable key={image.id} id={image.id}>
                                <div className="relative">
                                    <img
                                        src={image.src}
                                        alt={`#${image.id}`}
                                        className="cursor-grab"
                                    />
                                    {image.answerSrc && (
                                        <img
                                            src={image.answerSrc}
                                            alt=""
                                            className="absolute z-20 -bottom-4 right-24 h-28 w-52"
                                        />
                                    )}
                                </div>
                            </Sortable>
                        );
                    })}
                </SortableContext>
            </DndContext>
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
