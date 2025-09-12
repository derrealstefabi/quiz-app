import React from "react";
import {TextInput} from "./text-input.tsx";
import {CreateQuestionForm, QuestionData} from "./CreateQuestionForm.tsx";

export interface CategoryData {
    name: string;
    questions: Map<string, QuestionData>;
}

export function CreateCategory({id, onCategoryChange, removeCategory}: {
    id: string,
    onCategoryChange: (id: string, data: CategoryData) => void,
    removeCategory: () => void,
}) {
    const [name, setName] = React.useState("");
    const [questions, setQuestions] = React.useState(new Map<string, QuestionData>());

    const handleQuestionChange = (questionId: string, data: QuestionData) => {
        const newQuestions = new Map(questions);
        newQuestions.set(questionId, data);
        setQuestions(newQuestions);
        onCategoryChange(id, { name, questions: newQuestions });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        onCategoryChange(id, { name: e.target.value, questions });
    }

    const points = ["100", "200", "300", "400", "500"];

    return <div className={"bg-white/15 p-8 rounded-lg shadow-xl mb-5 relative"}>
        <button
            className={"absolute top-2 right-2 text-md font-bold text-red-500 hover:text-red-600 active:text-red-900"}
            onClick={removeCategory}>X
        </button>
        <div className="flex flex-row mb-3">
            <TextInput id={id} name={id} label={"Category name"} value={name} onChange={handleNameChange} />
        </div>
        <div className="flex flex-row gap-3">
            {points.map(point => (
                <div key={point}>
                    <div className="flex flex-col items-center gap-2 mb-2">{point}</div>
                    <CreateQuestionForm id={`${id}-${point}`} onDataChange={handleQuestionChange} />
                </div>
            ))}
        </div>
    </div>
}
