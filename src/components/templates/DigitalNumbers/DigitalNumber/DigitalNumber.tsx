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
import { useRoomContext } from "../../../../contexts/roomStyleContext";
import { colorPalette } from "../../../../util/UIstyle";

export const DigitalNumber = (props: DigitalNumberProps) => {
    const { position, number, toggleSegment, amount } = props;
    const { roomColor } = useRoomContext();

    // console.log(colorPalette[roomColor as keyof typeof colorPalette].dark);
    return (
        <div
            className={`relative ${
                amount < 4 ? "w-40" : "w-28 ph:w-32 sm:w-36 md:w-40"
            } h-60 flex flex-col items-center justify-center content-center bg-black`}>
            {/* Top horizontal line */}
            <div
                className={`absolute cursor-pointer hover:opacity-90 top-2 left-6 content-center ${
                    amount < 4 ? "w-14 sph:w-22 ph:w-28" : "w-16 ph:w-20 sm:w-24 md:w-28"
                } h-8 rounded-b-3xl`}
                style={{
                    backgroundColor: number[0]?.status
                        ? colorPalette[roomColor as keyof typeof colorPalette].dark
                        : "#535353",
                }}
                onClick={() => toggleSegment(position, 0)}>
                {number[0]?.elem?.icon.startsWith("http") ||
                number[0]?.elem?.icon.startsWith("/src") ? (
                    <img
                        src={number[0]?.elem?.icon}
                        alt=""
                        className="bg-white rounded-lg h-8 w-8 m-auto"
                    />
                ) : (
                    <div className="bg-white rounded-lg h-6 w-6 m-auto">
                        {number[0]?.elem?.icon}
                    </div>
                )}
            </div>

            {/* Top-left vertical line */}
            <div
                className={`absolute cursor-pointer hover:opacity-90 top-4 left-6 w-6 h-26 rounded-r-full content-center z-10`}
                style={{
                    backgroundColor: number[1]?.status
                        ? colorPalette[roomColor as keyof typeof colorPalette].dark
                        : "#535353",
                }}
                onClick={() => toggleSegment(position, 1)}>
                {number[1]?.elem?.icon.startsWith("http") ||
                number[1]?.elem?.icon.startsWith("/src") ? (
                    <img
                        src={number[1]?.elem?.icon}
                        alt=""
                        className="bg-white rounded-lg h-8 w-8 m-auto mt-4"
                    />
                ) : (
                    <div
                        className={`bg-white rounded-lg text-center ${
                            number[1]?.elem?.icon.length < 1 ? "rotate-270" : ""
                        } h-6 w-6 m-auto`}>
                        {number[1]?.elem?.icon}
                    </div>
                )}
            </div>

            {/* Top-right vertical line */}
            <div
                className={`absolute cursor-pointer hover:opacity-90 top-4 right-6 w-6 h-26 rounded-l-full content-center z-10`}
                style={{
                    backgroundColor: number[2]?.status
                        ? colorPalette[roomColor as keyof typeof colorPalette].dark
                        : "#535353",
                }}
                onClick={() => toggleSegment(position, 2)}>
                {number[2]?.elem?.icon.startsWith("http") ||
                number[2]?.elem?.icon.startsWith("/src") ? (
                    <img
                        src={number[2]?.elem?.icon}
                        alt=""
                        className="bg-white rounded-lg h-8 w-8 m-auto mt-4"
                    />
                ) : (
                    <div
                        className={`bg-white rounded-lg text-center ${
                            number[2]?.elem?.icon.length < 1 ? "rotate-90" : ""
                        } h-6 w-6 m-auto`}>
                        {number[2]?.elem?.icon}
                    </div>
                )}
            </div>

            {/* Middle horizontal line */}
            <div
                className={`absolute cursor-pointer hover:opacity-90 top-25 left-6 content-center ${
                    amount < 4 ? "w-14 sph:w-22 ph:w-28" : "w-16 ph:w-20 sm:w-24 md:w-28"
                } h-8 rounded-full`}
                style={{
                    backgroundColor: number[3]?.status
                        ? colorPalette[roomColor as keyof typeof colorPalette].dark
                        : "#535353",
                }}
                onClick={() => toggleSegment(position, 3)}>
                {number[3]?.elem?.icon.startsWith("http") ||
                number[3]?.elem?.icon.startsWith("/src") ? (
                    <img
                        src={number[3]?.elem?.icon}
                        alt=""
                        className="bg-white rounded-lg h-8 w-8 m-auto"
                    />
                ) : (
                    <div className="bg-white rounded-lg text-center h-6 w-6 m-auto">
                        {number[3]?.elem?.icon}
                    </div>
                )}
            </div>

            {/* Bottom-left vertical line */}
            <div
                className={`absolute cursor-pointer hover:opacity-90 bottom-4 left-6 w-6 h-26 rounded-r-full content-center z-10`}
                style={{
                    backgroundColor: number[4]?.status
                        ? colorPalette[roomColor as keyof typeof colorPalette].dark
                        : "#535353",
                }}
                onClick={() => toggleSegment(position, 4)}>
                {number[4]?.elem?.icon.startsWith("http") ||
                number[4]?.elem?.icon.startsWith("/src") ? (
                    <img
                        src={number[4]?.elem?.icon}
                        alt=""
                        className="bg-white rounded-lg h-8 w-8 m-auto mt-4"
                    />
                ) : (
                    <div
                        className={`bg-white rounded-lg text-center ${
                            number[4]?.elem?.icon.length < 1 ? "rotate-270" : ""
                        } h-6 w-6 m-auto`}>
                        {number[4]?.elem?.icon}
                    </div>
                )}
            </div>

            {/* Bottom-right vertical line */}
            <div
                className={`absolute cursor-pointer hover:opacity-90 bottom-4 right-6 w-6 h-26 rounded-l-full content-center z-10`}
                style={{
                    backgroundColor: number[5]?.status
                        ? colorPalette[roomColor as keyof typeof colorPalette].dark
                        : "#535353",
                }}
                onClick={() => toggleSegment(position, 5)}>
                {number[5]?.elem?.icon.startsWith("http") ||
                number[5]?.elem?.icon.startsWith("/src") ? (
                    <img
                        src={number[5]?.elem?.icon}
                        alt=""
                        className="bg-white rounded-lg h-8 w-8 m-auto mt-4"
                    />
                ) : (
                    <div
                        className={`bg-white rounded-lg text-center ${
                            number[5]?.elem?.icon.length < 1 ? "rotate-90" : ""
                        } h-6 w-6 m-auto`}>
                        {number[5]?.elem?.icon}
                    </div>
                )}
            </div>

            {/* Bottom horizontal line */}
            <div
                className={`absolute cursor-pointer hover:opacity-90 bottom-2 left-6 content-center ${
                    amount < 4 ? "w-14 sph:w-22 ph:w-28" : "w-16 ph:w-20 sm:w-24 md:w-28"
                } h-8 rounded-t-3xl`}
                style={{
                    backgroundColor: number[6]?.status
                        ? colorPalette[roomColor as keyof typeof colorPalette].dark
                        : "#535353",
                }}
                onClick={() => toggleSegment(position, 6)}>
                {number[6]?.elem?.icon.startsWith("http") ||
                number[6]?.elem?.icon.startsWith("/src") ? (
                    <img
                        src={number[6]?.elem?.icon}
                        alt=""
                        className="bg-white rounded-lg h-8 w-8 m-auto"
                    />
                ) : (
                    <div className="bg-white rounded-lg h-6 w-6 m-auto text-center items-center">
                        {number[6]?.elem?.icon}
                    </div>
                )}
            </div>
        </div>
    );
};
