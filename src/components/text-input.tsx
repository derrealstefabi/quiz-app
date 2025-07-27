import React from "react";


export function TextInput({id, label, name}: {
    id: string,
    label: string,
    name: string
}) {
    return <div>
        <label className={'block'} htmlFor={id}>{label}</label>
        <input id={id} name={name}
               className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
        />
    </div>
}