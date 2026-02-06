import { useEffect, useState } from "react";
import { get_text } from "../../../util/language";
import { useUserContext } from "../../../contexts/userStyleContext";
// import { fileStorage } from "../../../services/service";
import { aiService, roomsService } from "../../../services/service";
import { useSelector } from "react-redux";
import { userType } from "../../../components/Login/Login";
import { stepType } from "../RoomBuilder";
import { schema } from "../../../util/schemas";
// import { parseStringToObject } from "../../../util/utils";
// import { fieldsOfStudy } from "../../../util/utils";
// import loadingSpinner from "../../../assets/images/loading.gif";
import { Sparkles } from "lucide-react";
import { Dialog } from "../../../components/Dialog/Dialog";

type TopicAndDataProps = {
    setStep: (step: stepType) => void;
    setRoomId: (id: string) => void;
    setSubTopics: (subTopics: any[]) => void;
    setLoading: (loading: boolean) => void;
    loading: boolean;
};

const LOCAL_KEY = "topicAndData";

type InputType = "file" | "text" | "url";

export const TopicAndData = ({
    setStep,
    setRoomId,
    setSubTopics,
    setLoading,
    loading,
}: TopicAndDataProps) => {
    const [topic, setTopic] = useState<string>("");
    const [subTopic, setSubTopic] = useState<string>("");
    const [moreInstructions, setMoreInstructions] = useState<string>("");
    const [inputType, setInputType] = useState<InputType>("text");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [textContent, setTextContent] = useState<string>("");
    const [urlContent, setUrlContent] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [addToContent, setAddToContent] = useState<boolean>(false);
    const [first, setFirst] = useState<boolean>(true);
    const [openDialogArticle, setOpenDialogArticle] = useState<boolean>(false);
    const { userLanguage } = useUserContext();
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    // Save draft on every change
    useEffect(() => {
        if (first) {
            setFirst(false);
            return;
        }
        try {
            localStorage.setItem(
                LOCAL_KEY,
                JSON.stringify({
                    topic,
                    subTopic,
                    inputType,
                    textContent,
                    urlContent,
                })
            );
        } catch {
            // ignore storage errors
        }
    }, [topic, subTopic, inputType, textContent, urlContent]);

    // Load draft from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LOCAL_KEY);
            // console.log(raw);
            if (raw) {
                const parsed = JSON.parse(raw);
                setTopic(parsed.topic || "");
                setSubTopic(parsed.subTopic || "");
                setInputType(parsed.inputType || "text");
                setTextContent(parsed.textContent || "");
                setUrlContent(parsed.urlContent || "");
            }
        } catch {
            // ignore parse errors
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileExtension = file.name.split(".").pop()?.toLowerCase();
            if (fileExtension === "docx" || fileExtension === "pdf") {
                setSelectedFile(file);
                setError("");
            } else {
                setError(
                    get_text("invalid_file_type", userLanguage) ||
                        "Please select a DOCX or PDF file"
                );
                setSelectedFile(null);
            }
        }
    };

    const handleSubmit = async () => {
        if (!topic.trim()) {
            setError(get_text("topic_required", userLanguage) || "Topic is required");
            return;
        }
        // Validate input based on selected type
        if (inputType === "file" && !selectedFile) {
            setError(get_text("file_required", userLanguage) || "Please select a file");
            return;
        }
        if (inputType === "text" && !textContent.trim()) {
            setError(get_text("text_required", userLanguage) || "Please enter text content");
            return;
        }
        if (inputType === "url") {
            if (!urlContent.trim()) {
                setError(get_text("url_required", userLanguage) || "Please enter a URL");
                return;
            }
            // Basic URL validation
            try {
                new URL(urlContent);
            } catch {
                setError(
                    get_text("invalid_url", userLanguage) ||
                        "Please enter a valid URL (e.g., https://example.com)"
                );
                return;
            }
        }
        setLoading(true);
        setError("");
        setStatus("");

        try {
            // for option if needed to create room before generating subtopics (for file upload with room.id):
            // let currentRoomId: string;
            // const newRoom = await roomsService.createRoom({
            //     creatorId: userRedux.user.id,
            //     name: topic || "New Room",
            //     topic: topic,
            //     field: "general",
            //     type: "educational",
            //     description: "",
            //     completed: "topic_and_data",
            // });
            // if (!newRoom || !newRoom.id) {
            //     throw new Error("Failed to create room");
            // } else {
            //     currentRoomId = newRoom.id;
            //     setRoomId(currentRoomId);
            // }

            let documentInput: string = "";
            if (inputType === "file") {
                // Upload file to storage and send the file path
                // const uploadResult = await fileStorage.uploadFile(selectedFile!, currentRoomId);
                // console.log("File upload", uploadResult);
                // if (!uploadResult) {
                //     throw new Error("File upload failed");
                // }
                // documentInput = `images/${currentRoomId}/${selectedFile!.name}`;
            } else if (inputType === "text") {
                // Send raw text content directly (handler will detect it's plain text)
                documentInput = textContent;
            } else if (inputType === "url") {
                // Send URL directly (handler will detect it's a URL and scrape it)
                documentInput = urlContent;
            }
            // console.log("documentInput:", documentInput);

            // creating Prompt for AI:
            const prompt = `Take the following text, assuming it's title is ${topic} ${subTopic ? `and it's specific goal or description is ${subTopic}` : ""},
            and assuming that the user is a teacher or a lecturer, and the text is a lecture, a lesson, or a summary of a course, with an introduction and a conclusion.
            Analyze the text by dividing it into distinct subtopics according to the logical text structures and the paragraph structures.
            Return the output in JSON format, where each subtopic is represented as an object with the following fields structured like the schema: ${schema.topicAndData}.
            Text to analyze: """${documentInput}"""`;
            const data: any = await aiService.openAI(prompt, "json");
            console.log("data:", data);
            if (!data || data.sub_topics.length === 0) {
                setError(get_text("no_subtopics_found", userLanguage) || "No subtopics found");
                return;
            } else if (Array.isArray(data.sub_topics) && data.sub_topics.length > 0) {
                // Add a 'used' field (initialized to false) to each subtopic object
                data.sub_topics = data.sub_topics.map((sub: any) => ({
                    ...sub,
                    used: false,
                }));
                setSubTopics(data.sub_topics);
                // Create room in the database:
                const newRoom = await roomsService.createRoom({
                    creatorId: userRedux.user.id,
                    colorPalette: "blueToRed",
                    imageStyle: "realistic",
                    fontFamily: "sansSerif",
                    name: topic || "New Room",
                    sourceData: JSON.stringify(data),
                    topic: topic,
                    field: "general",
                    type: "educational",
                    description: "",
                    completed: "topic_and_data",
                });
                if (!newRoom || !newRoom.id) {
                    setError(
                        get_text("failed_to_create_room", userLanguage) || "Failed to create room"
                    );
                    return;
                } else {
                    setRoomId(newRoom.id);
                    localStorage.removeItem(LOCAL_KEY);
                    setStep("create_quizzes"); //room_info
                }
            }
        } catch (err: any) {
            console.log("Error processing document:", err);
            setError(err.message || get_text("processing_failed", userLanguage));
        } finally {
            setLoading(false);
        }
    };
    const generateContent = async () => {
        setLoading(true);
        try {
            const prompt = `Generate an article about ${topic} ${subTopic ? `and specifically relate to ${subTopic}` : ""}
            ${moreInstructions ? `and the content of the article should be according to the following instructions: ${moreInstructions}` : ""}.
            The article must be at least 1500 words long, must relay on real facts and information, and must be written in ${userLanguage === "he" ? "Hebrew" : "English"} language.
            Return the output in JSON format structured like the schema: ${schema.article}.`;
            const data: any = await aiService.openAI(prompt, "json");
            console.log("data:", data);
            if (!data || !data.article) {
                setError(get_text("no_content_found", userLanguage) || "No content found");
                return;
            } else if (data.article) {
                addToContent ? setTextContent(prev => prev + "\n\n" + data.article) : setTextContent(data.article);
                setOpenDialogArticle(false);
            }
        } catch (err: any) {
            console.log("Error generating content:", err.message);
            setError(err.message || get_text("generating_content_failed", userLanguage));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="max-w-3xl mt-0 mx-20 py-4 text-white"
            dir={userLanguage === "he" ? "rtl" : "ltr"}>
            {/* Type- for adding options like non generated rooms for private events */}
            {/* <div className="mb-3">
                <label className="flex text-lg mb-1.5">
                    {get_text("room_type", userLanguage)}{" "}
                    <span
                        className="text-red-500 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
                <select
                    // disabled={roomInfo.mainImage}
                    value={roomInfo.roomType}
                    onChange={(e) => update({ roomType: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#e5e7eb]">
                    <option>{get_text("choose_room_type", userLanguage)}</option>
                    <option value="personal">{get_text("personal", userLanguage)}</option>
                    <option value="educational">{get_text("educational", userLanguage)}</option>
                </select>
            </div> */}
            {/* Field */}
            {/* <div className="mb-3">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("room_field", userLanguage)}{" "}
                    <span
                        className="text-red-400 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
                <select
                    // disabled={roomInfo.mainImage}
                    value={roomInfo.roomField}
                    onChange={(e) => update({ roomField: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white">
                    <option>{get_text("choose_room_field", userLanguage)}</option>
                    {Object.keys(fieldsOfStudy).map((field) => {
                        return (
                            <option key={field} value={field}>
                                {fieldsOfStudy[field][userLanguage]}
                            </option>
                        );
                    })}
                </select>
            </div> */}
            {/* Name */}
            {/* <div className="mb-3">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("name", userLanguage)}{" "}
                    <span
                        className="text-red-400 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
                <input
                    value={roomInfo.roomName}
                    onChange={(e) => update({ roomName: e.target.value })}
                    placeholder={get_text("room_name", userLanguage)}
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                />
            </div> */}
            {/* Description */}
            {/* <div className="mb-4">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("desc", userLanguage)}
                </label>
                <textarea
                    value={roomInfo.roomDescription}
                    onChange={(e) => update({ roomDescription: e.target.value })}
                    placeholder={get_text("room_desc", userLanguage)}
                    rows={4}
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                    style={{
                        resize: "vertical",
                    }}
                />
            </div> */}
            {/* Topic Input */}
            <div className="mb-6">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("topic", userLanguage)}{" "}
                    <span
                        className="text-red-400 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={get_text("enter_topic", userLanguage) || "Enter the main topic"}
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                />
            </div>

            {/* Optional Sub-topic Input */}
            <div className="mb-6">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("sub_topic", userLanguage) || "Sub-topic"}
                </label>
                <input
                    type="text"
                    value={subTopic}
                    onChange={(e) => setSubTopic(e.target.value)}
                    placeholder={
                        get_text("enter_sub_topic", userLanguage) || "Enter a sub-topic (optional)"
                    }
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                />
            </div>

            {/* Data Input Section with Tabs */}
            <div className="mb-6">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("data_input", userLanguage) || "Data Input"}{" "}
                    <span
                        className="text-red-400 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>

                {/* Tab Toggle */}
                <div className="flex gap-2 mb-4 border-b border-gray-600 w-full justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            setError("");
                            setOpenDialogArticle(true);
                        }}
                        title={get_text("generate_title", userLanguage) || "Generate content with AI"}
                        className={`flex gap-2 px-4 py-2 text-sm font-medium transition-colors text-gray-400 hover:text-cyan-400`}
                        >
                        <Sparkles size={12} />
                        {get_text("generate_content", userLanguage) || "Generate content"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setInputType("text");
                            setError("");
                        }}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            inputType === "text"
                                ? "text-cyan-400 border-b-2 border-cyan-400"
                                : "text-gray-400 hover:text-gray-300"
                        }`}>
                        {get_text("enter_text", userLanguage) || "Enter Text"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setInputType("file");
                            setError("");
                        }}
                        disabled={true}
                        title={get_text("coming_soon", userLanguage) || "Coming soon"}
                        className={`cursor-not-allowed px-4 py-2 text-sm font-medium transition-colors ${
                            inputType === "file"
                                ? "text-cyan-400 border-b-2 border-cyan-400"
                                : "text-gray-400 hover:text-gray-300"
                        }`}>
                        {get_text("upload_file", userLanguage) || "Upload File"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setInputType("url");
                            setError("");
                        }}
                        disabled={true}
                        title={get_text("coming_soon", userLanguage) || "Coming soon"}
                        className={`cursor-not-allowed px-4 py-2 text-sm font-medium transition-colors ${
                            inputType === "url"
                                ? "text-cyan-400 border-b-2 border-cyan-400"
                                : "text-gray-400 hover:text-gray-300"
                        }`}>
                        {get_text("enter_url", userLanguage) || "Enter URL"}
                    </button>
                </div>

                {/* File Upload Tab */}
                {inputType === "file" && (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept=".docx,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        {!selectedFile ? (
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center">
                                <svg
                                    className="w-12 h-12 text-gray-400 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <span className="text-gray-400 mb-2">
                                    {get_text("click_to_upload", userLanguage) || "Click to upload"}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {get_text("docx_pdf_only", userLanguage) ||
                                        "DOCX or PDF files only"}
                                </span>
                            </label>
                        ) : (
                            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                                <p className="text-white">
                                    {get_text("selected_file", userLanguage) || "Selected:"}{" "}
                                    {selectedFile.name}
                                </p>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="mt-2 text-red-400 hover:text-red-300 text-sm">
                                    {get_text("remove", userLanguage) || "Remove"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Text Input Tab */}
                {inputType === "text" && (
                    <div className="border-2 border-gray-600 rounded-lg p-4">
                        <textarea
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            placeholder={
                                get_text("enter_text_placeholder", userLanguage) ||
                                "Enter or paste your text content here..."
                            }
                            className="w-full h-64 p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-500 scrollbar"
                        />
                        <p className="mt-2 text-sm text-gray-400">
                            {get_text("text_input_hint", userLanguage) ||
                                "Enter the text content you want to use for generating the escape room"}
                        </p>
                    </div>
                )}

                {/* URL Input Tab */}
                {inputType === "url" && (
                    <div className="border-2 border-gray-600 rounded-lg p-4" dir="ltr">
                        <input
                            type="url"
                            value={urlContent}
                            onChange={(e) => setUrlContent(e.target.value)}
                            placeholder={"https://example.com/article"}
                            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                        />
                        <p className="mt-2 text-sm text-gray-400">
                            {get_text("url_input_hint", userLanguage) ||
                                "Enter a URL to extract content from a webpage"}
                        </p>
                    </div>
                )}
            </div>

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
                    onClick={handleSubmit}
                    disabled={
                        loading ||
                        !topic.trim() ||
                        (inputType === "file" && !selectedFile) ||
                        (inputType === "text" && !textContent.trim()) ||
                        (inputType === "url" && !urlContent.trim())
                    }
                    className="relative text-white bg-cyan-500 hover:bg-cyan-600 border-0 py-2.5 px-3.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading
                        ? get_text("processing", userLanguage) || "Processing..."
                        : get_text("next_page", userLanguage) || "Next"}
                    <span
                        className="flex absolute top-0 -right-10 -translate-x-1/2 -translate-y-1/2"
                        title={
                            get_text("should_be_completed_in_seconds", userLanguage)?.replace(
                                "{seconds}",
                                "60"
                            ) || "Should be completed in 60 seconds"
                        }>
                    </span>
                </button>
                <button
                    onClick={() => {
                        localStorage.removeItem(LOCAL_KEY);
                        setTopic("");
                        setSubTopic("");
                        setInputType("text");
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
                    className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-2.5 px-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {get_text("clear", userLanguage) || "Clear"}
                </button>
            </div>
            {/* Generate Content Dialog */}
            <Dialog open={openDialogArticle} setOpen={setOpenDialogArticle} size="large" disableOverlayClose={false} data="article">
                <div className="p-4 overflow-y-auto scrollbar" dir={userLanguage === "he" ? "rtl" : "ltr"}>
                    <h2 className={`text-xl ${userLanguage === "he" ? "text-right" : "text-left"} text-white font-bold`}>{get_text("generate_content", userLanguage) || "Generate Content"}</h2>
                    <p className={`text-sm ${userLanguage === "he" ? "text-right" : "text-left"} text-gray-200`}>{get_text("generate_content_explanation", userLanguage) || "Generate Content Explanation"}</p>
                    <div className="my-4">
                        <label className="flex text-lg mb-1.5 text-white">
                            {get_text("topic", userLanguage)}{" "}
                            <span
                                className="text-red-400 cursor-pointer"
                                title={get_text("mandatory_field", userLanguage)}>
                                *
                            </span>
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={get_text("enter_topic", userLanguage) || "Enter the main topic"}
                            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Optional Sub-topic Input */}
                    <div className="mb-4">
                        <label className="flex text-lg mb-1.5 text-white">
                            {get_text("sub_topic", userLanguage) || "Sub-topic"}
                        </label>
                        <input
                            type="text"
                            value={subTopic}
                            onChange={(e) => setSubTopic(e.target.value)}
                            placeholder={
                                get_text("enter_sub_topic", userLanguage) || "Enter a sub-topic (optional)"
                            }
                            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="flex text-lg mb-1.5 text-white">
                            {get_text("more_instructions", userLanguage) || "More Instructions"}
                        </label>
                        <textarea
                            value={moreInstructions}
                            onChange={(e) => setMoreInstructions(e.target.value)}
                            placeholder={get_text("enter_more_instructions", userLanguage) || "Enter more instructions (optional)"}
                            className="w-full h-20 p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white scrollbar"
                        />
                    </div>
                    <div className="flex justify-between">
                        {textContent.trim() !== "" && (
                            <div className="flex items-center gap-2 mb-4">
                                <input type="checkbox" onClick={() => setAddToContent(prev=>!prev)} className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-2.5 px-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"/>
                                <label className="flex text-white text-lg">
                                    {get_text("add_to_content", userLanguage) || "Add to current content"}
                                </label>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <button onClick={() => {
                                setOpenDialogArticle(false);
                                setInputType("text")
                            }} className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-2.5 px-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {get_text("cancel", userLanguage) || "Cancel"}
                            </button>
                            <button 
                                onClick={() => {
                                    setInputType("text")
                                    generateContent();
                                }} 
                                disabled={loading}
                                className="bg-cyan-500 hover:bg-cyan-600 border-0 py-2.5 px-3.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading
                                    ? get_text("processing", userLanguage) || "Processing..."
                                    : get_text("generate_content", userLanguage) || "Generate Content"}
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};
