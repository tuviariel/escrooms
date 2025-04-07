import { ReactElement } from "react";

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

    return (
        <button
            onClick={onClick}
            className={`h-8 m-2 pb-3 text-amber-200 bg-cyan-800 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
            } ${className}`}
            style={{ backgroundColor: "blue", padding: "8px" }}
            disabled={disabled}>
            {children}
            {label}
        </button>
    );
};
