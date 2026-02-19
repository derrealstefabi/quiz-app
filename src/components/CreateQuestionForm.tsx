import React, {type ChangeEvent, useEffect, useState} from "react";
import {TextInput} from "./text-input.tsx";
import {FileInput} from "./file-input.tsx";
import {Button} from "./Button.tsx";

export interface QuestionData {
    question: string;
    answer: string;
    image: File | null;
    choices: string[];
}

export function CreateQuestionForm({id, onDataChange}: {
    id: string,
    onDataChange: (id: string, data: QuestionData) => void,
}) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const [invalidChoices, setInvalidChoices] = useState<string[]>([]);

    useEffect(() => {
        onDataChange(id, { question, answer, image, choices });
    }, [question, answer, image, choices]);

    const handleFileSelect = (fileId: string, file: File | null) => {
        setImage(file);
    };

    const handleChoiceChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const newChoices = [...choices];
        if (e.target.value.match("###")) {
            setInvalidChoices([...invalidChoices, e.target.id])
        } else {
            setInvalidChoices(invalidChoices.filter(choice => choice !== e.target.id))
            newChoices[index] = e.target.value;
            setChoices(newChoices);
        }
    };

    const addChoice = () => {
        setChoices([...choices, ""]);
    };

    const removeChoice = (index: number) => {
        const newChoices = [...choices];
        newChoices.splice(index, 1);
        setChoices(newChoices);
    };


    return (
        <div className="space-y-4">
            <TextInput id={`${id}-question`} label="Question" name="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
            <TextInput id={`${id}-answer`} label="Answer" name="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <FileInput id={`${id}-image`} selectFile={handleFileSelect} />

            <h3 className="text-lg font-semibold">Multiple Choice Options</h3>
            {choices.map((choice, index) => (
                <>
                    <div key={index} className="flex items-center gap-2">
                        <TextInput
                            id={`${id}-choice-${index}`}
                            label={`Option ${index + 1}`}
                            name={`choice-${index}`}
                            value={choice}
                            onChange={(e) => handleChoiceChange(index, e)}
                        />
                        <button onClick={() => removeChoice(index)} className="text-red-500 hover:text-red-700">Remove</button>
                    </div>
                    <div className="text-red-500">{invalidChoices.includes(`${id}-choice-${index}`) && "Choice may not contain ###"}</div>
                </>
            ))}
            <Button onClick={addChoice}>Add Option</Button>
        </div>
    );
}
