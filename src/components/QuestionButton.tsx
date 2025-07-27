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
        className={`rounded-md  px-4 py-2 text-xl  font-bold bg-white text-black 
        active:bg-gray-400
        disabled:bg-gray-300 disabled:text-gray-200 
        hover:bg-gray-200`}
        // style={{backgroundColor: !disabled && ""}}
        >
        {children}
    </button>
}
