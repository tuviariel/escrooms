import { useEffect } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { userType } from "../Login/Login";
import { fetchAuthSession } from "aws-amplify/auth";
import { route_paths } from "../../util/config";

/**
 * NavigationGuard component that intercepts navigation to protected routes
 * and shows auth dialog if user is not logged in
 */
export const NavigationGuard = () => {
    // const navigate = useNavigate();
    const location = useLocation();
    const userRedux: any = useSelector((state: { user: userType }) => state.user);
    const protectedRoute = route_paths["ROOMBUILDER"];

    useEffect(() => {
        const checkAndIntercept = async () => {
            // Only check if navigating to protected route
            if (location.pathname === protectedRoute) {
                try {
                    const session = await fetchAuthSession();
                    const hasUser = !!session.tokens;
                    const hasReduxUser = !!userRedux?.user?.id;
                    
                    // If not authenticated, the ProtectedRoute will handle showing the dialog
                    // But we can also prevent navigation here if needed
                    if (!hasUser || !hasReduxUser) {
                        // The ProtectedRoute component will handle the auth dialog
                        // This guard just ensures we're checking on route changes
                        console.log("User not authenticated, ProtectedRoute will show dialog");
                    }
                } catch (error) {
                    console.error("Error checking auth in NavigationGuard:", error);
                }
            }
        };

        checkAndIntercept();
    }, [location.pathname, userRedux, protectedRoute]);

    return null; // This component doesn't render anything
};

