import { quizData } from "../../pages/Room/Room";
import React, { useState } from "react";

export const Puzzle6 = (props: { data: quizData }) => {
    const { data } = props;
    type DraggableImage = {
        id: number;
        src: string;
        answerSrc: string | undefined;
    };

    const initialPositions = [5, 3, 4, 1, 0, 2]; // scattered order
    const getImages = (data: quizData): DraggableImage[] => {
        return initialPositions.map((idx, i) => ({
            id: i,
            src: data.quizData[idx],
            answerSrc: data.category && data.orderAnswer && data.category[data.orderAnswer[idx]],
        }));
    };

    const targetOrder = [3, 4, 5, 0, 1, 2]; // final order as in your render

    const [images, setImages] = useState<DraggableImage[]>(getImages(data));
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
    // No function is implemented here. This is just a state and type declaration section.
    // const handleDragStart = (idx: number) => setDraggedIdx(idx);
    const handleDragEnd = () => {
        setDraggedIdx(null);
    };

    const handleDrop = (idx: number) => {
        if (draggedIdx === null || draggedIdx === idx) return;
        const newImages = [...images];
        const [removed] = newImages.splice(draggedIdx, 1);
        newImages.splice(idx, 0, removed);
        setImages(newImages);
        setDraggedIdx(null);
    };
    // To make the image appear as it's being dragged, you can use the native HTML5 drag-and-drop API's `setDragImage` method.
    // This lets you set a custom drag preview. For example:
    const handleDragStart = (idx: number, e?: React.DragEvent<HTMLImageElement>) => {
        setDraggedIdx(idx);
        if (e && e.dataTransfer) {
            // Use the dragged image itself as the drag image, at its top-left corner
            const img = e.currentTarget;
            e.dataTransfer.setDragImage(img, 0, 0);
            // const img = e.currentTarget;
            // e.dataTransfer.setDragImage(img, img.width, img.height);
        }
    };
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    return (
        <div className="w-screen columns-2 gap-0">
            {images.slice(0, 3).map((img, idx) => (
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
            {images.slice(3, 6).map((img, idx) => (
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
            ))}
        </div>
    );
};
