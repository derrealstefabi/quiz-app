import {Button} from "./Button.tsx";
import {CreateCategory} from "./CreateCategory.tsx";
import type {CategoryData} from "./CreateCategory.tsx";
import React, {useRef} from "react";
import {useState} from "react";
import JSZip from "jszip";
import {TextInput} from "./TextInput.tsx";
import {fetchAuthSession} from "aws-amplify/auth";
import saveAs from "file-saver";

export interface AwsQuestion {
  category: string;
  question: string;
  answer: string;
  points: string;
  imageFile?: File | null;
  image?: string | null;
  choices?: string[];
}

export interface AwsQuiz {
  name: string; // Quiz Name + timestamp
  questions: AwsQuestion[];
}

const  CreateQuiz = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [quizName, setQuizName] = useState<string>("");
  const [validate, setValidate] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState(new Map<string, CategoryData>());
  const questionId = useRef(0);

  const addCategory = () => {
    const id = "category-" + questionId.current;
    setCategories([...categories, id]);
    questionId.current += 1;
  }

  const addDynamo = async (quiz: AwsQuiz): Promise<boolean> => {
    const authSession = await fetchAuthSession();
    const saveQuizResponse = await fetch(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/quiz", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authSession.tokens?.accessToken.toString(),
      },
      body: JSON.stringify(quiz),
    });

    if (!saveQuizResponse.ok) {
      return false;
    }

    const saveQuizResponseJson = await saveQuizResponse.json();

    const quizId = saveQuizResponseJson.quiz_id;

    for (let question of quiz.questions) {
      if (question.image) {
        const presignedPostUrl = await
            (await fetch(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/createPresignedPost?quiz_id=" + quizId + "&object_name=" + question.image, {
              method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + authSession.tokens?.accessToken.toString(),
              },

            }))
                .json();

        const formData = new FormData();
        // Add every presigned field exactly as returned
        for (const [k, v] of Object.entries(presignedPostUrl.fields)) {
          formData.set(k, v as any as string);
        }
        formData.set("Content-Type", question.imageFile!.type);
        formData.set('file', question.imageFile!);
        let response = await fetch(presignedPostUrl.url, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log("image", question.image);
        } else {
          console.error('Post Image Error:', response.statusText);
          return false;
        }

      }
    }
    return true;
  }

  const handleCategoryChange = (id: string, data: CategoryData) => {
    const newCategoryData = new Map(categoryData);
    newCategoryData.set(id, data);
    setCategoryData(newCategoryData);
  };


  const createQuiz = (saveToAWS: boolean, download: boolean) => {
    const zip = new JSZip();

    categoryData.forEach((data, id) => {
      const categoryName = data.name;
      if (!categoryName) {
        console.error(`Category name for ${id} is not set.`);
        return;
      }

      const validQuestions = new Map();
      data.questions.forEach((questionData, questionId) => {
        if (questionData.valid) {
          validQuestions.set(questionId, questionData);
        }
      });

      if(validQuestions.size !== data.questions.size) {
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

    if (download) {
      zip.generateAsync({type:"blob"})
          .then(function(content) {
            saveAs(content, "quiz.zip");
      });
    }
  }

  const saveGame = async () => {
    setValidate(true);
    let quiz: AwsQuiz = {
      name: quizName,
      questions: categoryData.entries().map(([_categoryId, categoryData]) => {
        return categoryData.questions.entries().map(([_questionId, questionData]) => {
          let question = {
            category: categoryData.name,
            question: questionData.question,
            answer: questionData.answer,
            choices: questionData.choices,
            points: questionData.points
          } as AwsQuestion;
          if (questionData.image) {
            question.imageFile = questionData.image;
            question.image = questionData.image.name;
          }
          return question;
        }).toArray()
      }).toArray().flat()
    }
    console.log(quiz);
    if (await addDynamo(quiz)) {
      window.location.href = import.meta.env.BASE_URL;
    }
  }

  const downloadGame = () => {
    setValidate(true);
    createQuiz(false, true);
  }

  const goBack = (): void => {
    window.history.back();
  }

  return (
      <main className="flex flex-col w-full">
        <div className="flex flex-col mx-auto my-auto items-center justify-center align-center gap-3 min-h-0 p-4">
          <div className="self-center">
            <TextInput id={'create-quiz-quiz-name'} name={'create-quiz-quiz-name'} label={"Quiz name"} onChange={(e) => setQuizName(e.target.value)} ></TextInput>
          </div>
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
                  validate={validate}
              />
          )}
          <div className={"w-full flex justify-end gap-5"}>
            <div className={"me-auto"}>
              <Button onClick={goBack}>Back</Button>
            </div>
            {quizName.length > 0 &&
                <div className={"ms-auto"}>
                  <Button onClick={addCategory}>Add Category</Button>
                </div>}
            {quizName.length > 0 && categories.length > 0 &&
                <div className={"ms-auto flex gap-5"}>
                  <Button onClick={saveGame}>Save Quiz</Button>
                  <Button onClick={downloadGame}>Download Quiz</Button>
                </div>}

          </div>

        </div>
      </main>
  );
};

export default CreateQuiz;