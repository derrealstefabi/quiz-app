import {TextInput} from "./text-input.tsx";
import {Button} from "./Button.tsx";
import React, {type ReactNode, useEffect, useId, useMemo, useRef} from "react";
import {useState} from "react";
import JSZip from "jszip";
import {FileInput} from "./file-input.tsx";
import {QuestionButton} from "./QuestionButton.tsx";
import {createPortal} from "react-dom";
import "./play-game.css";
import ConfettiExplosion from 'react-confetti-explosion';


export interface Category {
    name: string;
    color: string;
    questions: Question[];
}

export interface Question {
    points: number;
    image: string;
    opened: boolean;
}

export interface Team {
    id: string;
    name: string;
    points: number;
}

export default function CreateQuestion() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [openedQuestion, setOpenedQuestion] = useState<Question | null>(null);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [activeTeam, setActiveTeam] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [isExploding, setIsExploding] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const teamId = useRef(0);

    function isFile(path: string) {
        return path.includes(".") && !path.endsWith("/");
    }


    async function createQuestions(id: string, file: File | null) {
        setIsLoading(true);
        if (file === null) return;
        let cats: Category[] = [];
        const zip = await JSZip.loadAsync(file);
        const filePromises: Promise<void>[] = [];

        zip.forEach((path) => {
            if (!isFile(path)) {
                const category = path.split("/").at(0) as string;
                cats.push({name: category, color: getRandomColor(), questions: []});
            } else if (isFile(path)) {
                const categoryName = path.split("/").at(0) as string;
                const category = cats.find((c) => c.name === categoryName) as Category;
                filePromises.push(new Promise((resolve, reject) => {
                    zip.file(path)?.async('base64').then(fileContents => {
                        category?.questions.push({
                                points: Number(path.split('/')[1].split('.')[0]),
                                image: fileContents as string,
                                opened: false
                            }
                        );
                        cats = cats.filter((c) => c.name !== categoryName);
                        cats.push(category);
                        resolve();
                    })
                }))
            }
        });

        Promise.all(filePromises).then(() => {
            setCategories(cats);
            console.log(categories);
            setIsLoading(false);
        })
    }

    function openQuestion(category: Category, question: Question) {
        if (question.opened) return;
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
                {!isLoading && <FileInput selectFile={createQuestions} id={"gameStarter"}/>}
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
                                                onClick={() => openQuestion(c, question)}>{question.points}
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
                                    className={"flex w-full justify-between gap-1 min-h-0 items-center font-bold rounded-3xl border p-6 border-gray-700 bg-white/25"}>
                                    <span
                                        className={teams.at(activeTeam)?.id === t.id ? "text-white" : ""}>{t.name}</span>
                                    <span
                                        className={teams.at(activeTeam)?.id === t.id ? "text-white" : ""}>{t.points}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>}
            {gameStarted && openedQuestion &&
                <div className="w-full h-full" onClick={() => openModal()}>
                    <img className={"p-4 absolute top-0 left-0 bottom-0 right-0 m-auto"}

                         src={"data:image/png;base64, " + openedQuestion.image}/>
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
                        <div className={"flex flex-col gap-2 items-center justify-center"}>
                            <div className={"pb-3 text-2xl font-bold whitespace-nowrap"}>Who gets the points?</div>
                            {teams.map((t: Team) => (
                                <div
                                    onClick={() => answerQuestion(t)}
                                    className={"flex w-full justify-center gap-1 min-h-0 items-center font-bold rounded-3xl border p-6 border-gray-700 bg-white/25 " +
                                        "hover:bg-white/35 active:bg-white/90"}>
                                    <span>{t.name}</span>
                                </div>
                            ))}

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
