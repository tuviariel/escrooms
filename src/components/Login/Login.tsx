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
import { useNavigate } from "react-router";
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
    const [userOpen, setUserOpen] = useState(false);
    const [localUser, setLocalUser] = useState<any>(null);
    I18n.putVocabularies(translations);
    I18n.setLanguage("he");
    // const userRef = useRef<any>(null);
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
                className={`absolute ${userOpen ? "block" : "hidden"} top-full right-full mt-2 min-w-48 bg-white border border-gray-300 rounded shadow-lg z-10 opacity-100`}>
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
                                    שלום{" "}
                                    {userRedux.user["displayName"] ||
                                        user?.userId ||
                                        user?.signInDetails?.loginId}
                                </h6>
                                <h6
                                    onClick={() => {
                                        navigate("/profile");
                                    }}>
                                    {get_text("edit_profile", "he")}
                                </h6>
                                <h6
                                    onClick={() => {
                                        navigate("/subscription");
                                    }}>
                                    {get_text(
                                        userRedux.user["subscription"] !== "start"
                                            ? "go_pro"
                                            : "subscription",
                                        "he"
                                    )}
                                </h6>

                                <div
                                    className="my-2 border-t border-gray-300 cursor-pointer"
                                    onClick={() => {
                                        setUser(undefined);
                                        signOut && signOut();
                                    }}>
                                    צא
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
