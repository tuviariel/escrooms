import { useUserContext } from "../../contexts/userStyleContext";
import { get_text } from "../../util/language";
export const Language = () => {
    const { userLanguage, setUserLanguage } = useUserContext();
    return (
        <div className="flex items-start my-2" dir={userLanguage === "he" ? "rtl" : "ltr"}>
            <h6>{get_text("language", userLanguage)}:</h6>
            <select value={userLanguage} onChange={(e) => setUserLanguage(e.target.value as typeof userLanguage)}>
                <option value="en">{get_text("english", userLanguage)}</option>
                <option value="he">{get_text("hebrew", userLanguage)}</option>
                {/* <option value="ar">{get_text("arabic", userLanguage)}</option> */}
            </select>
        </div>
    );
};
