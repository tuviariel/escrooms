export const ErrorMessage = ({
    message,
    userLanguage,
}: {
    message: string;
    userLanguage: string;
}) => {
    return (
        <div
            className={`mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 ${userLanguage === "he" ? "text-right" : "text-left"}`}>
            {message}
        </div>
    );
};
