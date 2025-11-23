// import type { AppProps } from "next/app";
import { Authenticator } from "@aws-amplify/ui-react";

import UserIn from "../../assets/images/icons/user.svg";
import UserOut from "../../assets/images/icons/noUser.svg";
import { useState } from "react";
import { I18n } from "aws-amplify/utils";
import { translations } from "@aws-amplify/ui-react";

import { generateClient } from "aws-amplify/data";
// import { client } from "./backend";
import type { Schema } from "../../../amplify/data/resource";
import { getCurrentUser } from "aws-amplify/auth";

export function Login() {
    const [userOpen, setUserOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const client = generateClient<Schema>({
        authMode: "userPool",
    });
    I18n.putVocabularies(translations);
    I18n.setLanguage("he");
    console.log("Login component rendered", user);

    const ensureUserProfileExists = async (user: any) => {
        console.log("in ensure function");
        setUser(user);
        const existing = await client.models.UserProfile.list({
            filter: { id: { eq: user.userId } },
        });
        console.log("before exist");
        if (existing.data.length > 0) {
            console.log("existing", existing.data[0]);
            return;
        }

        const newProfile = await client.models.UserProfile.create({
            id: user.userId,
            email: user.signInDetails.loginId,
            displayName: user.username,
            avatar: user.avatar || "",
            roomsLeft: 1,
        });
        console.log("newProfile", newProfile);
        return;
    };

    return (
        <>
            <img
                src={user ? UserIn : UserOut}
                alt="User"
                onClick={() => {
                    setUserOpen((prev) => !prev);
                }}
                className="h-9 w-9 m-0.5 cursor-pointer"
            />
            {userOpen && (
                <div className="absolute top-full right-full mt-2 min-w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                    <Authenticator
                        // socialProviders={["google"]}
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
                            ensureUserProfileExists(user);
                            return (
                                <main>
                                    <h6>שלום {user?.signInDetails?.loginId}</h6>
                                    <button
                                        onClick={() => {
                                            setUser(null);
                                            signOut && signOut();
                                        }}>
                                        צא
                                    </button>
                                    {/* <Component {...pageProps} /> */}
                                </main>
                            );
                        }}
                    </Authenticator>
                </div>
            )}
        </>
    );
}
