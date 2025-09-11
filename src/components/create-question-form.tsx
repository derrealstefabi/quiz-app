import React, {useRef, useState} from "react";
import {TextInput} from "./text-input.tsx";
import {FileInput} from "./file-input.tsx";
import {MultipleChoiceOption} from "./multiple-choice-option.tsx";

export function CreateQuestionForm(
  {
    id,
    selectFile
  }: {
    id: string,
    selectFile: (id: string, file: File | null) => void,
  }) {
  const [multipleChoice, setMultipleChoice] = useState<string[]>([]);
  const choiceId = useRef(0);
  const addChoice = () => {
    const id = "choice-" + choiceId.current;
    setMultipleChoice([...multipleChoice, id]);
    choiceId.current += 1;
  }

  const removeChoice = (id: string) => {
    setMultipleChoice(multipleChoice.filter(t => t !== id))
  }

  return <div id={id} className={"flex flex-col gap-3"}>
    <TextInput id={id + "-question"} name={"question"} label={"Question"}/>
    <TextInput id={id + "-answer"} name={"answer"} label={"Answer"}/>
    <FileInput id={id + "-image"} selectFile={selectFile}/>
    <div className={"flex flex-col gap-2"}>
      {multipleChoice.map(id => <MultipleChoiceOption id={id} remove={removeChoice}/>)}
    </div>
    <button
      className={"p-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-900 rounded-lg"}
      onClick={addChoice}
    >
      Add option
    </button>
  </div>
}
