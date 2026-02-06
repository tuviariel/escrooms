import { useEffect, useState, Dispatch, SetStateAction, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { get_text } from "../../../util/language";
import { useUserContext } from "../../../contexts/userStyleContext";
import { aiService, quizService, roomsService } from "../../../services/service";
import { stepType, subTopicsType } from "../RoomBuilder";
import { schema } from "../../../util/schemas";
import type { Schema } from "../../../../amplify/data/resource";
import { dummyQuizzes } from "../../../services/dummyRoomData";
import { parseStringToObject } from "../../../util/utils";
import { Check, PanelTopOpen, SquareStack } from "lucide-react";
import QuizInfo from "./QuizInfo";
import TimerLine from "../../../components/TimerLine";

type CreateQuizzesProps = {
    setStep: (step: stepType) => void;
    roomId: string;
    roomName: string;
    subTopics: subTopicsType;
    setSubTopics: Dispatch<SetStateAction<subTopicsType>>;
    setLoading: (loading: boolean) => void;
    loading: boolean;
    status: string;
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
        answerLimitations: "5_digits",
        // 5 digits only
        limitCheck: /^\d{5}$/
    },
    logical_or_chronological_ordering: {
        quizImg: dummyQuizzes[3].quizImg,
        hints: dummyQuizzes[3].hints,
        types: "orderBorder",
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
    setLoading,
    loading,
    status,
}: CreateQuizzesProps) => {
    const location = useLocation();
    const [localRoomId, setLocalRoomId] = useState<string>("");
    const [quizzes, setQuizzes] = useState<QuizSchemaType[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showQuiz, setShowQuiz] = useState<number>(-1);
    const [showSubTopic, setShowSubTopic] = useState<number>(-1);
    const [showSubTopicCreation, setShowSubTopicCreation] = useState<number>(-1);
    const [errorAnswers, setErrorAnswers] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [first, setFirst] = useState<boolean>(true); 
    const [completed, setCompleted] = useState<boolean>(false);
    const [automaticCreation, setAutomaticCreation] = useState<boolean>(!location.search.includes("roomId") || status === "creating" ? true : false);
    useEffect(() => {
        setAutomaticCreation(!location.search.includes("roomId") || status === "creating" ? true : false);
    }, [location.search, status]);
    const { userLanguage } = useUserContext();
    const autoRunQuizzesCalled = useRef<boolean | null>(null);

    const navigate = useNavigate();
    useEffect(() => {
        autoRunQuizzesCalled.current = false;
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
                if (quizzes.data.length > 0) {
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
                }
                setShowQuiz(-1);
                setShowSubTopic(-1);
                setErrorAnswers(Array(localSubTopics.length).fill(""));
                setAnswers(Array(localSubTopics.length).fill(""));
                automaticCreation && await autoRunQuizzes();
            } catch (err) {
                console.log("error getting data from DB", err);
            }
        };

        console.log("subTopics:", subTopics);
        if (subTopics.length > 0) {
            setShowSubTopic(-1);
            setShowSubTopicCreation(-1);
            setShowQuiz(-1);
            console.log("here");
            automaticCreation && (async () => { await autoRunQuizzes(); })();
        } else {
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
                        setShowSubTopic(-1);
                        setShowSubTopicCreation(-1);
                        setShowQuiz(-1);
                        automaticCreation && (async () => { await autoRunQuizzes(); })();
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
        } 
    }, [localRoomId]);

    const autoRunQuizzes = async () => {
        console.log("autoRunQuizzes called (should be called only once)");
        if (!autoRunQuizzesCalled.current || !automaticCreation) return;
        autoRunQuizzesCalled.current = true;
        try {
            setLoading(true);
            // Fill answers array with random 4-digit numbers as strings
            setAnswers(Array.from({ length: subTopics.length }, () => Math.floor(1000 + Math.random()*9000).toString()));
            // Track which subTopic indices have been used to avoid duplicates
            const usedIndices = new Set<number>();
            // If there are fewer than 5 subTopics, just create them all as usual
            if (subTopics.length < 5) {
                for (let i = 0; i < subTopics.length; i++) {
                    if (!subTopics[i].used) {
                        await CreateQuiz(i, subTopics[i].quiz_type);
                    }
                }
            } else {
                // Define the 4 quiz types we want to create (exactly one of each)
                const quizTypes = [
                    "physical_object_selection",
                    "event_to_category_matching",
                    "logical_or_chronological_ordering",
                    "true_false_fact_questions"
                ];  
                // Create exactly one quiz for each of the 4 types
                for (const quizType of quizTypes) {
                    // Find the first unused subTopic that matches this quiz type
                    const index = subTopics.findIndex(
                        (sub, idx) => sub.quiz_type === quizType && !sub.used && !usedIndices.has(idx)
                    );
                    if (index !== -1) {
                        // Found a matching unused subTopic, create the quiz
                        await CreateQuiz(index, quizType);
                        usedIndices.add(index);
                        console.log(`Created quiz for type: ${quizType} using subTopic at index: ${index}`);
                    } else {
                        // No unused subTopic found for this type - log warning but don't create
                        console.warn(`No unused subTopic found for quiz type: ${quizType}`);
                    }
                }
                console.log("usedIndices:", usedIndices, "length:", usedIndices.size);
                // Second: create 2 more quizzes (of any kind, just the next unused)
                    // let extraCreated = 0;
                    // for (let i = 0; i < subTopics.length && extraCreated < 2; i++) {
                    //     if (!subTopics[i].used) {
                    //         // Skip those already handled in the first pass
                    //         // (skip if this subTopic index/type was already used as the "first of its type")
                    //         // if (
                    //         //     quizTypes.includes(subTopics[i].quiz_type) &&
                    //         //     doneTypes.has(subTopics[i].quiz_type)
                    //         // ) {
                    //             await CreateQuiz(i, subTopics[i].quiz_type);
                    //             extraCreated++;
                    //         // }
                    //     }
                    // }
            }
            setLoading(false);
            setShowSubTopic(-1);
            setShowSubTopicCreation(-1);
            setShowQuiz(-1);
            if (usedIndices.size < 4) {
                setError(get_text("not_enough_quizzes", userLanguage) || "Not enough quizzes");
                return;
            } else {
                const responseRoom = await roomsService.updateRoom(roomId, {completed: "completed", public: true});
                if (responseRoom) {
                    console.log("Room updated:", responseRoom);
                    setTimeout(() => setCompleted(true), 1000);
                } else {
                    console.log("Failed to update room");
                }
            }
        } catch (err) {
            console.log("error auto running quizzes", err);
            setLoading(false);
        }
    }

    const CreateQuiz = async (index: number, type: string) => {
        if (!automaticCreation && !answers[index]) {
            setErrorAnswers(prev=> prev.map((err, idx) => idx === index ? get_text("answer_required", userLanguage) || "Answer is required" : err));
            return;
        }
        setShowSubTopic(index);
        setShowSubTopicCreation(index);
        // setParentLoading(true);
        // setLoading(true);
        setError("");

        try {
            // creating Prompt for AI:
            const prompt = `Based on the following text, create a JSON of data for the quiz about ${subTopics[index].name} of ${roomName}.
            Return the output in JSON format, where each section is represented as an object with the following fields structured like the 
            schema: ${schema[subTopics[index].quiz_type as keyof typeof schema]},
            ${subTopics[index].quiz_type === "logical_or_chronological_ordering" && 
                "and there must be exactly "+(answers[index] ? answers[index].length : 4)*2+" objects in the array."}
            The quizInstructions should be a string to instruct the user how to solve the quiz in the user's language 
            (${userLanguage === "he" ? "Hebrew" : "English"}).
            All the generated values (strings) must be in the same language as the following text. 
            Make sure not to mix up the generated values with characters from any other languages.
            Text to analyze: """${subTopics[index].content}"""`;
            const data: any = await aiService.openAI(prompt, "json");
            console.log("data:", data);
            if (!data || data.questions?.length === 0) {
                setError(get_text("no_quiz_found", userLanguage) || "No quiz found");
                return;
            } else if (data.questions) {
                let answer = "";
                if (type === "event_to_category_matching" && data.questions[0].answer) {
                    console.log("category answers:", data.questions.answer);
                    let counts: any = {};
                    let ans2: string[] = [],
                        ans3: string[] = [];
                    let answerCounts: string = "";
                    let keys = Object.keys(data?.quiz[0].answer);
                    data?.quiz.map((card: any) => {
                        if (ans2.includes(card.answer[keys[0]])) {
                            counts[card.answer[keys[0]]]++;
                        } else {
                            counts[card.answer[keys[0]]] = 1;
                            ans2.push(card.answer[keys[0]])
                        }
                        if (ans3.includes(card.answer[keys[1]])) {
                            counts[card.answer[keys[1]]]++;
                        } else {
                            counts[card.answer[keys[1]]] = 1;
                            ans3.push(card.answer[keys[1]])
                        }
                    });
                    ans2.map((item) => {
                        answerCounts += counts[item];
                    });
                    ans3.map((item) => {
                        answerCounts += counts[item];
                    });
                    answer = answerCounts;
                } else {
                    answer = Math.floor(1000 + Math.random()*9000).toString();
                }
                const quizData: QuizType = {
                    roomId: roomId,
                    type: dependentQuizTypes[type].types,
                    name: subTopics[index].mysterious_name,
                    answer: answer, //request answer from user per quiz depending on the quiz type,
                    quiz: JSON.stringify(data), //get quiz from AI response,
                    quizImg: dependentQuizTypes[type].quizImg, //from dummyData.ts as default for now,
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
                    setQuizzes((prev: QuizSchemaType[]): QuizSchemaType[] => [...prev, responseQuiz as QuizSchemaType]);
                    setShowQuiz(prev => prev + 1);
                }
            }
        } catch (err: any) {
            console.log("Error creating quiz:", err);
            setError(
                get_text("create_quiz_failed", userLanguage) ||
                    err.message ||
                    "Failed to create quiz"
            );
        }
    };
    useEffect(() => {
        completed === true && handleSubmit();
    }, [completed]);
    const handleSubmit = async () => {
        console.log("handleSubmitClicked");
        if (quizzes.length < 4) {
            setError(get_text("not_enough_quizzes", userLanguage) || "Not enough quizzes");
            return;
        }
        navigate(`/room/${roomId}?fromBuilder`);
        // setStep("preview_publish");
        console.log(setStep);
    };
    // console.log("quizzes:", quizzes);
    // console.log("subTopics:", subTopics);
    // console.log("errorAnswers:", errorAnswers);
    console.log("automaticCreation:", automaticCreation);
    return (
        <div
            className="relative max-w-3xl mt-0 mx-20 py-4 text-white"
            dir={userLanguage === "he" ? "rtl" : "ltr"}>
            {/* Created Quizzes */}
            <div className="flex flex-row-reverse gap-2.5">
                <div className="flex flex-col w-1/2">{quizzes.length > 0 && (
                    <h2 className={`flex text-2xl font-bold ${userLanguage === "he" ? "text-right" : "text-left"}`}>
                        {get_text("created_quizzes", userLanguage) || "Created Quizzes"}:
                        <span className="text-green-500 text-lg mx-2">({quizzes.length})</span>
                        {!automaticCreation && showQuiz !== -1 && <div className="cursor-pointer mr-auto my-auto" 
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
                                    // onClick={() => setShowQuiz(index)}
                                    >
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
                {completed && !loading && <div className="text-green-500" onClick={() => navigate(`/room/${roomId}?fromBuilder`)}>Show Room</div>}

                </div>
                {/* Sub-topics to create quizzes from */}
                <div className="flex flex-col w-1/2">
                    <h2 className={`flex text-2xl font-bold ${userLanguage === "he" ? "text-right" : "text-left"}`}>
                    {get_text("sub_topics_to_create_quizzes_from", userLanguage) || "Sub-topics to create quizzes from"}:
                    <span className="text-green-500 text-lg mx-2">({subTopics.length})</span>
                    {!automaticCreation && showSubTopic !== -1 && <div className="cursor-pointer mr-auto my-auto" 
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
                                // onClick={() =>
                                //     setShowSubTopic(index)
                                // }
                                >
                            <div className="flex items-center justify-between">
                                <button
                                    title={get_text("show_sub_topic", userLanguage) || "Show Sub-topic"}
                                    className="inline-block mr-2 ml-auto cursor-pointer"
                                >
                                    {subTopic.used ? <Check size={16} color="green" /> : showSubTopic !==index && <PanelTopOpen size={16} color="white" />}
                                </button>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold mb-2">{subTopic.mysterious_name} ({subTopic.name})</h3>
                                    {showSubTopicCreation === index && <TimerLine duration={14000} />}
                                </div>
                            </div>
                                <p className="mb-2">{get_text("from_the_text", userLanguage) || "From the Text"}: "{subTopic.content}"</p>
                                <p className={`mb-2 text-sm ${userLanguage === "he" && subTopic.used ? "text-right" : "text-left"}`}>
                                    {(get_text(subTopic.quiz_type, userLanguage) || subTopic.quiz_type).replace("{quiz_of}", get_text("quiz_of", userLanguage) || "quiz")} - {subTopic.used ? <span className="text-green-500">({get_text("used_sub_topic", userLanguage) || "Used to create quiz"})</span> : subTopic.explanation}
                                </p>
                                {subTopic.quiz_type !== "event_to_category_matching" && !subTopic.used && !automaticCreation && <> {/* TODO: remove this once the quizzes are created manually */}
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
                                        disabled={!answers[index] || errorAnswers[index] !== ""}
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
                </div>
            </div>
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2.5 items-center relative">
                {/* <button
                    onClick={() => handleSubmit()}
                    disabled={loading || quizzes.length < 4}
                    className="text-white bg-cyan-500 hover:bg-cyan-600 border-0 py-2.5 px-3.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading
                        ? get_text("saving_quizzes", userLanguage) || "Saving Quizzes..."
                        : get_text("save_quizzes", userLanguage) || "Save Quizzes"}
                </button> */}
            </div>
        </div>
    );
};
