import { ReactElement } from "react";
import { useRoomContext } from "../../contexts/roomStyleContext";
import { colorPalette, fontFamily } from "../../util/UIstyle";

interface ButtonProps {
    onClick: (e: any) => void;
    className: string;
    disabled: boolean;
    label: string;
    children: ReactElement;
}
/**
 * Button component- enables adding a styled button to any page or component
 * @param props onClick, className, style, label, children
 * @returns a button that can be wrapped around more tsx elements (children)
 */
export const Button: React.FC<Partial<ButtonProps>> = (props) => {
    const { className = "", onClick, label, children = "", disabled = false } = props;
    const { roomColor, roomFont } = useRoomContext();
    return (
        <div className="flex justify-center items-center">
            <button
                onClick={onClick}
                className={`flex h-7 mx-4 my-2 px-6 py-auto font-light rounded-xl w-auto min-w-fit border ${
                    disabled
                        ? "cursor-not-allowed bg-gray-500"
                        : "cursor-pointer bg-blue-500 hover:bg-blue-700"
                } ${className}`}
                style={{
                    backgroundColor: colorPalette[roomColor as keyof typeof colorPalette].light,
                    // color: colorPalette[roomColor as keyof typeof colorPalette].bright,
                    borderColor: colorPalette[roomColor as keyof typeof colorPalette].bright,
                    fontFamily: fontFamily[roomFont as keyof typeof fontFamily],
                }}
                disabled={disabled}>
                {children}
                {label}
            </button>
        </div>
    );
};
