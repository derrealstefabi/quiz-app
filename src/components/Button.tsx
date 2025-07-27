import React from "react";


export function Button({children, onClick, submit, disabled}: {
    children: React.ReactNode,
    disabled?: boolean,
    onClick?: () => void,
    submit?: boolean,
}) {
    return <button
        onClick={onClick}
        type={submit ? "submit" : "button"}
        disabled={disabled}
        className={`rounded-md bg-sky-500 px-5 py-2.5 text-sm leading-5 font-semibold text-white hover:bg-sky-700 active:bg-sky-950 disabled:bg-gray-400`}>
        {children}
    </button>
}
