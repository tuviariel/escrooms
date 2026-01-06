import { useEffect, useState } from "react";
import { get_text } from "../../../util/language";
import { useUserContext } from "../../../contexts/userStyleContext";
import { fileStorage, roomsService } from "../../../services/service";
import { aiService } from "../../../services/service";
import { useSelector } from "react-redux";
import { userType } from "../../../components/Login/Login";

type TopicAndDataProps = {
    setStep: (index: number) => void;
    setRoomId?: (id: string) => void;
    roomId?: string;
};

const LOCAL_KEY = "topicAndData";

export const TopicAndData = ({ setStep, setRoomId, roomId }: TopicAndDataProps) => {
    const [topic, setTopic] = useState<string>("");
    const [subTopic, setSubTopic] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { userLanguage } = useUserContext();
    const userRedux: any = useSelector((state: { user: userType }) => state.user);

    // Load draft from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LOCAL_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setTopic(parsed.topic || "");
                setSubTopic(parsed.subTopic || "");
            }
        } catch {
            // ignore parse errors
        }
    }, []);

    // Save draft on every change
    useEffect(() => {
        try {
            localStorage.setItem(
                LOCAL_KEY,
                JSON.stringify({
                    topic,
                    subTopic,
                })
            );
        } catch {
            // ignore storage errors
        }
    }, [topic, subTopic]);

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

        if (!selectedFile) {
            setError(get_text("file_required", userLanguage) || "Please select a file");
            return;
        }

        setLoading(true);
        setError("");
        setStatus("");

        try {
            let currentRoomId = roomId;

            // Create a room if we don't have one yet
            if (!currentRoomId) {
                const newRoom = await roomsService.createRoom({
                    creatorId: userRedux.user.id,
                    name: topic || "New Room",
                    topic: topic,
                    type: "educational",
                    description: "",
                });

                if (!newRoom || !newRoom.id) {
                    throw new Error("Failed to create room");
                }

                currentRoomId = newRoom.id;
                if (setRoomId) {
                    setRoomId(currentRoomId);
                }
            }

            // Upload file to storage
            const uploadResult = await fileStorage.uploadFile(selectedFile, currentRoomId);
            if (!uploadResult) {
                throw new Error("File upload failed");
            }

            // Get the S3 path from upload result
            // The path format should be: images/{roomId}/{fileName}
            const filePath = `images/${currentRoomId}/${selectedFile.name}`;

            // Call extractDocument service
            // Pass the file path as the document parameter (handler will construct bucket name)
            const result = await aiService.extractDocument(filePath, topic, subTopic || "");

            if (result) {
                setStatus(
                    get_text("document_processed", userLanguage) ||
                        "Document processed successfully"
                );
                // Move to next step
                setTimeout(() => {
                    setStep(1);
                }, 1000);
            }
        } catch (err: any) {
            console.error("Error processing document:", err);
            setError(err.message || get_text("processing_failed", userLanguage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="max-w-3xl mt-0 mx-20 py-4 text-white"
            dir={userLanguage === "he" ? "rtl" : "ltr"}>
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
                    {get_text("sub_topic", userLanguage) || "Sub-topic"} (Optional)
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

            {/* File Upload */}
            <div className="mb-6">
                <label className="flex text-lg mb-1.5 text-white">
                    {get_text("upload_document", userLanguage) || "Upload Document"}{" "}
                    <span
                        className="text-red-400 cursor-pointer"
                        title={get_text("mandatory_field", userLanguage)}>
                        *
                    </span>
                </label>
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
            <div className="flex gap-2.5 items-center">
                <button
                    onClick={handleSubmit}
                    disabled={loading || !topic.trim() || !selectedFile}
                    className="text-white bg-cyan-500 hover:bg-cyan-600 border-0 py-2.5 px-3.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading
                        ? get_text("processing", userLanguage) || "Processing..."
                        : get_text("next_page", userLanguage) || "Next"}
                </button>
                <button
                    onClick={() => {
                        localStorage.removeItem(LOCAL_KEY);
                        setTopic("");
                        setSubTopic("");
                        setSelectedFile(null);
                        setStatus("");
                        setError("");
                    }}
                    disabled={loading}
                    className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-2.5 px-3 rounded-lg cursor-pointer transition-colors">
                    {get_text("clear", userLanguage) || "Clear"}
                </button>
            </div>
        </div>
    );
};
