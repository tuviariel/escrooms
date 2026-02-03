import { ReactElement, useEffect } from "react";
import { get_text } from "../../util/language";
interface DialogProps {
    open: boolean;
    setOpen: (e: boolean) => void;
    size: "small" | "medium" | "large" | "xLarge" | "";
    data: string;
    disableOverlayClose: boolean;
    children: ReactElement;
}
import { useUserContext } from "../../contexts/userStyleContext";

/**
 * Dialog component- enables adding a dialog to any page or component
 * @param props open, setOpen, size, data, disableOverlayClose, children
 * @returns dialog that should be wrapped around the children
 */
export const Dialog: React.FC<DialogProps> = (props) => {
    const {
        open,
        setOpen,
        children,
        size = "",
        disableOverlayClose = false,
        data = "",
    } = props;
    const { userLanguage } = useUserContext();
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <div
            className={open ? "fixed z-70 inset-0 w-screen h-screen bg-gray-800/30 backdrop-blur-lg" : "hidden"}
            // Overlay click closes only if NOT disabled
            onClick={disableOverlayClose ? (e) => e.stopPropagation() : () => setOpen(false)}>
            <div className={`fixed inset-0 w-full h-full bg-gray-800/30 backdrop-blur-lg z-0`} />
            <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800/30 backdrop-blur-lg">
                <div
                    className={`relative bg-gray-800 text-white shadow-xl rounded-md border-2 border-solid border-blue-100 p-1
                        ${
                            size === "small"
                                ? "max-w-lg w-full max-h-[90vh]"
                                : size === "medium"
                                  ? "w-[50vw] h-[60vh] max-w-2xl max-h-[90vh]"
                                : size === "large"
                                  ? "w-[75vw] h-[75vh] max-w-6xl max-h-[90vh]"
                                  : size === "xLarge"
                                    ? "w-[90vw] h-[90vh] max-w-8xl max-h-[90vh]"
                                    : data === "login"
                                      ? "w-[50vw] h-[90vh] max-w-2xl max-h-[90vh]"
                                      : ""
                        }
                        flex flex-col overflow-hidden transition-all duration-300 ease-out
                    `}
                    onClick={(e) => e.stopPropagation()}>
                    <div
                        onClick={() => setOpen(false)}
                        title={get_text("close", userLanguage)}
                        className="absolute top-0 right-0 h-8 w-8 text-xl border hover:border-2 rounded-lg border-black pl-2 pb-1 flex cursor-pointer font-bold">
                        X
                    </div>
                    <div className="flex flex-col h-full p-5 items-center">
                        <div className="w-full h-full flex flex-col justify-center items-center overflow-auto">
                            {children || data}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
//             </div>
//         </div>
//     );
// };
