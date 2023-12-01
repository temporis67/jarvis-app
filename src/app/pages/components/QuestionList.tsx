import React, {useEffect, useState} from "react";

import clsx from "clsx";
import {QuestionMarkCircleIcon, TrashIcon, PencilSquareIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import Moment from "moment/moment";
import {useSession} from "next-auth/react";
import ModalDialog from "@/app/components/ModalDialog";

import useUserStore from "@/app/store/userStore";
import useQuestionStore, {QuestionType} from "@/app/store/questionStore";


const QuestionList = () => {

    // Initialisierung
    Moment.locale('de');
    const {data: session, status} = useSession(); // now we have a 'session' and session 'status'
    const api_host = "http://127.0.0.1:5000/api";

    // connect variables to zustand store
    const user_uuid = useUserStore(state => state.userUuid);
    const user_name = useUserStore.getState().userName;

    const setUserUuid = useUserStore(state => state.setUserUuid);
    console.log("@/app/pages/components/QuestionList start - UUID: " + user_uuid)

    // Use store functions for handling question state
    const questions = useQuestionStore(state => state.questions);
    const setQuestions = useQuestionStore(state => state.setQuestions);
    const currentQuestionId = useQuestionStore(state => state.currentQuestionId);
    const setCurrentQuestionId = useQuestionStore(state => state.setCurrentQuestionId);

    const currentQuestion = useQuestionStore(state => state.currentQuestion);
    const setCurrentQuestion = useQuestionStore(state => state.setCurrentQuestion);

    const addQuestion = useQuestionStore(state => state.addQuestion); // New function from store
    const delQuestion = useQuestionStore(state => state.delQuestion); // New function from store
    const updateQuestion = useQuestionStore(state => state.updateQuestion); // New function from store


    // Update Question ModalDialog *******************************************************************************
    // Zustand für das Anzeigen des Dialogs
    const [showDialog, setShowDialog] = useState(false);
    const [modalTitle, setModalTitle] = useState(''); // Zustand für Modal-Titel
    const [modalContent, setModalContent] = useState(''); // Zustand für Modal-Inhalt


    // handle title change
    const handleModalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModalTitle(e.target.value);
    };

    // handle content change
    const handleModalContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModalContent(e.target.value);
    };

    const handleSelectQuestion = (event: React.MouseEvent<HTMLElement>, questionId: string) => {
        // @ts-ignore
        setCurrentQuestion(questions.find(q => q.uuid === questionId));
        setCurrentQuestionId(questionId);

    }

    const handleUpdateQuestion = (questionId: string) => {
        const question = questions.find(q => q.uuid === questionId);
        if (question) {
            setModalTitle(question.title || ''); // Use nullish coalescing to handle null values
            setModalContent(question.content || '');
            setCurrentQuestionId(questionId);
        }
        setShowDialog(true);
    }


    const handleDeleteQuestion = (questionId: string) => {
        // Bestätigungsdialog
        const isConfirmed = window.confirm("Sind Sie sicher, dass Sie diese Frage löschen möchten?");

        if (isConfirmed) {
            console.log("handleDeleteQuestion start for question ID: ", questionId);
            api_delete_question(questionId)
                .then(() => {
                    // @ts-ignore
                    let _questionsItems = questions.filter(question => question.uuid !== questionId);
                    // @ts-ignore
                    setQuestions(_questionsItems);
                })
                .catch(error => {
                    console.error("Fehler beim Löschen der Frage: ", error);
                });
        } else {
            console.log("Frage Löschung abgebrochen für ID: ", questionId);
        }
    }


    const api_update_question = async (question: QuestionType) => {


        // console.log("Update Question API fetch() start", questionId, " # ", title, " # ", content);

        let formData = new FormData();
        // @ts-ignore
        formData.append("user_uuid", user_uuid);
        // @ts-ignore
        formData.append("question_uuid", question.uuid);
        formData.append("title", JSON.stringify(question.title));
        formData.append("content", JSON.stringify(question.content));
        formData.append("question", JSON.stringify(question));


        const api_url = (api_host + "/update_question");

        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok', await response.json());
            }
            const data = await response.json();
            console.log("Update Question API fetch() data OK: ", data);

            // LATER: Set all fields based on data/question
            question.date_updated = data.date_updated;

            return question;

            // HERE


        } catch (error) {
            console.log("Error fetching data:", error);
        }

    }


    const saveQuestion = () => {
        // console.log("saveQuestion was clicked: ", currentQuestionId, " # ", modalTitle, " # ", modalContent)

        // HERE

        if (currentQuestionId === '') {

            console.log("Neue Frage wird erstellt")
            // @ts-ignore
            api_new_question().then((new_question: QuestionType) => {
                console.log("Fresh Question Item: ", new_question);
                if (new_question === undefined) {
                    throw new Error('ERROR: pages/questions/page.tsx/saveQuestion(): Could not create new question uuid is undefined');
                } else {
                    setCurrentQuestionId(new_question['uuid'])
                    new_question.uuid = new_question['uuid'];
                    new_question.status = "loading";
                    new_question.title = modalTitle;
                    new_question.content = modalContent;
                    new_question.date_created = Moment().format('DD.MM.YYYY HH:mm');
                    new_question.date_updated = Moment().format('DD.MM.YYYY HH:mm');
                    // update DB via API
                    // @ts-ignore
                    api_update_question(new_question).then(r => {
                        console.log("api_update_question() SUCCESS:: #", r)
                        new_question.status = "loaded";
                        addQuestion(new_question);
                    })
                }

            });
        } else {

            // update DB via API
            if (currentQuestion !== null) {
                console.log("Aktualisiere Frage: ", currentQuestionId, " # ", modalTitle, " # ", modalContent)
                // @ts-ignore
                currentQuestion.title = modalTitle;
                // @ts-ignore
                currentQuestion.content = modalContent;
                // @ts-ignore
                currentQuestion.date_updated = Moment().format('DD.MM.YYYY HH:mm');
                api_update_question(currentQuestion).then(r => {
                    // console.log("api_update_question() SUCCESS:: #", r)
                })

            }


        }


        // update displayed question
        // Erstelle eine Kopie von questions
        let updatedQuestions = questions;
        // console.log("updatedQuestions: ", updatedQuestions);

        // Finde den Index der zu aktualisierenden Frage
        // @ts-ignore
        for (let i = 0; i < updatedQuestions.length; i++) {
            // @ts-ignore
            // console.log("updatedQuestions[i].uuid: ", updatedQuestions[i], " # ", currentQuestionId);
            // @ts-ignore
            if (updatedQuestions[i].uuid === currentQuestionId) {
                // console.log("Aktualisiere den Titel und Inhalt der Frage", modalTitle, modalContent);
                // @ts-ignore
                updatedQuestions[i].title = modalTitle;
                // @ts-ignore
                updatedQuestions[i].content = modalContent;
                const now = new Date()
                updatedQuestions[i].date_updated = now.toString();
                break; // Beende die Schleife, sobald das Element gefunden und aktualisiert wurde
            }
        }


        // Aktualisiere den State mit der neuen Fragenliste
        setQuestions(updatedQuestions);
        setShowDialog(false); // ModalDialog schließen
    }


    const handleClickNewQuestion = () => {
        // console.log("handleClickNewQuestion start");
        setModalTitle(''); // Setze den Titel der Frage
        setModalContent(''); // Setze den Inhalt der Frage
        setCurrentQuestionId(''); // Keine Id als Signal für 'neue Frage'
        setShowDialog(true); // ModalDialog anzeigen
    }


    const api_delete_question = async (questionId: string) => {
        // console.log("Delete Question API fetch() start")

        let formData = new FormData();
        // @ts-ignore
        formData.append("user_uuid", user_uuid);
        formData.append("question_uuid", questionId);

        const api_url = (api_host + "/delete_question");

        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok', await response.json());
            }
            const data = await response.json();
            console.log("Delete Question API fetch() data OK: ", data);


            // console.log("Delete Question API fetch() out_items: ");

            return;

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }

    const api_new_question = async () => {
        // console.log("New Question API fetch() start")
        const api_host = "http://127.0.0.1:5000/api";
        const api_url = (api_host + "/new_question");

        let formData = new FormData();
        // @ts-ignore
        formData.append("user_uuid", user_uuid);
        formData.append("title", "");
        formData.append("content", "");

        const new_question: QuestionType = {
            uuid: '',
            status: '',
            creator_uuid: '',
            creator_name: '',
            time_elapsed: '',
            title: '',
            content: '',
            date_created: '',
            date_updated: '',
            answers: null,
        }


        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok', await response.json());
            }
            const data = await response.json();
            // console.log(":::: New Question API fetch() data OK: ", data);

            let out_items = {};
            Object.keys(data).forEach(key => {
                // @ts-ignore
                out_items[key] = data[key];
                if (key in new_question) {
                    // @ts-ignore
                    new_question[key] = data[key];
                }

            });
            // @ts-ignore
            out_items['creator'] = session.user.name;

            console.log("New Question API fetch() out_items: ", new_question);

            return out_items;

        } catch (error) {
            console.log("Error fetching data:", error);
        }


    };


    const api_get_questions_by_user = async (user_uuid2: string | null) => {

        const api_url = (api_host + "/questions");
        console.log("questions/page/get_questions_by_user() start", user_uuid2)

        if (user_uuid2 === undefined || user_uuid2 === null) {
            throw new Error('ERROR: pages/questions/page.tsx/get_questions_by_user(): user uuid not given:: ' + user_uuid2);
        }

        let formData = new FormData();
        //@ts-ignore
        formData.append("user_uuid", user_uuid2);


        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const out_items = Object.values(data); // Wandelt das Objekt in ein Array von Werten um

            // @ts-ignore
            console.log("get_questions_by_user() date_updated: ", out_items[0]['date_updated']);

            out_items.sort((a, b) => {
                // @ts-ignore
                const dateA = new Date(a['date_updated']);
                // @ts-ignore
                const dateB = new Date(b['date_updated']);
                // console.log("dateA: ", dateA, " # dateB: ", dateB);
                return dateA.getTime() - dateB.getTime();
            });
            let out_items2 = out_items.reverse();

            for (let q of out_items2) {
                // @ts-ignore
                // console.log("Question: " + q['date_updated']);
                // @ts-ignore
                // ToDo: replace creator with user name
                q['creator'] = user_name;


            }
            // @ts-ignore
            setQuestions(out_items);
            // @ts-ignore
            if (currentQuestionId === null || currentQuestionId === '' && out_items.length > 0) {
                // @ts-ignore
                setCurrentQuestionId(out_items[0].uuid);
                // @ts-ignore
                setCurrentQuestion(out_items[0]);
            }
            // @ts-ignore


            // console.log("Erstes Element:", data[Object.keys(data)[0]].title, data[Object.keys(data)[0]].uuid);

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };


    const onClose = () => {
        // console.log("Modal has closed")
        setShowDialog(false); // ModalDialog schließen
    }


// execute get_questions_by_user on page load
    useEffect(() => {
        // const user_uuid = useUserStore.getState().userUuid;
        api_get_questions_by_user(user_uuid).then(r => {
            // console.log("useEffect get_questions_by_user() SUCCESS:: #", r, " # ", useUserStore.getState().userUuid)
        }).catch(e => {
            console.error("useEffect get_questions_by_user() ERROR:: #", e, " # ", user_uuid)
        });
    }, []);
    // console.log("API fetched Questions Ende: ")


// Drag & Drop Handling *******************************************************************************

// save reference for dragItem and dragOverItem
    const dragItem = React.useRef<any>(null);
    const dragOverItem = React.useRef<any>(null);

// const handle drag sorting
    const handleSort = () => {
        //duplicate items
        // @ts-ignore
        let _questionsItems = [...questions];

        //remove and save the dragged item content
        const draggedItemContent = _questionsItems.splice(dragItem.current, 1)[0];

        //switch the position
        _questionsItems.splice(dragOverItem.current, 0, draggedItemContent);

        //reset the position ref
        dragItem.current = null;
        dragOverItem.current = null;

        //update the actual array
        // @ts-ignore
        setQuestions(_questionsItems);
    };

// Ende Drag & Drop Handling *******************************************************************************

    // Display full text view
    const showFullQuestion = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        const element = event.currentTarget;
        element.className = element.className.replace('truncate', '');
    };

    const showShortQuestion = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        const element = event.currentTarget;
        // Fügt 'truncate' hinzu, wenn es nicht bereits vorhanden ist
        if (!element.className.includes('truncate')) {
            element.className += ' truncate';
        }
    };

// Main Component *************************************************************************************************
    // @ts-ignore
    return (
        <div className={"w-1/2"}>
            <div className={"flex items-center"}>
                <div className={"p-2"}>Fragen</div>
                <div className={"p-2"}>
                    <PlusCircleIcon className="w-5 h-5 text-gray-400"
                                    onClick={() => handleClickNewQuestion()}
                                    onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                    />

                </div>


            </div>


            {/********* ModalDialog Popup *********/}
            {showDialog && (
                <ModalDialog
                    title="Frage bearbeiten"
                    onClose={onClose}
                    onOk={saveQuestion}
                    showDialog={showDialog}
                >

                    <div className="col-span-full">
                        <label htmlFor="modal-title" className="block text-sm font-medium leading-6 text-gray-900">
                            Frage:
                        </label>
                        <div className="mt-2">
                                <textarea
                                    id="modal-title"
                                    name="modal-title"
                                    // @ts-ignore
                                    onChange={handleModalTitleChange}
                                    rows={3}
                                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={modalTitle}
                                />
                        </div>

                    </div>

                    <div className="col-span-full">
                        <label htmlFor="modal-content" className="block text-sm font-medium leading-6 text-gray-900">
                            Hintergrund:
                        </label>
                        <div className="mt-2">
                                <textarea
                                    id="modal-content"
                                    name="modal-content"
                                    // @ts-ignore
                                    onChange={handleModalContentChange}
                                    rows={5}
                                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={modalContent}
                                />
                        </div>
                        <p className="mt-3 text-xs leading-6 text-gray-600">
                            Die Hintergrundinformationen beeinflussen die Antwort des Models entscheidend.
                            Hilfreich sind sprachlich ähnlich Texte aus dem gleichen Themengebiet.

                        </p>
                    </div>


                </ModalDialog>
            )}


            {/*Questions*/}

            {questions && (
                questions.map((question, index) => (

                    //@ts-ignore
                    <div
                        draggable
                        key={index}
                        onDragStart={(e) => (dragItem.current = index)}
                        onDragEnter={(e) => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        //@ts-ignore
                        onClick={(event) => handleSelectQuestion(event, question.uuid)}
                        className={clsx(
                            'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                                // @ts-ignore
                                'bg-sky-100': question.uuid === currentQuestionId,
                            }
                        )}
                    >
                        <div className="flex min-w-1 gap-x-4">
                            <QuestionMarkCircleIcon className={"w-5 h-5 text-gray-400"}
                                                    onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                                                    onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                                                    title={question.uuid}


                            />
                        </div>
                        <div className="flex min-w-0 gap-x-4">

                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">{
                                    // @ts-ignore
                                    question.creator}:&nbsp;
                                    {/* set id to question.uuid */}

                                    <span id={"title_" +
                                        // @ts-ignore
                                        question.uuid}>{
                                        // @ts-ignore
                                        question.title}</span></p>
                                <p id={"content_" +
                                    // @ts-ignore
                                    question.uuid}
                                   className="mt-1 truncate text-xs leading-5 text-gray-500"
                                   onMouseOver={showFullQuestion}
                                   onMouseOut={showShortQuestion}

                                >{
                                    // @ts-ignore
                                    question.content}</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-xs leading-6 text-gray-600">
                                {
                                    // @ts-ignore
                                    question.tags ? (
                                        // @ts-ignore
                                        question.tags.map((tag: string) => (
                                            <span key={tag}>
                                    #{tag}&nbsp;
                                </span>
                                        ))
                                    ) : (<span>
                                    #noTag&nbsp;
                                </span>
                                    )}

                            </p>
                            {

                                question.date_updated ? (
                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        <time dateTime={
                                        // @ts-ignore
                                        question.date_updated}>
                                        {
                                            // @ts-ignore
                                            Moment(question.date_updated).format('DD.MM.YY HH:mm')
                                        }
                                    </time>
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        <time
                                        // @ts-ignore
                                        dateTime={
                                        question.date_created}>{// @ts-ignore
                                        Moment(question.date_created).format('DD.MM.y HH:mm')
                                    }</time>
                                    </p>
                                )}
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <TrashIcon className="w-5 h-5 text-gray-400"
                                // @ts-ignore
                                       onClick={() => handleDeleteQuestion(question.uuid)}
                                       onMouseOver={(e) => e.currentTarget.style.color = 'red'}
                                       onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                                       title={"Frage löschen"}
                            />
                            <PencilSquareIcon className="w-5 h-5 text-gray-400"
                                // @ts-ignore
                                              onClick={() => handleUpdateQuestion(question.uuid)}
                                              onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                                              onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                                              title={"Frage bearbeiten"}

                            />
                        </div>
                    </div>


                ))
            )}


        </div>
    )
}

export default QuestionList;