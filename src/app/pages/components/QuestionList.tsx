import React, { useState } from "react";

import clsx from "clsx";
import { QuestionMarkCircleIcon, TrashIcon, PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Moment from "moment/moment";
import { useSession } from "next-auth/react";
import ModalDialog from "@/app/components/ModalDialog";

import useUserStore from "@/app/store/userStore";
import useQuestionStore, { QuestionType, QuestionsType } from "@/app/store/questionStore";
import useAnswersStore from "@/app/store/answerStore";

const api_host = process.env.NEXT_PUBLIC_JARVIS_API_HOST;


const QuestionList = () => {

    // Initialisierung
    Moment.locale('de');
    const { data: session, status } = useSession(); // now we have a 'session' and session 'status'

    // connect variables to zustand store
    const user_uuid = useUserStore(state => state.userUuid);
    const user_name = useUserStore.getState().userName;

    const setUserUuid = useUserStore(state => state.setUserUuid);
    console.log("@/app/pages/components/QuestionList start - user_uuid: " + user_uuid)

    // Use store functions for handling question state
    const questions = useQuestionStore(state => state.questions);
    console.log("@/app/pages/components/QuestionList start - questions: ", questions)


    const setQuestions = useQuestionStore(state => state.setQuestions);

    const editQuestionId = useQuestionStore(state => state.currentQuestionId);
    const setEditQuestionId = useQuestionStore(state => state.setCurrentQuestionId);
    const currentQuestion = useQuestionStore(state => state.currentQuestion);
    const setCurrentQuestion = useQuestionStore(state => state.setCurrentQuestion);


    const setAnswers = useAnswersStore(state => state.setAnswers);

    const addQuestion = useQuestionStore(state => state.addQuestion); // New function from store
    const delQuestion = useQuestionStore(state => state.delQuestion); // New function from store
    const updateQuestion = useQuestionStore(state => state.updateQuestion); // New function from store


    // Update Question ModalDialog *******************************************************************************
    // Zustand für das Anzeigen des Dialogs
    const [showDialog, setShowDialog] = useState(false);
    const [modalTitle, setModalTitle] = useState(''); // Zustand für Modal-Titel
    const [modalContent, setModalContent] = useState(''); // Zustand für Modal-Inhalt
    const [isLoaded, setIsLoaded] = useState(false); // if list is empty, but loaded from api (no questions yet)

    // save reference for dragItem and dragOverItem
    const dragItem = React.useRef<any>(null);
    const dragOverItem = React.useRef<any>(null);




    if (user_uuid === undefined || user_uuid === null || user_uuid === '') {
        return (
            <h1>Houston ...</h1>
        )
    }



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
        setEditQuestionId(questionId);
        // @ts-ignore
        // setCurrentQuestion(questions.find(q => q.uuid === questionId));


    }

    const handleUpdateQuestion = (questionId: string) => {
        // @ts-ignore
        const question = questions.find(q => q.uuid === questionId);
        if (question) {
            setModalTitle(question.title || ''); // Use nullish coalescing to handle null values
            setModalContent(question.content || '');
            setEditQuestionId(questionId);
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
                    setAnswers([]);
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
            console.log("QL.api_update_question OK: ", data);

            // LATER: Set all fields based on data/question
            question.date_updated = data.date_updated;

            return question;

            // HERE


        } catch (error) {
            console.error("ERROR:: QL.api_update_question: ", error);
        }

    }


    const saveQuestion = () => {
        // console.log("saveQuestion was clicked: ", currentQuestionId, " # ", modalTitle, " # ", modalContent)

        // HERE

        if (editQuestionId === '') {

            console.log("Neue Frage wird erstellt")
            // @ts-ignore
            api_new_question().then((new_question: QuestionType) => {
                // console.log("Fresh Question Item: ", new_question);
                if (new_question === undefined) {
                    throw new Error('ERROR: pages/questions/page.tsx/saveQuestion(): Could not create new question uuid is undefined');
                } else {
                    setEditQuestionId(new_question['uuid'])
                    new_question.uuid = new_question['uuid'];
                    new_question.status = "loading";
                    new_question.title = modalTitle;
                    new_question.content = modalContent;
                    new_question.date_created = Moment().format('DD.MM.YYYY HH:mm');
                    new_question.date_updated = Moment().format('DD.MM.YYYY HH:mm');
                    // update DB via API
                    // @ts-ignore
                    api_update_question(new_question).then(r => {
                        // console.log("api_update_question() SUCCESS:: #", r)
                        new_question.status = "loaded";
                        addQuestion(new_question);
                        
                    })
                }

            });
        } else {

            let edit_question = questions.find(q => q.uuid === editQuestionId) || null;
            // update DB via API
            if (edit_question !== null) {
                console.log("Aktualisiere Frage: ", editQuestionId, " # ", modalTitle, " # ", modalContent)
                // @ts-ignore
                edit_question.title = modalTitle;
                // @ts-ignore
                edit_question.content = modalContent;
                // @ts-ignore
                edit_question.date_updated = Moment().format('DD.MM.YYYY HH:mm');
                api_update_question(edit_question).then(r => {
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
            if (updatedQuestions[i].uuid === editQuestionId) {
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
        setEditQuestionId(''); // Keine Id als Signal für 'neue Frage'
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
            console.log("Delete Question data OK: ", data);



            return;

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }



    const api_update_question_rank = async (questionId: string, rank: any) => {
        console.log("Update Question Rank API fetch() start", questionId, " # ", rank);

        let formData = new FormData();
        // @ts-ignore
        formData.append("user_uuid", user_uuid);
        formData.append("question_uuid", questionId);
        formData.append("rank", rank.toString());

        const api_url = (api_host + "/update_question_rank");

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
            console.log("QL.api_update_question_rank OK: ", data);

            return data;

        } catch (error) {
            console.error("ERROR:: QL.api_update_question_rank: ", error);
        }

    }



    const api_new_question = async () => {
        // console.log("New Question API fetch() start")
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
            rank: 0,
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

            let top_rank = questions[0].rank;
            // @ts-ignore
            out_items['rank'] = top_rank + 1;
            // @ts-ignore
            api_update_question_rank(out_items['uuid'], out_items['rank']);


            console.log("api_new_question OK new_question: ", new_question);

            return out_items;

        } catch (error) {
            console.error("Error fetching data in api_new_question:", error);
        }


    };



    const onClose = () => {
        // console.log("Modal has closed")
        setShowDialog(false); // ModalDialog schließen
    }



    const api_get_questions_by_user = async () => {

        const api_url = (api_host + "/questions");
        console.log("questions/page/get_questions_by_user() start", user_uuid)

        let formData = new FormData();
        //@ts-ignore
        formData.append("user_uuid", user_uuid);


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
            console.log("*** get_questions_by_user(): ", out_items);


            // sort out_items by 'rank' which is a number
            out_items.sort((a, b) => {
                // @ts-ignore
                const rankA = a['rank'];
                // @ts-ignore
                const rankB = b['rank'];
                // console.log("rankA: ", rankA, " # rankB: ", rankB);
                return rankB - rankA;
            });


            for (let q of out_items) {
                // @ts-ignore
                // console.log("Question: " + q['date_updated']);
                // @ts-ignore
                // ToDo: replace creator with user name
                q['creator'] = q['user_name'];


            }

            // @ts-ignore
            setQuestions(out_items);
            // @ts-ignore
            if (editQuestionId === null || editQuestionId === '' && out_items.length > 0) {
                // @ts-ignore
                setEditQuestionId(out_items[0].uuid);
                // @ts-ignore
                setCurrentQuestion(out_items[0]);
            }
            // @ts-ignore


            console.log("** api_get_questions_by_user OK:", out_items);

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };



    // execute get_questions_by_user on page load
    if (!isLoaded) {
        api_get_questions_by_user();
        setIsLoaded(true);
        console.log("Initially loaded questions for user: ", user_uuid);

    }

    console.log("API fetched Questions Ende: ")


    // Drag & Drop Handling *******************************************************************************


    const fix_ranking = (questions: QuestionsType) => {
        console.log("fix_ranking() start: ", questions)
        // @ts-ignore
        let _questions = [...questions];

        let offset = 0;
        for (let i = 0; i < _questions.length; i++) {
            // when an answer.rank is equal or bigger then the precessor's rank then decrease it to be lower the the rank of precessor

            if (i < _questions.length - 1) // all but last element
            {
                // if rank is same or lower than sucessor, hit him
                // @ts-ignore
                if (_questions[i].rank === _questions[i + 1].rank || _questions[i].rank < _questions[i + 1].rank) {
                    // @ts-ignore
                    _questions[i + 1].rank = _questions[i].rank - 1;
                    api_update_question_rank(_questions[i + 1].uuid, _questions[i + 1].rank);
                }
            }

        }
        console.log("fix_ranking() end: ", _questions)
        return _questions;

    }


    // const handle drag sorting
    const handleSort = () => {
        //duplicate items
        // @ts-ignore
        let _questionsItems = [...questions];

        console.log("* handleSort: dragging  ", dragItem.current, " to ", dragOverItem.current)
        // save the dragOverItem content
        const dragOverIndex = _questionsItems.findIndex(question => question.uuid === dragOverItem.current);
        const dragOverItemContent = _questionsItems.find(question => question.uuid === dragOverItem.current);
        //remove and save the dragged item content
        const draggedIndex = _questionsItems.findIndex(question => question.uuid === dragItem.current);
        const draggedItemContent = _questionsItems.splice(draggedIndex, 1)[0];

        console.log("handleSort: dragging  ", draggedItemContent.uuid, " to ", dragOverItemContent?.uuid)


        if (draggedIndex > dragOverIndex) {
            // calculate new rank. for now set the draffed item to the tagets rank abnd decrease target by one
            // @ts-ignore
            draggedItemContent.rank = Number(dragOverItemContent.rank) + 1;
            //switch the position
            _questionsItems.splice(dragOverIndex, 0, draggedItemContent);

            console.log("Moving UP")
        }
        else {
            // @ts-ignore
            draggedItemContent.rank = dragOverItemContent.rank - 1;
            _questionsItems.splice(dragOverIndex + 1, 0, draggedItemContent);
            console.log("Moving DOWN")

        }



        // save the dragged item rank
        // @ts-ignore
        api_update_question_rank(draggedItemContent.uuid, draggedItemContent.rank).then(r => {
            // console.log("api_update_question_rank() SUCCESS:: #", r)
        })

        _questionsItems = fix_ranking(_questionsItems);


        setEditQuestionId(draggedItemContent.uuid);
        setCurrentQuestion(draggedItemContent);

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
                <div className={"p-2 text-sm text-gray-400"}>

                    {(questions?.length === 0) && "Noch keine Fragen"}
                    {(questions?.length === 1) && "Eine Frage"}
                    {(questions?.length > 1) && questions?.length + " Antworten"}
                </div>
                <div className={"p-2"}>
                    <PlusCircleIcon className={clsx("w-5 h-5 ",
                        (questions?.length > 0) && "text-gray-400",
                        (questions?.length === 0) && "text-green-600"
                    )
                    }


                        onClick={() => handleClickNewQuestion()}
                        onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                        title={"Neue Frage erstellen"}
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
                        <label htmlFor="modal-title" className="block text-sm font-medium leading-6">
                            Frage:
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="modal-title"
                                name="modal-title"
                                // @ts-ignore
                                onChange={handleModalTitleChange}
                                rows={3}
                                className="bg-gray-700 p-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                defaultValue={modalTitle}
                            />
                        </div>
                    </div>

                    <div className="col-span-full mt-4">
                        <label htmlFor="modal-content" className="block text-sm font-medium leading-6">
                            Hintergrund:
                        </label>
                        <div className="">
                            <textarea
                                id="modal-content"
                                name="modal-content"
                                // @ts-ignore
                                onChange={handleModalContentChange}
                                rows={5}
                                className="bg-gray-700 p-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                defaultValue={modalContent}
                            />
                        </div>
                        <p className="mt-3 text-xs leading-6">
                            Die Hintergrundinformationen beeinflussen die Antwort des Models entscheidend.
                            Hilfreich sind sprachlich ähnliche Texte aus dem gleichen Themengebiet.<br />
                            Oder zu berücksichtigende Fakten.

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
                        key={question.uuid}
                        onDragStart={(e) => (dragItem.current = question.uuid)}
                        onDragEnter={(e) => (dragOverItem.current = question.uuid)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        //@ts-ignore
                        onClick={(event) => handleSelectQuestion(event, question.uuid)}
                        className={clsx(
                            'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-gray-500 md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                                // @ts-ignore
                                ' bg-gray-600  text-gray-300': question.uuid === editQuestionId,
                                ' bg-gray-700 text-gray-400': question.uuid !== editQuestionId,
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
                                <div className="text-xs text-gray-400 font-semibold leading-6">{
                                    // @ts-ignore
                                    question.creator}
                                    {/* set id to question.uuid */}


                                </div>
                                <div id={"title_" +
                                    // @ts-ignore
                                    question.uuid}>{
                                        // @ts-ignore
                                        question.title}</div>
                                <div id={"content_" +
                                    // @ts-ignore
                                    question.uuid}
                                    className="mt-1 truncate text-xs leading-5"
                                    onMouseOver={showFullQuestion}
                                    onMouseOut={showShortQuestion}

                                >{
                                        // @ts-ignore
                                        question.content}</div>
                                        <div className="flex text-gray-400 mt-1 text-xs leading-5">
                                <div className="mr-3">Rank: {question.rank}</div>
                                {/* Date */}
                                {

                                    question.date_updated ? (
                                        
                                            <time dateTime={
                                                // @ts-ignore
                                                question.date_updated}>
                                                {
                                                    // @ts-ignore
                                                    Moment(question.date_updated).format('DD.MM.YY HH:mm')
                                                }
                                            </time>
                                        
                                    ) : (
                                        
                                            <time
                                                // @ts-ignore
                                                dateTime={
                                                    question.date_created}>{// @ts-ignore
                                                    Moment(question.date_created).format('DD.MM.y HH:mm')
                                                }</time>
                                       
                                    )}

                                    </div>
                            </div>
                            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end ">
                                {/* Tags */}
                                <div className="text-xs leading-6 text-gray-400 ">
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

                                </div>

                            </div>
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