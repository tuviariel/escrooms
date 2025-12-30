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
import { colorPalette } from "../../util/UIstyle";
import { useRoomContext } from "../../contexts/roomStyleContext";

import { useUserContext } from "../../contexts/userStyleContext";
// import { get } from "aws-amplify/api";
export const Puzzle6: React.FC<Partial<TemplateProps>> = ({ data, setOpenLock }) => {
    const initialPositions = [5, 3, 4, 1, 0, 2]; // scattered order
    const [items, setItems] = useState(initialPositions);
    const [showEnd, setShowEnd] = useState(false);
    const { roomColor } = useRoomContext();
    const { userLanguage } = useUserContext();
    // --- DND Kit sensors ---
    const sensors =
        window.outerWidth > 968
            ? useSensors(
                  useSensor(PointerSensor, {
                      activationConstraint: {
                          distance: 5,
                      },
                  }),
                  useSensor(KeyboardSensor, {
                      coordinateGetter: sortableKeyboardCoordinates,
                  })
              )
            : useSensors(
                  useSensor(TouchSensor, {
                      activationConstraint: {
                          distance: 5,
                      },
                  }),
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
            answerSrc: data?.quiz[idx].title,
        }));
    };

    const [images] = useState<DraggableImage[]>(getImages());

    // --- DND Kit drag end handler ---
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        // if (!showEnd) return;
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
            // setOpenLock && setOpenLock(true);
            setShowEnd(true);
        }
    }, [items]);

    console.log("Items:", items);
    return (
        <div
            className="w-screen h-screen"
            style={{
                backgroundImage: `url(${colorPalette[roomColor as keyof typeof colorPalette].background})`,
                backgroundSize: "cover",
            }}>
            <div
                className="text-center text-2xl font-semibold p-2 pt-5"
                style={{
                    color: colorPalette[roomColor as keyof typeof colorPalette].light,
                }}>
                {get_text("puzzle6_inst", userLanguage)}
            </div>
            <div className="lg:pt-10 columns-6 gap-1" dir={userLanguage === "he" ? "rtl" : "ltr"}>
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
                                            <div
                                                className="absolute z-20 top-0 right-1/2 translate-1/2 text-xl bg-gray-800 text-white rounded-md p-1 whitespace-nowrap"
                                                style={{
                                                    color: colorPalette[
                                                        roomColor as keyof typeof colorPalette
                                                    ].light,
                                                }}>
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
                <div className="flex mx-auto justify-center">
                    <Button
                        onClick={() => setOpenLock && setOpenLock(true)}
                        className="text-medium lg:text-2xl">
                        <div>{get_text("finish", userLanguage)}</div>
                    </Button>
                </div>
            )}
        </div>
    );
};
