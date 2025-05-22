import { quizDataP } from "../../pages/Room/Room";
import React, { useEffect, useState } from "react";

export const Puzzle6 = (props: quizDataP) => {
    const { data } = props;
    type DraggableImage = {
        id: number;
        src: string;
        answerSrc: string | undefined;
    };

    const initialPositions = [5, 3, 4, 1, 0, 2]; // scattered order
    const targetOrder = [3, 4, 5, 0, 1, 2]; // final order as in your render

    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
    const handleDragEnd = () => {
        setDraggedIdx(null);
    };
    useEffect(() => {}, []);
    const getImages = (): DraggableImage[] => {
        return initialPositions.map((idx, i) => ({
            id: i,
            src: data.quizData[idx],
            answerSrc: data.category && data.orderAnswer && data.category[data.orderAnswer[idx]],
        }));
    };
    const [images, setImages] = useState<DraggableImage[] | null>(getImages());

    const handleDrop = (idx: number) => {
        if (draggedIdx === null || draggedIdx === idx) return;
        if (images) {
            const newImages = [...images];
            const [removed] = newImages.splice(draggedIdx, 1);
            newImages.splice(idx, 0, removed);
            setImages(newImages);
            setDraggedIdx(null);
        }
    };
    const handleDragStart = (idx: number, e?: React.DragEvent<HTMLImageElement>) => {
        setDraggedIdx(idx);
        if (e && e.dataTransfer) {
            const img = e.currentTarget;
            e.dataTransfer.setDragImage(img, img.width, img.height);
        }
    };
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    return (
        <div className="w-full h-full columns-2 gap-0">
            {images &&
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
                ))}
        </div>
    );
};
