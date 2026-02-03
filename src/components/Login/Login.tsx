import { Authenticator } from "@aws-amplify/ui-react";
import UserIn from "../../assets/images/icons/user.svg";
import UserOut from "../../assets/images/icons/noUser.svg";
import { useEffect, useRef, useState } from "react";
import { I18n } from "aws-amplify/utils";
import { translations } from "@aws-amplify/ui-react";
import { userService } from "../../services/service";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../reduxStor/userData";
import { get_text } from "../../util/language";
import { useLocation, useNavigate } from "react-router";
import { useUserContext } from "../../contexts/userStyleContext";
import Language from "../Language";
import { Gem, Languages, LogOut, Settings } from "lucide-react";

export interface userType {
    id: string;
    email: string;
    displayName: string;
    avatar: string;
    roomsLeft: number;
    subscription: string;
}

export function Login() {
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    const dispatch = useDispatch();
    const setUser = (user: userType | undefined) => {
        dispatch(userActions.updateUserData(user));
        // console.log("setUserRedux", user);
    };
    const navigate = useNavigate();
    const location = useLocation();
    const [userOpen, setUserOpen] = useState(false);
    const [localUser, setLocalUser] = useState<any>(null);
    I18n.putVocabularies(translations);
    I18n.setLanguage("he");
    const popupRef = useRef<HTMLDivElement | null>(null);

    const handleMouseLeave = (e: React.MouseEvent) => {
        if(!userRedux?.user) {
            const related = (e as any).relatedTarget as HTMLElement | null;
        // If moving to an element inside the popup, ignore
        if (related && popupRef.current?.contains(related)) return;
        // Some browser UI (autofill / external UI) set relatedTarget to null.
        // If relatedTarget is null but an element inside the popup currently has focus,
        // treat this as "still inside" (user interacting with inputs/autofill).
        const active = document.activeElement;
        if (!related && popupRef.current?.contains(active)) return;
        }
        // Otherwise treat as a real leave
        setUserOpen(false);
    };
    const { userLanguage } = useUserContext();
    console.log("userLanguage in NavBar:", userLanguage);
    useEffect(() => {
        console.log("state ensure:", localUser);
        if (!localUser) return;
        userService.ensureUserProfileExists(localUser).then((profile) => {
            if (!profile) return;
            console.log("Profile ensured:", profile);
            const userToRedux = {
                id: profile.id,
                email: profile.email,
                displayName: profile.displayName,
                avatar: profile.avatar,
                roomsLeft: profile.roomsLeft,
                subscription: profile.subscription,
            };
            setUser(userToRedux as userType);
        });
    }, [localUser]);
    console.log("Login component rendered", userRedux, userRedux?.user?.["avatar"]);

    return (
        <>
            <img
                src={(!userRedux && UserOut) || UserIn} //userRedux.user["avatar"]
                alt="User"
                onClick={() => {
                    setUserOpen((prev) => !prev);
                }}
                className="h-9 w-9 m-0.5 cursor-pointer"
            />
            <div
                className={`absolute ${userOpen ? "block" : "hidden"} top-8 right-0 mt-2 min-w-48 bg-white border border-gray-300 rounded shadow-lg z-40`}>
                <Authenticator
                    // formFields={{
                    //     signIn: {
                    //         password: {
                    //             placeholder: "הכנס סיסמה",
                    //         },
                    //     },
                    //     signUp: {
                    //         password: {
                    //             placeholder: "בחר סיסמה",
                    //         },
                    //         confirm_password: {
                    //             placeholder: "אישור סיסמה",
                    //         },
                    //     },
                    //     forgotPassword: {
                    //         username: {
                    //             label: "מייל",
                    //             placeholder: "הכנס את המייל שלך",
                    //         },
                    //     },
                    // }}
                    socialProviders={["google"]}
                    hideSignUp={true}>
                    {({ signOut, user }) => {
                        console.log("Authenticator render", user);
                        setLocalUser(user);
                        return (
                            <main
                                className="flex flex-col z-40 text-white bg-gray-800 border border-gray-700 rounded-lg p-2"
                                ref={popupRef}
                                dir={userLanguage === "he" ? "rtl" : "ltr"}
                                onMouseLeave={handleMouseLeave}>
                                <div className="border-b border-gray-300">
                                    {get_text("hello", userLanguage)}{" "}
                                    {userRedux?.user?.["displayName"] ||
                                        user?.signInDetails?.loginId ||
                                        user?.userId}
                                </div>
                                <button
                                    className={`flex items-center gap-2 p-2 rounded mx-auto border border-gray-800 w-full ${location.pathname === "/profile" ? "font-bold text-cyan-600" : "font-normal text-gray-600 cursor-pointer hover:text-cyan-400 hover:border-cyan-700"}`}
                                    onClick={() => {
                                        navigate("/profile");
                                        setUserOpen(false);
                                    }}>
                                    <Settings size={14} /> {get_text("edit_profile", userLanguage)}
                                </button>
                                <div className="flex items-center gap-2 p-2 rounded mx-auto font-normal text-gray-600 cursor-pointer border border-gray-800 w-full hover:text-cyan-400 hover:border-cyan-700">
                                    <Languages size={14} /> <Language />
                                </div>
                                {userRedux?.user?.["subscription"] === "free" && (
                                    <button
                                        className={`flex items-center gap-2 p-2 rounded mx-auto border border-gray-800 w-full ${location.pathname === "/subscription" ? "font-bold text-cyan-600" : "font-normal text-gray-600 cursor-pointer hover:text-cyan-400 hover:border-cyan-700"}`}
                                        onClick={() => {
                                            navigate("/subscription");
                                            setUserOpen(false);
                                        }}>
                                        <Gem size={14} /> {get_text("upgrade", userLanguage)}
                                    </button>
                                )}
                                <div
                                    className="flex items-center gap-2 p-2 border-t border-gray-300 cursor-pointer text-gray-600 hover:text-red-400"
                                    onClick={() => {
                                        setUser(undefined);
                                        signOut && signOut();
                                        setUserOpen(false);
                                        navigate("/home");
                                    }}>
                                    <LogOut size={14} /> {get_text("sign_out", userLanguage)}
                                </div>
                                {/* <Component {...pageProps} /> */}
                            </main>
                        );
                    }}
                </Authenticator>
            </div>
        </>
    );
}
