import { colorPalette } from "../../../../util/UIstyle";
import { useRoomContext } from "../../../../contexts/roomStyleContext";
interface IconObject {
    index: number;
    icon: string;
}
interface ElemObject {
    status: boolean;
    elem: IconObject;
}
interface DigitalNumberProps {
    position: number;
    toggleSegment: (position: number, index: number) => void;
    number: ElemObject[];
    amount: number;
}
// Using fixed NEON_CYAN color for segments - background color handled by parent

const INACTIVE_COLOR = "#535353";
// const SEGMENT_WIDTH = 12; // Thickness of segments
const ICON_SIZE = "2.5rem";

// Helper component for rendering an icon in a segment
const SegmentIcon = ({
    elem,
    isActive,
    position,
}: {
    elem: ElemObject;
    isActive: boolean;
    position: { x: number; y: number };
}) => {
    if (!elem?.elem) return null;
    const { roomColor } = useRoomContext();
    const NEON_CYAN = colorPalette[roomColor as keyof typeof colorPalette].bright;

    const isImage = elem.elem.icon.startsWith("http") || elem.elem.icon.startsWith("/src");

    return (
        <div
            className="absolute pointer-events-none z-20"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
            }}>
            <div
                className="rounded-full flex items-center justify-center backdrop-blur-sm border-2 transition-all"
                style={{
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    backgroundColor: isActive ? "rgba(34, 211, 238, 0.2)" : "rgba(83, 83, 83, 0.2)",
                    borderColor: isActive ? NEON_CYAN : INACTIVE_COLOR,
                    boxShadow: isActive ? `0 0 10px ${NEON_CYAN}, 0 0 20px ${NEON_CYAN}60` : "none",
                }}>
                {isImage ? (
                    <img src={elem.elem.icon} alt="" className="w-6 h-6 object-contain" />
                ) : (
                    <div className="text-white text-sm font-bold">{elem.elem.icon}</div>
                )}
            </div>
        </div>
    );
};

export const DigitalNumber = (props: DigitalNumberProps) => {
    const { position, number, toggleSegment, amount } = props;
    const { roomColor } = useRoomContext();
    const NEON_CYAN = colorPalette[roomColor as keyof typeof colorPalette].bright;
    const baseWidth = amount < 4 ? "w-32 md:w-36" : "w-28 ph:w-32 sm:w-36 md:w-40";
    const baseHeight = amount < 4 ? "h-60 md:h-72" : "h-60";

    // SVG viewBox dimensions - responsive
    const viewBoxWidth = 300;
    const viewBoxHeight = 450;
    // const segmentLength = 80; // Length of horizontal segments
    // const segmentHeight = 60; // Height of vertical segments

    // Calculate positions for icons (center of each segment)
    const iconPositions = [
        { x: 50, y: 20 }, // Segment 0: Top horizontal center
        { x: 15, y: 37 }, // Segment 1: Top-left vertical center
        { x: 85, y: 37 }, // Segment 2: Top-right vertical center
        { x: 50, y: 50 }, // Segment 3: Middle horizontal center
        { x: 15, y: 75 }, // Segment 4: Bottom-left vertical center
        { x: 80, y: 73 }, // Segment 5: Bottom-right vertical center
        { x: 50, y: 85 }, // Segment 6: Bottom horizontal center
    ];

    // SVG path definitions for each segment
    const segmentPaths = [
        `M 65 27 L 235 27 L 255 47 L 235 67 L 65 67 L 45 47 Z`,
        `M 40 55 L 60 75 L 60 225 L 40 245 L 20 225 L 20 75 Z`,
        `M 260 55 L 280 75 L 280 225 L 260 245 L 240 225 L 240 75 Z`,
        `M 65 230 L 235 230 L 255 250 L 235 270 L 65 270 L 45 250 Z`,
        `M 40 255 L 60 275 L 60 425 L 40 445 L 20 425 L 20 275 Z`,
        `M 260 255 L 280 275 L 280 425 L 260 445 L 240 425 L 240 275 Z`,
        `M 65 433 L 235 433 L 255 453 L 235 473 L 65 473 L 45 453 Z`,
        // // Segment 0: Top horizontal
        // `M ${(viewBoxWidth - segmentLength) / 2} ${SEGMENT_WIDTH / 2}
        //  L ${(viewBoxWidth + segmentLength) / 2} ${SEGMENT_WIDTH / 2}
        //  L ${(viewBoxWidth + segmentLength) / 2 - SEGMENT_WIDTH} ${SEGMENT_WIDTH * 1.5}
        //  L ${(viewBoxWidth - segmentLength) / 2 + SEGMENT_WIDTH} ${SEGMENT_WIDTH * 1.5} Z`,

        // // Segment 1: Top-left vertical
        // `M ${SEGMENT_WIDTH / 2} ${SEGMENT_WIDTH * 2}
        //  L ${SEGMENT_WIDTH * 1.5} ${SEGMENT_WIDTH * 2}
        //  L ${SEGMENT_WIDTH * 1.5} ${SEGMENT_WIDTH * 2 + segmentHeight}
        //  L ${SEGMENT_WIDTH / 2} ${SEGMENT_WIDTH * 2 + segmentHeight} Z`,

        // // Segment 2: Top-right vertical
        // `M ${viewBoxWidth - SEGMENT_WIDTH * 1.5} ${SEGMENT_WIDTH * 2}
        //  L ${viewBoxWidth - SEGMENT_WIDTH / 2} ${SEGMENT_WIDTH * 2}
        //  L ${viewBoxWidth - SEGMENT_WIDTH / 2} ${SEGMENT_WIDTH * 2 + segmentHeight}
        //  L ${viewBoxWidth - SEGMENT_WIDTH * 1.5} ${SEGMENT_WIDTH * 2 + segmentHeight} Z`,

        // // Segment 3: Middle horizontal
        // `M ${(viewBoxWidth - segmentLength) / 2} ${viewBoxHeight / 2 - SEGMENT_WIDTH / 2}
        //  L ${(viewBoxWidth + segmentLength) / 2} ${viewBoxHeight / 2 - SEGMENT_WIDTH / 2}
        //  L ${(viewBoxWidth + segmentLength) / 2 - SEGMENT_WIDTH} ${viewBoxHeight / 2 + SEGMENT_WIDTH / 2}
        //  L ${(viewBoxWidth - segmentLength) / 2 + SEGMENT_WIDTH} ${viewBoxHeight / 2 + SEGMENT_WIDTH / 2} Z`,

        // // Segment 4: Bottom-left vertical
        // `M ${SEGMENT_WIDTH / 2} ${viewBoxHeight / 2 + SEGMENT_WIDTH * 1.5}
        //  L ${SEGMENT_WIDTH * 1.5} ${viewBoxHeight / 2 + SEGMENT_WIDTH * 1.5}
        //  L ${SEGMENT_WIDTH * 1.5} ${viewBoxHeight / 2 + SEGMENT_WIDTH * 1.5 + segmentHeight}
        //  L ${SEGMENT_WIDTH / 2} ${viewBoxHeight / 2 + SEGMENT_WIDTH * 1.5 + segmentHeight} Z`,

        // // Segment 5: Bottom-right vertical
        // `M ${viewBoxWidth - SEGMENT_WIDTH * 1.5} ${viewBoxHeight / 2 + SEGMENT_WIDTH * 1.5}
        //  L ${viewBoxWidth - SEGMENT_WIDTH / 2} ${viewBoxHeight / 2 + SEGMENT_WIDTH * 1.5}
        //  L ${viewBoxWidth - SEGMENT_WIDTH / 2} ${viewBoxHeight / 2 + SEGMENT_WIDTH * 1.5 + segmentHeight}
        //  L ${viewBoxWidth - SEGMENT_WIDTH * 1.5} ${viewBoxHeight / 2 + SEGMENT_WIDTH * 1.5 + segmentHeight} Z`,

        // // Segment 6: Bottom horizontal
        // `M ${(viewBoxWidth - segmentLength) / 2} ${viewBoxHeight - SEGMENT_WIDTH * 1.5}
        //  L ${(viewBoxWidth + segmentLength) / 2} ${viewBoxHeight - SEGMENT_WIDTH * 1.5}
        //  L ${(viewBoxWidth + segmentLength) / 2 - SEGMENT_WIDTH} ${viewBoxHeight - SEGMENT_WIDTH / 2}
        //  L ${(viewBoxWidth - segmentLength) / 2 + SEGMENT_WIDTH} ${viewBoxHeight - SEGMENT_WIDTH / 2} Z`,
    ];

    return (
        <div
            className={`relative ${baseWidth} ${baseHeight} flex items-center justify-center bg-black rounded-lg`}>
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                preserveAspectRatio="xMidYMid meet">
                <defs>
                    {/* Glow effect filter - reusable for all segments */}
                    <filter id="neon-glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {segmentPaths.map((path, index) => {
                    const isActive = number[index]?.status || false;
                    const segmentColor = isActive ? NEON_CYAN : INACTIVE_COLOR;

                    return (
                        <path
                            key={index}
                            d={path}
                            fill={segmentColor}
                            className="cursor-pointer transition-all"
                            style={{
                                filter: isActive
                                    ? `drop-shadow(0 0 15px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 30px rgba(34, 211, 238, 0.4))`
                                    : "none",
                            }}
                            onClick={() => toggleSegment(position, index)}
                        />
                    );
                })}
            </svg>

            {/* Icons positioned at center of each segment */}
            {number.map((elem, index) => {
                if (!elem) return null;
                return (
                    <SegmentIcon
                        key={index}
                        elem={elem}
                        isActive={elem.status || false}
                        position={iconPositions[index]}
                    />
                );
            })}
        </div>
    );
};
