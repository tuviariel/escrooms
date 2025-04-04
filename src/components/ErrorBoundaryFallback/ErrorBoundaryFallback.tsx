import { ReactElement } from "react";
import useErrorBoundary from "../../hooks/useErrorBoundary";
import loading from "../../assets/images/loading.gif";
interface ErrorBoundaryFallbackProps {
    children: ReactElement;
}
/**
 * ErrorBoundaryComponent- wraps whole app (like context), uses useErrorBoundary hook
 * @param props children
 * @returns error || children
 */
export const ErrorBoundaryFallback = (props: ErrorBoundaryFallbackProps) => {
    const { children } = props;
    const error = useErrorBoundary();
    if (error)
        return (
            <div className="flex flex-col-reverse">
                <div> Opps! Something went wrong.</div>
                <img src={loading} alt="Oops!" className="mx-auto" />
            </div>
        );
    return <>{children}</>;
};
