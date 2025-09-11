import React from "react";


export function TextInput({id, label, name}: {
    id: string,
    label: string,
    name: string
}) {
    return <div>
        <label className={'block'} htmlFor={id}>{label}</label>
        <input id={id} name={name}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
        />
    </div>
}