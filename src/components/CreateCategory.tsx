import React, {useRef} from "react";
import {TextInput} from "./TextInput.tsx";
import {CreateQuestion} from "./CreateQuestion.tsx";
import type {QuestionData} from "./CreateQuestion.tsx";
import {Button} from "./Button.tsx";

export interface CategoryData {
    name: string;
    questions: Map<string, QuestionData>;
    valid: boolean;
}

export function CreateCategory({id, onCategoryChange, removeCategory, validate}: {
    id: string,
    onCategoryChange: (id: string, data: CategoryData) => void,
    removeCategory: () => void,
    validate: boolean,
}) {
    const [name, setName] = React.useState("");
    const [questions, setQuestions] = React.useState(new Map<string, QuestionData>());
    const questionId = useRef(0);

    const handleQuestionChange = (questionId: string, data: QuestionData) => {
        const newQuestions = new Map(questions);
        newQuestions.set(questionId, data);
        setQuestions(newQuestions);
        onCategoryChange(id, { name, questions: newQuestions, valid: name.trim() !== "" });
    };

    const addQuestion = () => {
        const newId = id + "-question-" + questionId.current;
        const newQuestions = new Map(questions);
        newQuestions.set(newId, {
            question: "",
            answer: "",
            points: "",
            image: null,
            choices: [],
            valid: false
        });
        setQuestions(newQuestions);
        questionId.current += 1;
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        onCategoryChange(id, { name: e.target.value, questions: questions, valid: name.trim() !== ""});
    }

    return <div className={"w-full bg-white/15 p-8 rounded-lg shadow-xl relative"}>
        <button
            className={"absolute top-2 right-2 text-md font-bold text-red-500 hover:text-red-600 active:text-red-900"}
            onClick={removeCategory}>X
        </button>
        <div className="flex flex-row mb-5 justify-center">
            <div>
                <TextInput id={id} name={id} label={"Category name"} value={name} onChange={handleNameChange} />
                {validate && name.trim() === "" && <div className="text-red-500">Category name cannot be empty</div>}
            </div>
        </div>
        <div className="flex flex-row flex-wrap gap-3">
                {questions.keys().map(key => (
                    <div className={"flex"} key={key}>
                        <CreateQuestion id={`${key}`} onDataChange={handleQuestionChange} validate={validate} />
                    </div>
                ))}
                {questions.size < 5 &&
                    <div className="flex flex-col justify-end">
                        <Button onClick={addQuestion}>Add Question</Button>
                    </div>
                }
        </div>
        </div>
}
