import React from "react";


export function QuestionButton({children, onClick, disabled, color}: {
    children: React.ReactNode,
    disabled?: boolean,
    color?: string,
    onClick?: () => void,
}) {
    return <button
        onClick={onClick}
        type={"button"}
        disabled={disabled}
        className={`rounded-md  px-5 py-2.5 text-sm leading-5 font-semibold text-white disabled:bg-gray-700 disabled:text-gray-500 hover:brightness:50`}
        style={{backgroundColor: !disabled && color ? color : ""}}
        >
        {children}
    </button>
}
