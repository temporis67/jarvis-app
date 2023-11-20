import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import clsx from "clsx";
import {QuestionMarkCircleIcon, TrashIcon, PencilSquareIcon, ExclamationCircleIcon} from "@heroicons/react/24/outline";
import Moment from "moment/moment";
import {useSession} from "next-auth/react";
import ModalDialog from "@/app/components/ModalDialog";
import {useSearchParams} from 'next/navigation'
import useUserStore from "@/app/store/userStore";
import useQuestionStore from "@/app/store/questionStore";
import useAnswersStore from "@/app/store/answersStore";
import {AnswerType} from "@/app/store/answersStore";


const AnswerList = () => {

    // Initialisierung
    Moment.locale('de');
    const {data: session, status} = useSession(); // now we have a 'session' and session 'status'
    const api_host = "http://127.0.0.1:5000/api";

    // connect variables to zustand store
    const user_uuid = useUserStore(state => state.userUuid);

    console.log("@/app/dashboard/components/AnswerList start - UUID: " + user_uuid)

    // handle questionsItems via zustand store
    const answers = useAnswersStore(state => state.answers);
    const setAnswers = useAnswersStore(state => state.setAnswers);
    const addAnswer = useAnswersStore(state => state.addAnswer);
    const delAnswer = useAnswersStore(state => state.delAnswer);
    const updateAnswer = useAnswersStore(state => state.updateAnswer);

    const currentQuestionId = useQuestionStore(state => state.currentQuestionId);
    const setCurrentQuestionId = useQuestionStore(state => state.setCurrentQuestionId);




    // Update Question ModalDialog *******************************************************************************
    // Zustand für das Anzeigen des Dialogs
    const [showDialog, setShowDialog] = useState(false);
    const [modalTitle, setModalTitle] = useState(''); // Zustand für Modal-Titel
    const [modalContent, setModalContent] = useState(''); // Zustand für Modal-Inhalt
    const [currentAnswerId, setCurrentAnswerId] = useState('');


    // handle title change
    const handleModalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModalTitle(e.target.value);
    };

    // handle content change
    const handleModalContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModalContent(e.target.value);
    };


    const handleClickEditAnswer = (answerId: string) => {
        console.log("handleClickEditAnswer start for answer ID: ", answerId);
        // @ts-ignore
        const answer = answers.find(a => a.uuid === answerId);
        if (answer) {
            // @ts-ignore
            setModalTitle(answer.title); // Setze den Titel der Frage
            // @ts-ignore
            setModalContent(answer.content); // Setze den Inhalt der Frage
            setCurrentAnswerId(answerId); // Speichere die aktuelle Frage-ID
        }
        setShowDialog(true); // ModalDialog anzeigen
    }


    const api_update_answer = async (answer_uuid: string, title: string, content: string) => {
        console.log("Update Answer API fetch() start", answer_uuid, " # ", title, " # ", content);


        let formData = new FormData();
        // @ts-ignore
        formData.append("user_uuid", user_uuid);
        formData.append("answer_uuid", answer_uuid);
        formData.append("title", title);
        formData.append("content", content);


        const api_url = (api_host + "/api_update_answer");

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
            console.log("Update Answer API fetch() data OK: ", data);
        } catch (error) {
            console.log("Error fetching data:", error);
        }

    }

    const onClose = () => {
        console.log("Modal has closed")
        setShowDialog(false); // ModalDialog schließen
    }

    const handleClickUpdateAnswer = () => {
        console.log("handleClickUpdateAnswer was clicked: ", currentAnswerId, " # ", modalTitle, " # ", modalContent)

        // update DB via API
        api_update_answer(currentAnswerId, modalTitle, modalContent);

        let answer = answers.filter(a => a.uuid === currentAnswerId)[0];
        answer.title = modalTitle;
        answer.content = modalContent;
        updateAnswer(answer);

        setShowDialog(false); // ModalDialog schließen
    }


    const api_delete_answer = async (answerId: string) => {
        console.log("Delete Answer API fetch() start")

        let formData = new FormData();
        // @ts-ignore
        formData.append("user_uuid", user_uuid);
        formData.append("question_uuid", answerId);

        const api_url = (api_host + "/api_delete_answer");

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
            console.log("Delete Answer API fetch() data OK: ", data);

            return;

        } catch (error) {
            console.log("dashboard/components/AnswerList/api_delete_answer Error fetching data:", error);
        }
    }


    const get_answers_by_question = async (question_uuid: string | null) => {

        const api_url = (api_host + "/answers_by_question");
        console.log("questions/page/get_answers_by_question() start", question_uuid)

        if (question_uuid === undefined || question_uuid === null) {
            throw new Error('ERROR: dashboard/components/AnswerList/get_answers_by_question(): question_uuid not given:: ' + question_uuid);
        }

        let formData = new FormData();
        //@ts-ignore
        formData.append("question_uuid", question_uuid);


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
            const out_items:any = Object.values(data); // Wandelt das Objekt in ein Array von Werten um
            for (let a of out_items) {
                let answer: AnswerType = {
                    uuid: a.uuid,
                    creator: a.creator,
                    source: a.source,
                    time_elapsed: a.time_elapsed,
                    question: a.question,
                    title: a.title,
                    content: a.content,
                    quality: a.quality,
                    trust: a.trust,
                    dateCreated: a.dateCreated,
                    dateUpdated: a.dateUpdated,
                }
                console.log("Answer: " + a);
                // setting answers with data from api
                addAnswer(answer);
            }
            console.log("get_answers_by_question() SUCCESS:: #", out_items.length)
            console.log("Erstes Element:", data[Object.keys(data)[0]].title, data[Object.keys(data)[0]].uuid);

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };


    // execute get_answers_by_question on page load
    useEffect(() => {


        get_answers_by_question(currentQuestionId).then(r => {
            console.log("useEffect get_answers_by_question() SUCCESS:: #", r, " # ", currentQuestionId)
        }).catch(e => {
            console.error("useEffect AnswerList/get_answers_by_question() ERROR:: #", e, " # ", currentQuestionId)
        });
    }, []);
    console.log("API fetched Questions Ende: ")

    const handleDeleteAnswer = (answerId: string) => {
        // Bestätigungsdialog
        const isConfirmed = window.confirm("Sind Sie sicher, dass Sie diese Frage löschen möchten?");

        if (isConfirmed) {
            console.log("handleDeleteAnswer start for question ID: ", answerId);
            api_delete_answer(answerId)
                .then(() => {
                   delAnswer(answerId);
                })
                .catch(error => {
                    console.error("AnswerList/handleDeleteAnswer: Fehler beim Löschen der Antwort: ", error);
                });
        } else {
            console.log("Antwort Löschung abgebrochen für ID: ", answerId);
        }
    }


// Drag & Drop Handling *******************************************************************************

// save reference for dragItem and dragOverItem
    const dragItem = React.useRef<any>(null);
    const dragOverItem = React.useRef<any>(null);

// const handle drag sorting
    const handleSort = () => {
        //duplicate items
        // @ts-ignore
        let _answers = [...answers];

        //remove and save the dragged item content
        const draggedItemContent = _answers.splice(dragItem.current, 1)[0];

        //switch the position
        _answers.splice(dragOverItem.current, 0, draggedItemContent);

        //reset the position ref
        dragItem.current = null;
        dragOverItem.current = null;

        //update the actual array
        // @ts-ignore
        setAnswers(_answers);
    };

// Ende Drag & Drop Handling *******************************************************************************


// Main Component *************************************************************************************************
    return (
        <div>
            <p className={""}>Antworten</p>
            {/********* ModalDialog Popup *********/}
            {showDialog && (
                <ModalDialog
                    title="Antwort bearbeiten"
                    onClose={onClose}
                    onOk={handleClickUpdateAnswer}
                    showDialog={showDialog}
                >

                    <div className="col-span-full">
                        <label htmlFor="modal-title" className="block text-sm font-medium leading-6 text-gray-900">
                            Antwort:
                        </label>
                        <div className="mt-2">
                                <textarea
                                    id="modal-title"
                                    name="modal-title"
                                    // @ts-ignore
                                    onChange={handleModalTitleChange}
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={modalTitle}
                                />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">Einfach ... drauflosfragen.</p>
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
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={modalContent}
                                />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">Wird später für LLM.context benutzt.</p>
                    </div>


                </ModalDialog>
            )}


            {/*Answers*/}

            {answers && (
                answers.map((answer, index) => (

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
                            <ExclamationCircleIcon className="w-6 h-6"/>
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">{
                                    // @ts-ignore
                                    answer.creator}:
                                    <span id="title_{answer.uuid}">{
                                        // @ts-ignore
                                        answer.title}</span></p>
                                <p id="content_{answer.uuid}"
                                   className="mt-1 truncate text-xs leading-5 text-gray-500">{
                                    // @ts-ignore
                                    answer.content}</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            {/*<p className="text-xs leading-6 text-gray-600">*/}
                            {/*    {*/}
                            {/*        // @ts-ignore*/}
                            {/*        answer.tags ? (*/}
                            {/*            // @ts-ignore*/}
                            {/*            answer.tags.map((tag: string) => (*/}
                            {/*                <span key={tag}>*/}
                            {/*        #{tag}&nbsp;*/}
                            {/*    </span>*/}
                            {/*            ))*/}
                            {/*        ) : (<span>*/}
                            {/*        #noTag&nbsp;*/}
                            {/*    </span>*/}
                            {/*        )}*/}

                            {/*</p>*/}
                            {
                                // @ts-ignore
                                answer.dateUpdated ? (
                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Updated: <time dateTime={
                                        // @ts-ignore
                                        answer.dateUpdated}>
                                        {
                                            // @ts-ignore
                                            Moment(answer.dateUpdated).format('DD.MM.yy HH:mm')
                                        }
                                    </time>
                                    </p>
                                ) : (
                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Created: <time dateTime={// @ts-ignore
                                        answer.dateCreated}>{// @ts-ignore
                                        Moment(answer.dateCreated).format('DD.MM.yy HH:mm')
                                    }</time>
                                    </p>
                                )}
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <TrashIcon className="w-5 h-5 text-gray-400"
                                // @ts-ignore
                                       onClick={() => handleDeleteAnswer(answer.uuid)}
                                       onMouseOver={(e) => e.currentTarget.style.color = 'red'}
                                       onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                            />
                            <PencilSquareIcon className="w-5 h-5 text-gray-400"
                                // @ts-ignore
                                              onClick={() => handleClickEditAnswer(answer.uuid)}
                                              onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                                              onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                            />
                        </div>
                    </div>


                ))
            )}


        </div>
    )
}

export default AnswerList;