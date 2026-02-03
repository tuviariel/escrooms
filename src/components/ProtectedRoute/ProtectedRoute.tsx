import { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Authenticator } from "@aws-amplify/ui-react";
import Dialog from "../Dialog";
import { userType } from "../Login/Login";
import { get_text } from "../../util/language";
import { useUserContext } from "../../contexts/userStyleContext";
import { fetchAuthSession } from "aws-amplify/auth";
import { userService } from "../../services/service";

type ProtectedRouteProps = {
    children: ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const { userLanguage } = useUserContext();
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [localUser, setLocalUser] = useState<any>(null);

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await fetchAuthSession();
                const hasUser = !!session.tokens;
                const hasReduxUser = !!userRedux?.user?.id;
                const authenticated = hasUser && hasReduxUser;
                setIsAuthenticated(authenticated);
                
                // If not authenticated and trying to access protected route, show dialog
                if (!authenticated) {
                    setShowAuthDialog(true);
                } else {
                    setShowAuthDialog(false);
                }
            } catch (error) {
                console.error("Error checking auth:", error);
                setIsAuthenticated(false);
                setShowAuthDialog(true);
            }
        };
        
        checkAuth();
    }, [userRedux, location.pathname]);

    // Handle user authentication from Authenticator
    useEffect(() => {
        if (localUser && !userRedux?.user?.id) {
            // User just logged in, ensure profile exists
            userService.ensureUserProfileExists(localUser).then((profile) => {
                if (profile) {
                    // Profile ensured, auth state will update via Redux
                    // Close dialog after a short delay to allow Redux to update
                    setTimeout(() => {
                        setShowAuthDialog(false);
                    }, 1000);
                }
            });
        }
    }, [localUser, userRedux]);

    // If still checking, show nothing (or a loading state)
    if (isAuthenticated === null) {
        return null; // or a loading spinner
    }

    // If authenticated, render the protected component
    if (isAuthenticated && !showAuthDialog) {
        return children;
    }

    // If not authenticated, show auth dialog
    return (
        <>
            <Dialog
                open={showAuthDialog}
                setOpen={(open) => {
                    setShowAuthDialog(open);
                    if (!open) {
                        // If dialog closed without auth, redirect to home
                        navigate("/");
                    }
                }}
                size=""
                data="login"
                disableOverlayClose={true}>
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        {get_text("login_required", userLanguage) || "Login Required"}
                    </h2>
                    <p className="text-center mb-6 text-lg text-gray-400">
                        {get_text("login_to_access_room_builder", userLanguage) || 
                         "Please log in to access the Room Builder"}
                    </p>
                    <div className="w-full max-w-md">
                        <Authenticator
                            socialProviders={["google"]}
                            hideSignUp={true}>
                            {({ signOut, user }) => {
                                // Store user when authenticated
                                if (user && !localUser) {
                                    setLocalUser(user);
                                    console.log(signOut, user);
                                }
                                return (
                                    <div className="w-full">
                                        {/* Authenticator will render its UI here */}
                                    </div>
                                );
                            }}
                        </Authenticator>
                    </div>
                    <button
                        onClick={() => {
                            setShowAuthDialog(false);
                            navigate("/");
                        }}
                        className="mt-4 px-4 py-2 text-gray-400 hover:text-blue-500 border border-gray-400 rounded-lg p-2 hover:scale-105 transition-all duration-300">
                        {get_text("cancel", userLanguage) || "Cancel"}
                    </button>
                </div>
            </Dialog>
            {/* Show loading or nothing while dialog is open */}
            {showAuthDialog ? null : children}
        </>
    );
};

