import React from "react";


export function TextInput({id, label, name, value, onChange}: {
    id: string,
    label: string,
    name: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
    return <div>
        <label className={'block'} htmlFor={id}>{label}</label>
        <input id={id} name={name} value={value} onChange={onChange}
               className="shadow appearance-none border rounded w-80 py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
        />
    </div>
}