import React from "react";
import {TextInput} from "./text-input.tsx";
import {CreateQuestionForm} from "./create-question-form.tsx";

export function CreateCategory({id, selectFile, removeCategory}: {
    id: string,
    selectFile: (id: string, file: File | null) => void,
    removeCategory: () => void,
}) {
    return <div className={"bg-white/15 p-8 rounded-lg shadow-xl mb-5"}>
        <button
            className={"absolute top-0 right-0 text-md font-bold text-red-500 hover:text-red-600 active:text-red-900"}
            onClick={removeCategory}>X
        </button>
        <div className="flex flex-row mb-3">
            <TextInput id={id} name={id} label={"Category name"}/>
        </div>
        <div className="flex flex-row gap-3">
            <div>
                <div className="flex flex-col items-center gap-16 min-h-0">100</div>
                <CreateQuestionForm id={id + "-100"} selectFile={selectFile}/>
            </div>
            <div>
                <div className="flex flex-col items-center gap-16 min-h-0">200</div>
                <CreateQuestionForm id={id + "-200"} selectFile={selectFile}/>
            </div>
            <div>
                <div className="flex flex-col items-center gap-16 min-h-0">300</div>
                <CreateQuestionForm id={id + "-300"} selectFile={selectFile}/>
            </div>
            <div>
                <div className="flex flex-col items-center gap-16 min-h-0">400</div>
                <CreateQuestionForm id={id + "-400"} selectFile={selectFile}/>
            </div>
            <div>
                <div className="flex flex-col items-center gap-16 min-h-0">500</div>
                <CreateQuestionForm id={id + "-500"} selectFile={selectFile}/>
            </div>
        </div>
    </div>
}
