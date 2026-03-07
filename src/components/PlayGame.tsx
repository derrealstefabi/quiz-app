import {TextInput} from "./TextInput.tsx";
import {Button} from "./Button.tsx";
import React, {useEffect, useRef} from "react";
import {useState} from "react";
import {QuestionButton} from "./QuestionButton.tsx";
import {QuestionDisplay} from "./QuestionDisplay.tsx";
import {createPortal} from "react-dom";
import "./play-game.css";
import ConfettiExplosion from 'react-confetti-explosion';

import {fetchAuthSession} from "aws-amplify/auth";

export interface AwsGetQuestion {
    category: AwsString;
    question: AwsString;
    answer: AwsString;
    points: AwsString;
    image?: AwsString;
    choices?: AwsArray;
}

export interface AwsString {
    S: string;
}

export interface AwsArray {
    L: AwsString[];
}

export interface Category {
    name: string;
    color: string;
    questions: Question[];
}

export interface Question {
    points: number;
    question: string;
    answer: string;
    choices?: string[];
    image?: string;
    opened: boolean;
}

export interface Team {
    id: string;
    name: string;
    points: number;
}

export function PlayGame() {
    const [quizId, setQuizId] = useState<string | null>();


    const [categories, setCategories] = useState<Category[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [openedQuestion, setOpenedQuestion] = useState<Question | null>(null);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [activeTeam, setActiveTeam] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [isExploding, setIsExploding] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const teamId = useRef(0);

    useEffect(() => {
        console.log(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/quiz");
        console.log(window.location.search);

        const queryString = window.location.search
        const params = new URLSearchParams(queryString)
        const quizId = params.get('quiz');
        setQuizId(quizId);

        fetchAuthSession().then(auth => {

            if (auth.tokens === undefined) {
                return;
            }
            fetch(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/quiz/" + quizId, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + auth.tokens?.accessToken.toString(),
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    response.json().then((result: AwsGetQuestion[]) => {
                        console.log(result);
                        // setAwsQuestions(result);
                        void createQuestions(result);
                    });
                    // return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })

    }, [])

    async function createQuestions(awsQuestions: AwsGetQuestion[]) {
        const categoriesMap = new Map<string, Category>();

        for (const awsQuestion of awsQuestions) {

            const categoryName = awsQuestion.category.S;

            if (!categoriesMap.has(categoryName)) {
                categoriesMap.set(categoryName, {
                    name: categoryName,
                    color: getRandomColor(),
                    questions: [],
                });
            }

            const category = categoriesMap.get(categoryName)!;


            category.questions.push({
                points: +awsQuestion.points.S,
                question: awsQuestion.question.S,
                answer: awsQuestion.answer.S,
                choices: awsQuestion.choices?.L.map(c => c.S),
                image: awsQuestion.image?.S,
                opened: false,
            });

        }

        setCategories(Array.from(categoriesMap.values()));
        setIsLoading(false);
    }

    async function openQuestion(question: Question) {
        if (question.opened) return;
        console.log("openQuestion", question);

        const authSession = await fetchAuthSession();

        if (question.image) {
            const presignedUrlResponse = await fetch(import.meta.env.PUBLIC_AWS_ENDPOINT_URL + "/createPresignedGet?quiz_id=" + quizId + "&object_name=" + question.image, {
                    headers: {
                        'Authorization': 'Bearer ' + authSession.tokens?.accessToken.toString(),
                    },
                });

            if (presignedUrlResponse.ok) {
                const presignedUrl = await presignedUrlResponse.text();
                console.log("presignedUrl", presignedUrl);
                question.image = presignedUrl;
                console.log("image", question.image);
            } else {
                console.error('Post Image Error:', presignedUrlResponse.statusText);
            }

        }

        question.opened = true;
        setOpenedQuestion(question);

        // const newCategories = categories.filter(c => c.name !== category.name);
        // newCategories.push(category);
        // setCategories(newCategories);
    }

    function addTeam() {
        setTeams([...teams, {
            id: "team-" + teamId.current,
            points: 0
        } as Team]);
        teamId.current++;
    }

    function startGame() {
        teams.forEach(team => {
            team.name = (document.getElementById(team.id) as HTMLInputElement).value;
        })
        categories.forEach((category, idx) => {
            category.color = generateHslaColors(categories.length)[idx];
        })
        setGameStarted(true);
    }

    function answerQuestion(team?: Team) {
        if(team) {
            team.points += openedQuestion!.points;
        }
        setActiveTeam((activeTeam + 1) % teams.length);
        setOpenedQuestion(null);
        setShowModal(false);
        setIsExploding(true);
    }

    function getRandomColor() {
        return 'hsla(' + (Math.random() * 360) + ', 25%, 50%, 1)';
    }

    function generateHslaColors(amount: number) {
        let colors = []
        let huedelta = Math.trunc(360 / amount)

        for (let i = 0; i < amount; i++) {
            let hue = i * huedelta
            colors.push(`hsla(${hue},25%,50%,1)`)
        }

        return colors
    }


    function openModal() {
        setShowModal(true);
    }

    return (
        <main className={'flex h-screen'}>
            {categories.length === 0 && <div className="m-auto flex flex-col gap-5 ">
                {isLoading && <div>Loading...</div>}
            </div>}
            {!gameStarted && categories.length > 0 &&
                <div className="m-auto flex flex-col gap-5 ">
                    {teams.length > 0 && teams.map((team: Team) =>
                        <div className={'flex gap-2 items-center align-middle'}>
                            <TextInput id={team.id} name={team.id} label={"Team name"}/>
                            <button
                                className={"text-md font-bold text-red-500 hover:text-red-600 active:text-red-900"}
                                onClick={() => setTeams([...teams.filter(t => t.id !== team.id)])}>X
                            </button>
                        </div>
                    )}
                    <Button onClick={addTeam}>Add Team</Button>
                    <Button onClick={startGame}>Start Quiz</Button>
                </div>}
            {gameStarted && !openedQuestion &&
                <div className="w-full p-5 grid grid-cols-5 gap-4">
                    {/*{categories.length === 0 && <FileInput selectFile={startGame} id={"gameStarter"}/>}*/}

                    {categories.length > 0 && (
                        <div className="flex flex-col w-full col-span-4 gap-3  items-center justify-center">
                            {categories.map((c: Category) => (
                                <div
                                    className={"grid grid-cols-12 gap-16 min-h-0 items-center rounded-lg p-3 bg-white/10 shadow-md "}>
                                    <div className={"col-span-5 bold text-3xl"}>{c.name}</div>
                                    <div className={"col-span-7 flex justify-start gap-10 min-h-0"}>
                                        {c.questions.sort((a, b) => {
                                            return a.points - b.points
                                        }).map((question: Question) =>
                                            <QuestionButton
                                                color={c.color}
                                                disabled={question.opened}
                                                onClick={() => openQuestion(question)}>{question.points}
                                            </QuestionButton>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                    )}
                    {teams.length > 0 && (
                        <div className={"flex flex-col w-full gap-2 items-center justify-center"}>
                            {teams.map((t: Team) => (
                                <div
                                    className={"flex w-full justify-between gap-1 min-h-0 items-center rounded-3xl p-6 font-medium bg-white/10 shadow-md" +
                                    (teams.at(activeTeam)?.id === t.id ? " bg-white/45" : "")}>
                                    <span
                                        className={teams.at(activeTeam)?.id === t.id ? "text-xl font-extrabold" : ""}>{t.name}</span>
                                    <span
                                        className={teams.at(activeTeam)?.id === t.id ? "text-xl font-extrabold" : ""}>{t.points}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>}
            {gameStarted && openedQuestion &&
                <div className="w-full h-full flex items-center justify-center" onClick={() => openModal()}>
                    <QuestionDisplay question={openedQuestion} />
                </div>
            }
            {showModal && createPortal(
                <div id={'teamsModal'} className="modal">
                    <div className={"relative flex justify-center gap-1 min-h-0 items-center font-bold rounded-3xl border p-15 border-gray-700"}
                    style={{background: "linear-gradient(90deg,rgba(148, 185, 255, 1) 0%, rgba(229, 149, 252, 1) 100%)"}}>
                        <button
                            className={"absolute top-4 right-5 text-lg font-bold text-black hover:text-gray-600 active:text-gray-900"}
                            onClick={() => setShowModal(false)}>X
                        </button>
                        <div className={"flex flex-col gap-2 items-center justify-center p-8"}>
                            {openedQuestion && (
                                <div className="mb-4 text-center">
                                    <h3 className="text-xl font-semibold text-black">The correct answer is:</h3>
                                    <p className="text-2xl text-white">{openedQuestion.answer}</p>
                                </div>
                            )}
                            <div className={"pb-3 text-2xl font-bold whitespace-nowrap"}>Who gets the points?</div>
                            <div className={"flex gap-2 items-center justify-center"}>
                                {teams.map((t: Team) => (
                                    <div
                                        onClick={() => answerQuestion(t)}
                                        className={"basis-1/2 grow-0 shrink-0 flex justify-center gap-1 min-h-0 items-center font-bold rounded-3xl border p-6 border-gray-700 bg-white/25 " +
                                            "hover:bg-white/35 active:bg-white/90"}>
                                        <span>{t.name}</span>
                                    </div>
                                ))}

                            </div>

                            <div
                                onClick={() => answerQuestion()}
                                className={"flex w-full justify-center gap-1 min-h-0 items-center font-bold rounded-3xl border p-6 border-gray-700 bg-white/25 " +
                                    "hover:bg-white/35 active:bg-white/90"}>
                                <span>{"nobody :("}</span>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            {isExploding && <ConfettiExplosion className={'fixed top-[30%] left-[50%]'} particleSize={10} width={1500} duration={3000} particleCount={250} onComplete={() => setIsExploding(false)}/>}
        </main>
    );
}
