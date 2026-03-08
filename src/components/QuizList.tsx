import React, {useEffect, useState} from "react";
import {Button} from "./Button.tsx";
import {fetchAuthSession} from "aws-amplify/auth";

type Quiz = {
    id: string;
    name: string;
}

type AwsGetQuestionsResponse = {
    quiz_id: AwsString;
    quiz_name: AwsString;
}

type AwsString = {
    S: string;
}

export function QuizList() {

    const [availableQuizes, setAvailableQuizes] = useState<Quiz[]>([]);

    useEffect(() => {
        console.log(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/quiz");
        fetchAuthSession().then(auth => {
            if (auth.tokens === undefined) {
                return;
            }
            fetch(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/quiz", {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' +  auth.tokens?.accessToken.toString(),
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    response.json().then((result: AwsGetQuestionsResponse[]) => {
                        console.log(result);
                        setAvailableQuizes(result.map(q => {
                            return {
                                id: q.quiz_id.S,
                                name: q.quiz_name.S
                            };
                        }));
                    });
                    // return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });

    }, [])

    const playQuiz = (quiz: string): void => {
        window.location.href = "/quiz-app/play?quiz=" + quiz;
    }

    return (
        <div className="w-5xl flex flex-col gap-5" style={{minHeight: "80vh"}}>
            <h1 className="w-full text-center text-3xl font-bold ">
                Your Quizes
            </h1>
            <table className="border-collapse overflow-hidden rounded-lg bg-white/15 shadow-lg">
                {availableQuizes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-white/20 even:bg-white/10">
                        <td className="px-4 py-3 text-sm text-zinc-900" title={quiz.name + '-' + quiz.id}>{quiz.name}</td>
                        <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                                <Button onClick={() => playQuiz(quiz.id)}>Play</Button>
                                {/*<Button>Edit</Button>*/}
                                {/*<Button>Export</Button>*/}
                            </div>
                        </td>
                    </tr>
                ))}
            </table>
            <div className="flex justify-end">
                <a href={'create'}
                   className={`rounded-md bg-sky-500 px-5 py-2.5 text-sm leading-5 font-semibold text-white hover:bg-sky-700`}
                >Create new Quiz</a>
            </div>
        </div>)
}
