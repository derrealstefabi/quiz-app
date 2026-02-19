import {Button} from "./Button.tsx";
import {CreateCategory} from "./CreateCategory.tsx";
import type {CategoryData} from "./CreateCategory.tsx";
import React, {useRef} from "react";
import {useState} from "react";
import JSZip from "jszip";
import saveAs from 'file-saver';
import type {QuestionData} from "./CreateQuestionForm.tsx";
import {TextInput} from "./text-input.tsx";

export interface AwsQuestion {
  category: string;
  question: string;
  answer: string;
  points: string;
  image?: File | string | null;
  choices?: string[];
}

export interface AwsQuiz {
  name: string; // Quiz Name + timestamp
  questions: AwsQuestion[];
}

const  CreateQuestion = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [quizName, setQuizName] = useState<string>("");
  const [categoryData, setCategoryData] = useState(new Map<string, CategoryData>());
  const questionId = useRef(0);
  const [awsOutput, setAwsOutput] = useState<string>();

  console.log("window",window.location.href)
  const auth = 'Bearer ' + localStorage.getItem('aws_token');

  const addCategory = () => {
    const id = "category-" + questionId.current;
    setCategories([...categories, id]);
    questionId.current += 1;
  }

  const addDynamo = async (quiz: AwsQuiz) => {
    for (let question of quiz.questions) {
      if (question.image) {
        const presignedPostUrl = await
            (await fetch(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/createPresignedPost/" + (question.image as File).name, {
              method: 'GET',
              headers: {
                'Authorization': auth,
              },

            }))
                .json();

        console.log("presignedPostUrl", presignedPostUrl);

        const formData = new FormData();
        formData.append('key', presignedPostUrl.fields.key);
        formData.append('x-amz-algorithm', presignedPostUrl.fields["x-amz-algorithm"]);
        formData.append('x-amz-credential', presignedPostUrl.fields["x-amz-credential"]);
        formData.append('x-amz-date', presignedPostUrl.fields["x-amz-date"]);
        formData.append('x-amz-security-token', presignedPostUrl.fields["x-amz-security-token"]);
        formData.append('x-amz-signature', presignedPostUrl.fields["x-amz-signature"]);
        formData.append('policy', presignedPostUrl.fields.policy);
        formData.append('file', question.image as File);
        let response = await fetch(presignedPostUrl.url, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          question.image = presignedPostUrl.fields.key;
          console.log("image", question.image);
        } else {
          console.error('Post Image Error:', response.statusText);
        }

      }
    }

    fetch(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/quiz", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
      body: JSON.stringify(quiz),
    })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          response.text().then(text => setAwsOutput(text));
        })
        .then(data => {
          console.log('Post Question Success:', data);
        })
        .catch(error => {
          console.error('Post Question Error:', error);
        });

  }

  const getDynamo = () => {
    console.log(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/quiz");
    fetch(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/quiz", {
      method: 'GET',
      headers: {
        'Authorization': auth,
      },
    })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          response.text().then(text => setAwsOutput(text));
          // return response.json();
        })
        .then(data => {
          console.log('Success:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });

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

    if (download) {
      zip.generateAsync({type:"blob"})
          .then(function(content) {
            saveAs(content, "quiz.zip");
      });
    }
  }

  const saveGame = () => {
    let quiz: AwsQuiz = {
      name: quizName,
      questions: categoryData.entries().map(([categoryId, categoryData]) => {
        return categoryData.questions.entries().map(([questionId, questionData]) => {
          let question = {
            category: categoryData.name,
            question: questionData.question,
            answer: questionData.answer,
            choices: questionData.choices,
            points: questionId.split('-').pop()!
          } as AwsQuestion;
          if (questionData.image) {
            question.image = questionData.image;
          };
          return question;
        }).toArray()
      }).toArray().flat()
    }
    console.log(quiz);
    addDynamo(quiz);
  }

  const downloadGame = () => {
    createQuiz(false, true);
  }

  return (
      <main className="flex flex-col items-center justify-center gap-3 min-h-0 pt-16 pb-4 mx-20">
        <div className="self-start">
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
            />
        )}
        <div className={"flex gap-5"}>
          {quizName.length > 0 &&
              <Button onClick={addCategory}>Add Category</Button>}
          {categories.length > 0 &&
              <div className={"ms-auto flex gap-5"}>
                <Button onClick={saveGame}>Save Quiz</Button>
                <Button onClick={downloadGame}>Download Quiz</Button>
              </div>}

        </div>
      </main>
  );
};

export default CreateQuestion;