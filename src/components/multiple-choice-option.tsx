import React from "react";
import {TextInput} from "./text-input.tsx";

export function MultipleChoiceOption(
  {
    id,
    remove,
  }: {
    id: string,
    remove: (id: string) => void,
  }) {
  return <div className={"flex gap-2"}>
    <TextInput id={id} name={id} label={"Option"}/>
    <button
      className={"h-fit p-2 self-end text-md font-bold text-red-500 hover:text-red-600 active:text-red-900"}
      onClick={() => remove(id)}>X
    </button>
  </div>
}
