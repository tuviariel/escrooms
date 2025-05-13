interface ElemObject {
    status: boolean;
    elem: string;
}
interface DigitalNumberProps {
    position: number;
    toggleSegment: (position: number, index: number) => void;
    number: ElemObject[];
    amount: number;
    category: null | any[];
}

export const DigitalNumber = (props: DigitalNumberProps) => {
    const { position, number, toggleSegment, amount, category } = props;
    // console.log(number);
    return (
        <div
            className={`relative ${
                amount < 4 ? "w-40" : "w-28 ph:w-32 sm:w-36 md:w-40"
            } h-60 flex flex-col items-center justify-center content-center bg-gray-100`}>
            {/* Category */}
            {category && (
                <img
                    src={category[position]}
                    alt=""
                    className="absolute top-12 left-16 h-8 w-8 bg-gray-100 rounded-full"
                />
            )}
            {/* Top horizontal line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 top-2 left-6 ${
                    amount < 4 ? "w-14 sph:w-22 ph:w-28" : "w-16 ph:w-20 sm:w-24 md:w-28"
                } h-8 rounded-b-3xl ${number[0]?.status ? "bg-red-500" : "bg-gray-300"}`}
                onClick={() => toggleSegment(position, 0)}>
                {number[0]?.elem.startsWith("http") || number[0]?.elem.startsWith("/src") ? (
                    <img src={number[0]?.elem} alt="" className=" h-8 w-8 m-auto" />
                ) : (
                    <div className="">{number[0]?.elem}</div>
                )}
            </div>

            {/* Top-left vertical line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 top-8 left-6 w-6 h-18 rounded-r-full ${
                    number[1]?.status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 1)}>
                {number[1]?.elem.startsWith("http") || number[1]?.elem.startsWith("/src") ? (
                    <img src={number[1]?.elem} alt="" className=" h-8 w-8 m-auto mt-4" />
                ) : (
                    <div className="rotate-270">{number[1]?.elem}</div>
                )}
            </div>

            {/* Top-right vertical line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 top-8 right-6 w-6 h-18 rounded-l-full ${
                    number[2]?.status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 2)}>
                {number[2]?.elem.startsWith("http") || number[2]?.elem.startsWith("/src") ? (
                    <img src={number[2]?.elem} alt="" className=" h-8 w-8 m-auto mt-4" />
                ) : (
                    <div className="rotate-90">{number[2]?.elem}</div>
                )}
            </div>

            {/* Middle horizontal line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 top-25 left-6 ${
                    amount < 4 ? "w-14 sph:w-22 ph:w-28" : "w-16 ph:w-20 sm:w-24 md:w-28"
                } h-8 rounded-full ${number[3]?.status ? "bg-red-500" : "bg-gray-300"}`}
                onClick={() => toggleSegment(position, 3)}>
                {number[3]?.elem.startsWith("http") || number[3]?.elem.startsWith("/src") ? (
                    <img src={number[3]?.elem} alt="" className=" h-8 w-8 m-auto" />
                ) : (
                    <div className="">{number[3]?.elem}</div>
                )}
            </div>

            {/* Bottom-left vertical line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 bottom-8 left-6 w-6 h-20 rounded-r-full ${
                    number[4]?.status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 4)}>
                {number[4]?.elem.startsWith("http") || number[4]?.elem.startsWith("/src") ? (
                    <img src={number[4]?.elem} alt="" className=" h-8 w-8 m-auto mt-4" />
                ) : (
                    <div className="rotate-270">{number[4]?.elem}</div>
                )}
            </div>

            {/* Bottom-right vertical line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 bottom-8 right-6 w-6 h-20 rounded-l-full ${
                    number[5]?.status ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => toggleSegment(position, 5)}>
                {number[5]?.elem.startsWith("http") || number[5]?.elem.startsWith("/src") ? (
                    <img src={number[5]?.elem} alt="" className=" h-8 w-8 m-auto mt-4" />
                ) : (
                    <div className="rotate-90">{number[5]?.elem}</div>
                )}
            </div>

            {/* Bottom horizontal line */}
            <div
                className={`absolute cursor-pointer hover:bg-blue-500 bottom-2 left-6 ${
                    amount < 4 ? "w-14 sph:w-22 ph:w-28" : "w-16 ph:w-20 sm:w-24 md:w-28"
                } h-8 rounded-t-3xl ${number[6]?.status ? "bg-red-500" : "bg-gray-300"}`}
                onClick={() => toggleSegment(position, 6)}>
                {number[6]?.elem.startsWith("http") || number[6]?.elem.startsWith("/src") ? (
                    <img src={number[6]?.elem} alt="" className=" h-8 w-8 m-auto" />
                ) : (
                    <div className="">{number[6]?.elem}</div>
                )}
            </div>
        </div>
    );
};
