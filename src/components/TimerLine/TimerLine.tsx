// import { useRoomContext } from "../../contexts/roomStyleContext";
// import { colorPalette } from "../../util/UIstyle";

export const TimerLine = ({ duration }: { duration: number }) => {
    // const { roomColor } = useRoomContext();
    return (
        <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden mt-4">
            <div
                style={{
                    // backgroundColor: colorPalette[roomColor as keyof typeof colorPalette].dark,
                    animation: `expand ${duration}ms forwards`,
                }}
                className="h-full bg-green-500 animate-timerLine"></div>
        </div>
    );
};
