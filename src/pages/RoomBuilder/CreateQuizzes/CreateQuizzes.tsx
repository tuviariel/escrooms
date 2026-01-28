import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { get_text } from "../../../util/language";
import { useUserContext } from "../../../contexts/userStyleContext";
import { aiService, quizService, roomsService } from "../../../services/service";
// import { useSelector } from "react-redux";
// import { userType } from "../../../components/Login/Login";
import { stepType, subTopicsType } from "../RoomBuilder";
import { schema } from "../../../util/schemas";
import loadingSpinner from "../../../assets/images/loading.gif";
import type { Schema } from "../../../../amplify/data/resource";
import { dummyQuizzes } from "../../../services/dummyRoomData";
import { parseStringToObject } from "../../../util/utils";
import { Check, PanelTopOpen, SquareStack } from "lucide-react";
import QuizInfo from "./QuizInfo";

type CreateQuizzesProps = {
    setStep: (step: stepType) => void;
    roomId: string;
    roomName: string;
    subTopics: subTopicsType;
    setSubTopics: Dispatch<SetStateAction<subTopicsType>>;
    setParentLoading: (loading: boolean) => void;
};
export type QuizSchemaType = Schema["Quiz"]["type"];
type QuizType = {
    roomId: string;
    type: string;
    name: string;
    answer: string;
    quiz: any;
    quizImg: string;
    quizText: string;
    hints: string[] | any;
};
const dependentQuizTypes: Record<string, {
    quizImg: string,
    hints: any,
    types: string,
    answerLimitations: string,
    limitCheck: RegExp
}> = {
    true_false_fact_questions: {
        quizImg: dummyQuizzes[0].quizImg,
        hints: dummyQuizzes[0].hints,
        types: "7segments",
        answerLimitations: "3-4_digits",
        // 3-4 digits only, e.g. "123" or "2345"
        limitCheck: /^\d{3,4}$/
    },
    physical_object_selection: {
        quizImg: dummyQuizzes[1].quizImg,
        hints: dummyQuizzes[1].hints,
        types: "gridPlay",
        answerLimitations: "3-5_digits_letters",
        // 3-5 alphanumeric (Hebrew or English letters or digits)
        // Let's make it accept Hebrew, English, or digits: Regex [\dA-Za-z\u0590-\u05FF]{3,5}
        limitCheck: /^[\dA-Za-z\u0590-\u05FF]{3,5}$/
    },
    event_to_category_matching: {
        quizImg: dummyQuizzes[2].quizImg,
        hints: dummyQuizzes[2].hints,
        types: "colorChange",
        answerLimitations: "1-3_digits",
        // 1-3 digits only
        limitCheck: /^\d{1,3}$/
    },
    logical_or_chronological_ordering: {
        quizImg: dummyQuizzes[3].quizImg,
        hints: dummyQuizzes[3].hints,
        types: "borderOrder",
        answerLimitations: "2-5_digits",
        // 2-5 digits only
        limitCheck: /^\d{2,5}$/
    },
}
const LOCAL_KEY = "createQuizzes_";

export const CreateQuizzes = ({
    setStep,
    roomId,
    roomName,
    subTopics,
    setSubTopics,
    setParentLoading,
}: CreateQuizzesProps) => {
    // Import Quiz type directly from resource schema
    const [localRoomId, setLocalRoomId] = useState<string>("");
    const [quizzes, setQuizzes] = useState<QuizSchemaType[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showQuiz, setShowQuiz] = useState<number>(-1);
    const [showSubTopic, setShowSubTopic] = useState<number>(-1);
    const [errorAnswers, setErrorAnswers] = useState<string[]>([]);
    const [status, setStatus] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [first, setFirst] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const { userLanguage } = useUserContext();
    // const userRedux: any = useSelector((state: { user: userType }) => state.user);
    useEffect(() => {
        if(roomId !== localRoomId) {
            localStorage.removeItem(LOCAL_KEY+localRoomId);
            setLocalRoomId(roomId);

        }
    }, [roomId]);
    // Save draft on every change in localStorage
    useEffect(() => {
        if (first) {
            setFirst(false);
            return;
        }
        try {
            localStorage.setItem(
                LOCAL_KEY+(localRoomId !== "" ? localRoomId : roomId),
                JSON.stringify({
                    quizzes,
                    subTopics,
                })
            );
        } catch {
            // ignore storage errors
        }
        return () => {
            localStorage.removeItem(LOCAL_KEY+localRoomId);
        }
    }, [quizzes, subTopics]);

    // Load draft from localStorage
    useEffect(() => {
        const getSubTopicsFromDB = async (roomId: string) => {
            try {
                console.log("getting subTopics from DB: for room", roomId);
                const roomDataFromServer = await roomsService.getRoomById(roomId);
                console.log("roomDataFromServer:", roomDataFromServer);
                const localSubTopics = parseStringToObject(roomDataFromServer[0].sourceData).sub_topics;
                setSubTopics(localSubTopics);
                const quizzes = await roomDataFromServer[0].quizzes();
                console.log("Fetched quizzes for room:", quizzes.data);
                const cleanQuizzes = quizzes.data.map((quiz: any) => {
                    const updatedHints = parseStringToObject(quiz.hints);
                    const updatedQuiz = parseStringToObject(quiz.quiz);
                    return {
                        ...quiz,
                        hints: updatedHints.hints,
                        quiz: updatedQuiz.questions,
                        room: "",
                    };
                });
                setQuizzes(cleanQuizzes);
                setShowQuiz(-1);
                setShowSubTopic(-1);
                setErrorAnswers(Array(localSubTopics.length).fill(""));
                setAnswers(Array(localSubTopics.length).fill(""));   
            } catch (err) {
                console.log("error getting data from DB", err);
            }
        };
        console.log("subTopics:", subTopics);

        // if (subTopics.length > 0) {
        //     console.log("subTopics already loaded");
        //     return;
        // } else {
            try {
                console.log("loading draft from localStorage");
                const raw = localStorage.getItem(LOCAL_KEY+(localRoomId !== "" ? localRoomId : roomId));
                if (raw) {
                    const parsed = JSON.parse(raw);
                    console.log(roomId,"parsed:", parsed);
                    if (parsed?.subTopics?.length === 0) {
                        getSubTopicsFromDB(roomId);
                    } else {
                        setQuizzes(parsed.quizzes || []);
                        setSubTopics(parsed.subTopics || []);
                    }
                } else if (roomId) {
                    getSubTopicsFromDB(roomId);
                } else {
                    setError(get_text("no_room_found", userLanguage) || "No room found");
                }
            } catch (err) {
                console.log("error getting data from DB", err);
                setError(get_text("error_getting_data_from_db", userLanguage) || "Error getting data from DB");
            }
        // } 
    }, [localRoomId]);

    const CreateQuiz = async (index: number, type: string) => {
        if (!answers[index]) {
            setErrorAnswers(prev=> prev.map((err, idx) => idx === index ? get_text("answer_required", userLanguage) || "Answer is required" : err));
            return;
        }
        setParentLoading(true);
        setLoading(true);
        setError("");
        setStatus("");

        try {
            // creating Prompt for AI:
            const prompt = `Based on the text, create a JSON of data for the quiz about ${subTopics[index].name} of ${roomName}.
            Return the output in JSON format, where each section is represented as an object with the following fields structured like the 
            schema: ${schema[subTopics[index].quiz_type as keyof typeof schema]},
            ${subTopics[index].quiz_type === "logical_or_chronological_ordering" && 
                "and there must be exactly "+(answers[index].length*2)+" objects in the array."}
            All the generated values (strings) must be in the same language as the text to analyze.
            The quizInstructions should be a string to instruct the user how to solve the quiz in the user's language 
            (${userLanguage === "he" ? "Hebrew" : "English"}).
            Text to analyze: """${subTopics[index].content}"""`;
            const data: any = await aiService.openAI(prompt, "json");
            console.log("data:", data);
            if (!data || data.questions?.length === 0) {
                setError(get_text("no_quiz_found", userLanguage) || "No quiz found");
                return;
            } else if (data.questions) {
                const quizData: QuizType = {
                    roomId: roomId,
                    type: dependentQuizTypes[type].types,
                    name: subTopics[index].mysterious_name,
                    answer: answers[index], //request answer from user per quiz depending on the quiz type,
                    quiz: JSON.stringify(data), //get quiz from AI response,
                    quizImg: dependentQuizTypes[type].quizImg, //Graph as default for now,
                    quizText: data.quizInstructions, //gen instructions for the quiz,
                    hints: JSON.stringify(dependentQuizTypes[type].hints), //get hints by quiz type for now,
                };
                // Create room in the database:
                const responseQuiz = await quizService.createQuiz(quizData);
                console.log("Creating quiz with data:", quizData);
                if (responseQuiz) {
                    console.log("Quiz created:", responseQuiz);
                    setSubTopics((prev: subTopicsType): subTopicsType => 
                        prev.map((sub, idx) => idx === index ? { ...sub, used: true } : sub)
                    );
                    const newSourceData = {
                        sub_topics: subTopics.map((sub, idx) => idx === index ? { ...sub, used: true } : sub),
                    };
                    if (roomId) {
                        try {
                            await roomsService.updateRoom(roomId, {
                                sourceData: JSON.stringify(newSourceData),
                            });
                        } catch (updateErr) {
                            console.error("Failed to update sourceData.sub_topics:", updateErr);
                        }
                    }
                    setQuizzes([...quizzes, responseQuiz]);
                }
            }
        } catch (err: any) {
            console.log("Error creating quiz:", err);
            setError(
                get_text("create_quiz_failed", userLanguage) ||
                    err.message ||
                    "Failed to create quiz"
            );
        } finally {
            setParentLoading(false);
            setLoading(false);
        }
    };
    const handleSubmit = async () => {
        console.log("handleSubmitClicked");
        if (quizzes.length < 4) {
            setError(get_text("not_enough_quizzes", userLanguage) || "Not enough quizzes");
            return;
        }
        setStep("preview_publish");
    };
    // console.log("quizzes:", quizzes);
    // console.log("subTopics:", subTopics);
    // console.log("errorAnswers:", errorAnswers);
    return (
        <div
            className="max-w-3xl mt-0 mx-20 py-4 text-white"
            dir={userLanguage === "he" ? "rtl" : "ltr"}>
            {/* Created Quizzes */}
            {quizzes.length > 0 && (
                <h2 className={`flex text-2xl font-bold ${userLanguage === "he" ? "text-right" : "text-left"}`}>
                    {get_text("created_quizzes", userLanguage) || "Created Quizzes"}:
                    <span className="text-green-500 text-lg mx-2">({quizzes.length})</span>
                    {showQuiz !== -1 && <div className="cursor-pointer mr-auto my-auto" 
                        onClick={() => setShowQuiz(-1)}
                        title={get_text("close_all_quizzes", userLanguage) || "Close All Quizzes"}>
                            <SquareStack size={16} color="white" />
                    </div>}
                </h2>
            )}
            {quizzes.map((quiz, index) => {
                return (
                    <div
                        key={index}
                        className={`p-3 bg-gray-900/50 border border-gray-500 rounded-lg text-gray-200 mb-1 transition-all duration-500 ease-in-out scrollbar cursor-pointer ${showQuiz===index ? "max-h-screen opacity-100 overflow-auto" : "max-h-12 opacity-60 overflow-hidden"}`}
                            style={{
                                transitionProperty: 'max-height, opacity',
                            }}
                            onClick={() => setShowQuiz(index)}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">{quiz.name} - {" "}
                            <span>{(get_text(Object.entries(dependentQuizTypes).find(
                                ([, val]) => val.types === quiz.type
                            )?.[0] as string, userLanguage) || quiz.type).replace("{quiz_of}", get_text("quiz_of", userLanguage) || "quiz")}</span></h3>
                            {showQuiz !==index && <div className="cursor-pointer" title={get_text("show_quiz", userLanguage) || "Show Quiz"}><PanelTopOpen size={16} color="white" /></div>}
                        </div>
                        {showQuiz===index && <QuizInfo {...quiz as QuizSchemaType} />}
                        {/* <button onClick={() => DeleteQuiz(quiz.id)}>{get_text("delete_quiz", userLanguage) || "Delete Quiz"}</button> */}
                        {/* <button onClick={() => EditQuiz(quiz.id)}>{get_text("edit_quiz", userLanguage) || "Edit Quiz"}</button> */}
                    </div>
                );
            })}
            {/* Sub-topics to create quizzes from */}
            <h2 className={`flex text-2xl font-bold ${userLanguage === "he" ? "text-right" : "text-left"}`}>
                    {get_text("sub_topics_to_create_quizzes_from", userLanguage) || "Sub-topics to create quizzes from"}:
                    <span className="text-green-500 text-lg mx-2">({subTopics.length})</span>
                    {showSubTopic !== -1 && <div className="cursor-pointer mr-auto my-auto" 
                        onClick={() => setShowSubTopic(-1)}
                        title={get_text("close_all_sub_topics", userLanguage) || "Close All Sub-topics"}>
                            <SquareStack size={16} color="white" />
                    </div>}
            </h2>
            {subTopics.length > 0 &&
                subTopics.map((subTopic, index) => {
                    return (
                        <div
                            key={index}
                            // Animate expand/collapse using transition on max-height and opacity.
                            className={`p-3 bg-gray-900/50 border border-gray-500 rounded-lg text-gray-200 mb-1 transition-all duration-500 ease-in-out scrollbar cursor-pointer ${showSubTopic===index ? "max-h-screen opacity-100 overflow-auto" : "max-h-12 opacity-60 overflow-hidden"}`}
                            style={{
                                transitionProperty: 'max-height, opacity',
                            }}
                            onClick={() =>
                                setShowSubTopic(index)
                            }>
                        <div className="flex items-center justify-between">
                            <button
                                // onClick={() =>
                                //     setShowSubTopic((prev) =>
                                //         prev.map((show, idx) => idx === index ? false : show)
                                //     )
                                // }
                                title={get_text("show_sub_topic", userLanguage) || "Show Sub-topic"}
                                className="inline-block mr-2 ml-auto cursor-pointer"
                            >
                                {subTopic.used ? <Check size={16} color="green" /> : showSubTopic !==index && <PanelTopOpen size={16} color="white" />}
                            </button>
                            <h3 className="text-lg font-bold mb-2">{subTopic.mysterious_name} ({subTopic.name})</h3>
                        </div>
                            <p className="mb-2">{get_text("from_the_text", userLanguage) || "From the Text"}: "{subTopic.content}"</p>
                            <p className={`mb-2 text-sm ${userLanguage === "he" && subTopic.used ? "text-right" : "text-left"}`}>
                                {(get_text(subTopic.quiz_type, userLanguage) || subTopic.quiz_type).replace("{quiz_of}", get_text("quiz_of", userLanguage) || "quiz")} - {subTopic.used ? <span className="text-green-500">({get_text("used_sub_topic", userLanguage) || "Used to create quiz"})</span> : subTopic.explanation}
                            </p>
                            {!subTopic.used && <>
                                <label className="flex text-lg mb-1.5 text-white">
                                    {get_text("the_quiz_answer", userLanguage)}{" "}
                                    <span
                                        className="text-red-400 cursor-pointer"
                                        title={get_text("mandatory_field", userLanguage)}>
                                        *
                                    </span>
                                    <span className={`text-sm mt-1 ${userLanguage === "he" ? "mr-2" : "ml-2"} ${errorAnswers[index] ? "text-red-500" : "text-white"}`}>({get_text(dependentQuizTypes[subTopic.quiz_type].answerLimitations, userLanguage) || dependentQuizTypes[subTopic.quiz_type].answerLimitations})</span>
                                    {errorAnswers[index] && <span className="text-sm mt-1 text-red-500">-{errorAnswers[index]}</span>}
                                </label>
                                <input
                                    type="text"
                                    placeholder={get_text("enter_answer", userLanguage) || "Enter Answer"}
                                    className={`w-full p-2 rounded-lg border text-white bg-gray-800 ${errorAnswers[index] ? "border-red-500" : "border-[#e5e7eb]"}`}
                                    value={answers[index] || ""}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setAnswers(prev => {
                                            const newAnswers = [...prev];
                                            newAnswers[index] = newValue;
                                            return newAnswers;
                                        });
                                        if (newValue.length > 2 && dependentQuizTypes[subTopic.quiz_type].limitCheck.test(newValue)) {
                                            setErrorAnswers(prev => prev.map((err, idx) => idx === index ? "" : err));
                                        } else {
                                            setErrorAnswers(prev => prev.map((err, idx) => idx === index ? get_text("answer_limitations", userLanguage) || "Answer limitations" : err));
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (dependentQuizTypes[subTopic.quiz_type].limitCheck.test(e.target.value)) {
                                            setErrorAnswers(prev => prev.map((err, idx) => idx === index ? "" : err));
                                        } else {
                                            setErrorAnswers(prev => prev.map((err, idx) => idx === index ? get_text("answer_limitations", userLanguage) || "Answer limitations" : err));
                                        }
                                    }}
                                />
                                <button
                                    key={index}
                                    onClick={() => CreateQuiz(index, subTopic.quiz_type)}
                                    disabled={!answers[index] || errorAnswers[index] !== "" ? true : false}
                                    className={`mt-2 text-white bg-cyan-500 hover:bg-cyan-600 border-0 py-2.5 px-3.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {(get_text("create_quiz_about", userLanguage) || "Create Quiz about")
                                        .replace("{quiz_type}", get_text(subTopic.quiz_type, userLanguage) || subTopic.quiz_type).replace("{quiz_of}", get_text("quiz_of", userLanguage) || "quiz")}
                                    : {subTopic.name || subTopic.mysterious_name}
                                </button>
                            </>}
                        </div>
                    );
                })}
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                    {error}
                </div>
            )}

            {/* Status Message */}
            {status && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
                    {status}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2.5 items-center relative">
                <button
                    onClick={() => handleSubmit()}
                    disabled={loading || quizzes.length < 4}
                    className="text-white bg-cyan-500 hover:bg-cyan-600 border-0 py-2.5 px-3.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading
                        ? get_text("saving_quizzes", userLanguage) || "Saving Quizzes..."
                        : get_text("save_quizzes", userLanguage) || "Save Quizzes"}
                </button>
                {/* <button
                    onClick={() => {
                        localStorage.removeItem(LOCAL_KEY);
                        setTopic("");
                        setSubTopic("");
                        setInputType("file");
                        setSelectedFile(null);
                        setTextContent("");
                        setUrlContent("");
                        setStatus("");
                        setError("");
                    }}
                    disabled={
                        loading ||
                        (!topic.trim() &&
                            ((inputType === "file" && !selectedFile) ||
                                (inputType === "text" && !textContent.trim()) ||
                                (inputType === "url" && !urlContent.trim())))
                    }
                    className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-2.5 px-3 rounded-lg cursor-pointer transition-colors">
                    {get_text("clear", userLanguage) || "Clear"}
                </button> */}
                {loading && (
                    <img
                        src={loadingSpinner}
                        alt="loading"
                        className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                )}
            </div>
        </div>
    );
};
