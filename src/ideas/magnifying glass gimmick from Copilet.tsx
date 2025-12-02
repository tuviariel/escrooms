import { useRef, useState, useEffect } from 'react';
import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';

const MagnifierImage = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 800, height: 500 });

  const sensors = useSensors(useSensor(PointerSensor));

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'magnifier',
  });

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (event: any) => {
    setIsDragging(false);
    const { delta } = event;
    setPosition(prev => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  };

  useEffect(() => {
    const updateSize = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const magnifierSize = window.innerWidth < 640 ? 100 : 150;
  const zoom = 2;

  return (
    <div className="relative w-full max-w-4xl mx-auto touch-none">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <img
          ref={imageRef}
          src="https://placekitten.com/800/500"
          alt="Main"
          className="w-full h-auto block"
        />

        {/* Draggable Magnifier Icon */}
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className="absolute z-20 bg-cover bg-center rounded-full cursor-grab"
          style={{
            top: position.y,
            left: position.x,
            width: 50,
            height: 50,
            backgroundImage:
              'url("https://cdn-icons-png.flaticon.com/512/709/709592.png")',
            transform: transform
              ? translate(${transform.x}px, ${transform.y}px)
              : undefined,
          }}
        />

        {/* Magnified View */}
        {isDragging && (
          <div
            className="absolute z-30 border-2 border-gray-700 rounded-full shadow-lg overflow-hidden"
            style={{
              top: position.y - magnifierSize / 2,
              left: position.x + 80,
              width: magnifierSize,
              height: magnifierSize,
            }}
          >
            <div
              className="absolute"
              style={{
                top: -position.y * zoom + magnifierSize / 2,
                left: -position.x * zoom + magnifierSize / 2,
                width: imageSize.width * zoom,
                height: imageSize.height * zoom,
                backgroundImage: 'url("https://placekitten.com/800/500")',
                backgroundSize: ${imageSize.width * zoom}px ${imageSize.height * zoom}px,
              }}
            />
          </div>
        )}
      </DndContext>
    </div>
  );
};

export default MagnifierImage;