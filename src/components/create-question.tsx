import {Button} from "./Button.tsx";
import {CreateCategory} from "./CreateCategory.tsx";
import React, {useRef} from "react";
import {useState} from "react";
import JSZip from "jszip";
import saveAs from 'file-saver';

const  CreateQuestion = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [files, setFiles] = useState(new Map<string, File | null>());
  const questionId = useRef(0);

  const addCategory = () => {
    const id = "category-" + questionId.current;
    setCategories([...categories, id]);
    questionId.current += 1;
  }

  function selectFile(id: string, file: File | null) {
    console.log(id)
    const newFiles = files
    newFiles.set(id, file);
    setFiles(newFiles);
  }

  function downloadGame() {
    const zip = new JSZip();
    categories.forEach(category => {
      const categoryName = (document.getElementById(category) as HTMLInputElement).value;
      const categoryFolder = zip.folder(categoryName);
      for (let i = 1; i < 6; i++) {
        const questionNumber = i * 100;
        const questionId = `${category}-${questionNumber}`;
        const question = (document.getElementById(questionId + "-question") as HTMLInputElement).value;
        const answer = (document.getElementById(questionId + "-answer") as HTMLInputElement).value;
        const imageFile = files.get(questionId + "-image");
        const questionFolder = categoryFolder?.folder(questionNumber.toString());
        const multipleChoiceOptions = Array.from(document.querySelectorAll(`#${questionId} [id^="choice-"]`))
          .map(e => (e as HTMLInputElement).value);

        const questionJson = {
          question,
          answer,
          multipleChoiceOptions,
          image: imageFile ? imageFile.name : null,
        };
        questionFolder?.file("question.json", JSON.stringify(questionJson));
        if (imageFile) {
          questionFolder?.file(imageFile.name, imageFile);
        }
      }
    })
    zip.generateAsync({type: "blob"})
      .then(function (content) {
        // see FileSaver.js
        saveAs(content, "quiz.zip");
      });
    return undefined;
  }

  return (
      <main className="flex items-center justify-center pt-16 pb-4">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
          <div className="space-y-6 px-4">
              {categories.length > 0 && categories.map((id: string) =>
                  <CreateCategory id={id} selectFile={selectFile} removeCategory={() => setCategories([...categories.filter(t => t !== id)])}></CreateCategory>
              )}
            <div className={"flex gap-5"}>
              <Button onClick={addCategory}>Add Category</Button>
              <Button onClick={downloadGame}>Submit</Button>

            </div>
          </div>
        </div>
      </main>
  );
};

export default CreateQuestion;