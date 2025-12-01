export const TimerLine = ({ duration }: { duration: number }) => {
    return (
        <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden mt-4">
            <div
                className="h-full bg-green-500 animate-timerLine"
                style={{ animation: `expand ${duration}ms forwards` }}></div>
        </div>
    );
};
