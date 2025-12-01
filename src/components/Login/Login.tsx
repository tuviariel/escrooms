import { Authenticator } from "@aws-amplify/ui-react";
import UserIn from "../../assets/images/icons/user.svg";
import UserOut from "../../assets/images/icons/noUser.svg";
import { useEffect, useState } from "react";
import { I18n } from "aws-amplify/utils";
import { translations } from "@aws-amplify/ui-react";
import { userService } from "../../services/service";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../reduxStor/userData";
import { get_text } from "../../util/language";
import { useLocation, useNavigate } from "react-router";
import { useUserContext } from "../../contexts/userStyleContext";
import Language from "../Language";

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
        console.log("setUserRedux", user);
    };
    const navigate = useNavigate();
    const location = useLocation();
    const [userOpen, setUserOpen] = useState(false);
    const [localUser, setLocalUser] = useState<any>(null);
    I18n.putVocabularies(translations);
    I18n.setLanguage("he");
    // const userRef = useRef<any>(null);

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
    console.log("Login component rendered", userRedux, userRedux.user["avatar"]);

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
                className={`absolute ${userOpen ? "block" : "hidden"} top-full right-full mt-2 min-w-48 bg-white border border-gray-300 rounded shadow-lg z-10 opacity-100`}
                onMouseLeave={() => setUserOpen(false)}>
                <Authenticator
                    formFields={{
                        signIn: {
                            password: {
                                placeholder: "הכנס סיסמה",
                            },
                        },
                        signUp: {
                            password: {
                                placeholder: "בחר סיסמה",
                            },
                            confirm_password: {
                                placeholder: "אישור סיסמה",
                            },
                        },
                        forgotPassword: {
                            username: {
                                label: "מייל",
                                placeholder: "הכנס את המייל שלך",
                            },
                        },
                    }}>
                    {({ signOut, user }) => {
                        console.log("Authenticator render", user);
                        setLocalUser(user);
                        return (
                            <main>
                                <h6>
                                    {get_text("hello", userLanguage)}{" "}
                                    {userRedux.user["displayName"] ||
                                        user?.userId ||
                                        user?.signInDetails?.loginId}
                                </h6>
                                <h6
                                    className={`${location.pathname === "/profile" ? "font-bold text-teal-600" : "font-normal text-gray-600 cursor-pointer hover:text-teal-400"}`}
                                    onClick={() => {
                                        navigate("/profile");
                                        setUserOpen(false);
                                    }}>
                                    {get_text("edit_profile", userLanguage)}
                                </h6>
                                <Language />
                                <h6
                                    className={`${location.pathname === "/subscription" ? "font-bold text-teal-600" : "font-normal text-gray-600 cursor-pointer hover:text-teal-400"}`}
                                    onClick={() => {
                                        navigate("/subscription");
                                        setUserOpen(false);
                                    }}>
                                    {get_text(
                                        userRedux.user["subscription"] !== "start"
                                            ? "go_pro"
                                            : "subscription",
                                        userLanguage
                                    )}
                                </h6>
                                <div
                                    className="my-2 border-t border-gray-300 cursor-pointer hover:text-red-400"
                                    onClick={() => {
                                        setUser(undefined);
                                        signOut && signOut();
                                        setUserOpen(false);
                                        navigate("/home");
                                    }}>
                                    {get_text("sign_out", userLanguage)}
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
