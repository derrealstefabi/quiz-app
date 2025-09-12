import React from "react";


export function TextInput({id, label, name, value, onChange, onXClick}: {
    id: string,
    label: string,
    name: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onXClick?: () => void,
}) {
    return <div>
        <div className={"flex w-full justify-between"}>
            <label className={'block'} htmlFor={id}>{label}</label>
            {onXClick && <button onClick={() => onXClick()} className="text-red-500 hover:text-red-700">Remove</button>}
            </div>
        <input id={id} name={name} value={value} onChange={onChange}
               className="shadow appearance-none border rounded w-80 py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
        />
    </div>
}