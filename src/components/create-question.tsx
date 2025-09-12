import {Button} from "./Button.tsx";
import {CreateCategory} from "./CreateCategory.tsx";
import type {CategoryData} from "./CreateCategory.tsx";
import React, {useRef} from "react";
import {useState} from "react";
import JSZip from "jszip";
import saveAs from 'file-saver';

const  CreateQuestion = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState(new Map<string, CategoryData>());
  const questionId = useRef(0);

  const addCategory = () => {
    const id = "category-" + questionId.current;
    setCategories([...categories, id]);
    questionId.current += 1;
  }

  const handleCategoryChange = (id: string, data: CategoryData) => {
    const newCategoryData = new Map(categoryData);
    newCategoryData.set(id, data);
    setCategoryData(newCategoryData);
  };

  function downloadGame() {
    const zip = new JSZip();
    categoryData.forEach((data, id) => {
      const categoryName = data.name;
      if (!categoryName) {
        // Maybe show an error to the user
        console.error(`Category name for ${id} is not set.`);
        return;
      }

      const validQuestions = new Map();
      data.questions.forEach((questionData, questionId) => {
        if (questionData.question.trim() !== '') {
          validQuestions.set(questionId, questionData);
        }
      });

      if(validQuestions.size === 0) {
        return;
      }

      const categoryFolder = zip.folder(categoryName);
      validQuestions.forEach((questionData, questionId) => {
        const point = questionId.split('-').pop();
        if(!point) return;

        const questionFolder = categoryFolder?.folder(point);

        const { image, ...textData } = questionData;
        const jsonContent = JSON.stringify(textData, null, 2);
        questionFolder?.file("question.json", jsonContent);

        if (image) {
          const ext = image.name.split('.').pop();
          questionFolder?.file(`image.${ext}`, image);
        }
      });
    });

    zip.generateAsync({type:"blob"})
        .then(function(content) {
          saveAs(content, "quiz.zip");
        });
    return undefined;
  }

  return (
      <main className="flex items-center justify-center pt-16 pb-4">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
          <div className="space-y-6 px-4">
              {categories.length > 0 && categories.map((id: string) =>
                  <CreateCategory
                      id={id}
                      onCategoryChange={handleCategoryChange}
                      removeCategory={() => {
                        setCategories([...categories.filter(t => t !== id)]);
                        const newCategoryData = new Map(categoryData);
                        newCategoryData.delete(id);
                        setCategoryData(newCategoryData);
                      }}
                  />
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