import React, {type ChangeEvent, useEffect, useState} from "react";
import {TextInput} from "./TextInput.tsx";
import {FileInput} from "./FileInput.tsx";
import {Button} from "./Button.tsx";

export interface QuestionData {
    question: string;
    answer: string;
    points: string;
    image: File | null;
    choices: string[];
    valid: boolean;
}

export function CreateQuestion({id, onDataChange, validate}: {
    id: string,
    onDataChange: (id: string, data: QuestionData) => void,
    validate?: boolean,
}) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [points, setPoints] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const [valid, setValid] = useState<boolean>(true);
    const [invalidChoices, setInvalidChoices] = useState<string[]>([]);
    const [pointsNotNumber, setPointsNotNumber] = useState<boolean>(false);
    const [emptyValues, setEmptyValues] = useState<boolean>(false);

    useEffect(() => {
        setValid(true);
        setPointsNotNumber(false);
        setEmptyValues(false);
        if (isNaN(Number(points))) {
            setPointsNotNumber(true);
            setValid(false);
        }
        if (question === '' || answer.trim() === '') {
            setEmptyValues(true);
            setValid(false);
        }
        onDataChange(id, { question, answer, points, image, choices, valid });
    }, [question, answer, points, image, choices]);

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
        <div className="relative space-y-4 p-4 bg-white/15 rounded-lg shadow-sm">
            <button
                className={"absolute top-2 right-2 text-md font-bold text-red-500 hover:text-red-600 active:text-red-900"}
                onClick={() =>{}}>X
            </button>
            <div>
                <TextInput id={`${id}-question`} label="Question" name="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
                {validate && emptyValues && <div className="text-red-500">Question and Answer cannot be empty</div>}
            </div>
            <div>
                <TextInput id={`${id}-answer`} label="Answer" name="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                {validate && emptyValues && <div className="text-red-500">Question and Answer cannot be empty</div>}
            </div>
            <div>
                <TextInput id={`${id}-points`} label="Points" name="points" value={points} onChange={(e) => setPoints(e.target.value)} />
                {pointsNotNumber && <div className="text-red-500">Points must be a number</div>}
            </div>
            <FileInput id={`${id}-image`} selectFile={handleFileSelect} />

            <h3 className="text-lg font-semibold">Multiple Choice Options</h3>
            {choices.map((choice, index) => (
                <>
                    <div key={index} className="flex items-center gap-2 relative">
                        <TextInput
                            id={`${id}-choice-${index}`}
                            label={`Option ${index + 1}`}
                            name={`choice-${index}`}
                            value={choice}
                            onChange={(e) => handleChoiceChange(index, e)}
                        />
                        <div className="absolute top-0 right-0">
                            <button onClick={() => removeChoice(index)} className="text-md font-bold text-red-500 hover:text-red-600 active:text-red-900">X</button>
                        </div>
                    </div>
                    <div className="text-red-500">{invalidChoices.includes(`${id}-choice-${index}`) && "Choice may not contain ###"}</div>
                </>
            ))}
            <Button onClick={addChoice}>Add Option</Button>
        </div>
    );
}
