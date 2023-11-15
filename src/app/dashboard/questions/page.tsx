"use client";
import {
    QuestionMarkCircleIcon,

} from '@heroicons/react/24/outline';
import clsx from "clsx";
import Moment from 'moment';
import 'moment/locale/de';
import React, {useState, useEffect} from "react";
import {useSession} from "next-auth/react"


function getQuestionsByUser(email: string) { // : Promise<Response>
}


export default async function Page() {

    console.log("questions/pages.tsx start")
    Moment.locale('de');
    const {data: session, status} = useSession(); // now we have a 'session' and 'status'

    // dummy data *****************************************************************************************************
    const [questionsItems, setQuestionItems] = React.useState([
        {
            id: 1,
            creator: 'Peter',
            title: 'Wo liegt Berlin?',
            content: `      
        Ich möchte dort einige Museen besuchen. Besonders interessiert mich Malerei und Moderne Kunst.      
    `,
            dateCreated: '2021-10-15T12:34:56.000Z',
            dateUpdated: '2021-10-17T07:22:22.000Z',
            tags: ['Berlin', 'Museen', 'Kunst'],
        },
        {
            id: 2,
            creator: 'Hans',
            title: 'Wo liegt Köln?',
            content: `      
        Ich möchte dort Bier trinken. Besonders interessiert mich der Karneval und das Essen.     
    `,
            dateCreated: '2021-10-02T12:34:56.000Z',
            dateUpdated: '2021-10-02T12:34:56.000Z',
            tags: ['Köln', 'Bier', 'Karneval'],
        },
        {
            id: 3,
            creator: 'Peter',
            title: 'Wo liegt Hamburg?',
            content: `      
        Ich möchte dort Hamburger essen. Besonders interessiert mich der Hafen und die Speicherstadt.     
    `,
            dateCreated: '2021-10-03T12:34:56.000Z',
            dateUpdated: '2021-10-03T12:34:56.000Z',
            tags: ['Hamburg', 'Hafen', 'Speicherstadt'],
        },
        {
            id: 4,
            creator: 'Hans',
            title: 'Wo liegt München?',
            content: `      
        Ich möchte dort Oktoberfest feiern. Besonders interessiert mich die Gemütlichkeit.     
    `,
            dateCreated: '2021-10-04T12:34:56.000Z',
            dateUpdated: '2021-10-04T12:34:56.000Z',
            tags: ['München', 'Oktoberfest', 'Gemütlichkeit'],
        },
        {
            id: 5,
            creator: 'Bodo',
            title: 'Wo liegt Frankfurt?',
            content: `      
        Ich möchte dort die Börse besuchen. Besonders interessiert mich die Skyline.     
    `,
            dateCreated: '2021-10-05T12:34:56.000Z',
            dateUpdated: '2021-10-05T12:34:56.000Z',
            tags: ['Frankfurt', 'Börse', 'Skyline'],
        },
    ])


    // fetch data *****************************************************************************************************
    // @ts-ignore
    const response = "";

    console.log("API getQuestions ByUser start ")

    const api_host = process.env.JARVIS_API_HOST;
    const api_url = (api_host + "/questions");

    const [result, setResult] = useState([]);

    let formData = new FormData();
    formData.append("email", session?.user?.email);

    const fetchInfo = () => {
        return fetch(api_url,
            {
                method: "POST",
                body: formData,
                mode: 'cors',

            })
            .then((res) => res.json())
            .then((d) => setResult(d))
    }

    useEffect(() => {
        fetchInfo();
    }, []);

    // const response = fetch(api_url, {
    //     method: "POST",
    //     body: formData,
    //     mode: 'cors',
    //
    // })
    // const data = response.json();

    console.log("API fetched Questions Ende: ")


    // end fetch data *************************************************************************************************


    // const data = response.
    console.log("API fetched Questions: ")

    const [questionsJ, setQuestionsJ] = React.useState([]);

    // Drag & Drop Handling ********************************************************************************************
    const [newQuestion, setNewQuestion] = React.useState("");

    //save reference for dragItem and dragOverItem
    const dragItem = React.useRef<any>(null);
    const dragOverItem = React.useRef<any>(null);

    //const handle drag sorting
    const handleSort = () => {
        //duplicate items
        let _questionsItems = [...questionsItems];

        //remove and save the dragged item content
        const draggedItemContent = _questionsItems.splice(dragItem.current, 1)[0];

        //switch the position
        _questionsItems.splice(dragOverItem.current, 0, draggedItemContent);

        //reset the position ref
        dragItem.current = null;
        dragOverItem.current = null;

        //update the actual array
        setQuestionItems(_questionsItems);
    };

    //handle name change
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewQuestion(e.target.value);
    };

    //handle new item addition
    const handleNewQuestion = () => {
        const newQuestionFull = {
            id: questionsItems.length + 1,
            creator: 'Peter',
            title: 'Wo liegt New York?',
            content: `      
        Ich möchte die Freiheitsstatue besuchen. Besonders interessiert mich der Central Park.      
    `,
            dateCreated: '2023-10-15T15:22:56.000Z',
            dateUpdated: '2023-12-15T15:22:56.000Z',
            tags: ['New York', 'Freiheitsstatue', 'Central Park'],
        }
        const _questionsItems = [...questionsItems];
        _questionsItems.unshift(newQuestionFull);
        setQuestionItems(_questionsItems);
    };

    // Main Component *************************************************************************************************
    return (

        <div className="divide-y divide-gray-100">
            <div>Nutzer: {session.user.name}  </div>

            {/*Questions*/}
            {questionsItems.map((question, index) => (

                //@ts-ignore
                <div
                    draggable
                    key={index}
                    onDragStart={(e) => (dragItem.current = index)}
                    onDragEnter={(e) => (dragOverItem.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}

                    className={clsx(
                        'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                        {
                            'bg-sky-50 text-blue-600': index === 0,
                        },
                    )}
                >
                    <div className="flex min-w-0 gap-x-4">
                        <QuestionMarkCircleIcon className="w-6 h-6"/>
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{question.creator}: {question.title}</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{question.content}</p>
                        </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p className="text-xs leading-6 text-gray-600">
                            {question.tags.map((tag) => (
                                <span key={tag}>
                                    #{tag}&nbsp;
                                </span>
                            ))
                            }
                        </p>
                        {question.dateUpdated ? (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Updated: <time dateTime={question.dateUpdated}>
                                {
                                    Moment(question.dateUpdated).format('DD.MM.yy HH:mm')
                                }
                            </time>
                            </p>
                        ) : (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Created: <time dateTime={question.dateCreated}>{
                                Moment(question.dateCreated).format('DD.MM.yy HH:mm')
                            }</time>
                            </p>
                        )}
                    </div>
                </div>


            ))}

            {/*TestResult*/}
            {result.map((quest, index) => {
                return (
                    <div>{quest.title}</div>
                )
            }
            )}


            {/*Neue Frage*/}
            <div className="flex min-w-0 gap-x-4 mt-6">
                <div className="min-w-0 flex-auto">
                    <p>
                        <label htmlFor="message"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Neue
                            Frage</label>
                        <textarea
                            onChange={handleNameChange}
                            id="message" rows="4"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Schreiben Sie hier..."></textarea>
                    </p>
                    <p className={'text-right mt-2'}>
                        <button
                            onClick={handleNewQuestion}
                            className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Fragen
                        </button>
                    </p>
                </div>

            </div>
        </div>
    )
}
