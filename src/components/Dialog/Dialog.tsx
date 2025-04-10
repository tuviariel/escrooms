import { ReactElement } from "react";
interface DialogProps {
    open: boolean;
    setOpen: (e: boolean) => void;
    size: string;
    data: string;
    disableOverlayClose: boolean;
    children: ReactElement;
}
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
        size = "large",
        disableOverlayClose = false,
        data = "",
    } = props;

    return (
        <div
            className={open ? "fixed z-20 overflow-y-auto w-screen inset-0" : "hidden"}
            onClick={disableOverlayClose ? () => setOpen(false) : (e) => e.stopPropagation()}>
            <div className="flex h-screen items-center justify-center backdrop-blur-lg">
                <div
                    className={`w-full p-6 backdrop-blur-3xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0`}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`inline-block rounded-l-md bg-white text-left shadow-xl scale-100 overflow-hidden p-1 align-bottom transition-all sm:my-8 sm:align-middle border-2 border-solid border-blue-100
                        ${
                            size === "small"
                                ? "max-w-lg"
                                : size === "large"
                                ? "w-full max-w-6xl"
                                : size === "xLarge"
                                ? "w-full max-w-7xl"
                                : ""
                        }`}>
                        <div className={`flex flex-col h-max p-5 items-center`}>
                            <div
                                onClick={() => setOpen(false)}
                                className="ml-auto h-10 w-10 text-xl border-1 hover:border-2 rounded-full border-black px-3 pt-1 flex cursor-pointer font-bold">
                                X
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
