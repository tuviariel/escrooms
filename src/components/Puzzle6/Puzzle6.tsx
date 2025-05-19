import { quizData } from "../../pages/Room/Room";

export const Puzzle6 = (props: { data: quizData }) => {
    const { data } = props;

    return (
        <div className="w-screen columns-2 gap-0">
            <div className="col-span-1">
                <div className="relative">
                    <img src={data.quizData[3]} alt="#4" className="" />
                    <img
                        src={
                            data.category && data.orderAnswer && data.category[data.orderAnswer[3]]
                        }
                        alt=""
                        className="absolute z-20 -bottom-4 right-24 h-28 w-52"
                    />
                </div>
                <div className="relative">
                    <img src={data.quizData[4]} alt="#5" className="" />
                    <img
                        src={
                            data.category && data.orderAnswer && data.category[data.orderAnswer[4]]
                        }
                        alt=""
                        className="absolute z-20 -bottom-4 right-24 h-28 w-52"
                    />
                </div>
                <div className="relative">
                    <img src={data.quizData[5]} alt="#6" className="" />
                    <img
                        src={
                            data.category && data.orderAnswer && data.category[data.orderAnswer[5]]
                        }
                        alt=""
                        className="absolute z-20 -bottom-4 right-24 h-28 w-52"
                    />
                </div>
            </div>
            <div className="col-span-1">
                <div className="relative">
                    <img src={data.quizData[0]} alt="#1" className="" />
                    <img
                        src={
                            data.category && data.orderAnswer && data.category[data.orderAnswer[0]]
                        }
                        alt=""
                        className="absolute z-20 -bottom-4 right-24 h-28 w-52"
                    />
                </div>
                <div className="relative">
                    <img src={data.quizData[1]} alt="#2" className="" />
                    <img
                        src={
                            data.category && data.orderAnswer && data.category[data.orderAnswer[1]]
                        }
                        alt=""
                        className="absolute z-20 -bottom-4 right-24 h-28 w-52"
                    />{" "}
                </div>
                <div className="relative">
                    <img src={data.quizData[2]} alt="#3" className="" />
                    <img
                        src={
                            data.category && data.orderAnswer && data.category[data.orderAnswer[2]]
                        }
                        alt=""
                        className="absolute z-20 -bottom-4 right-24 h-28 w-52"
                    />{" "}
                </div>
            </div>
        </div>
    );
};
