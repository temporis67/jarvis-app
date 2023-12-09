import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import {
    PlusCircleIcon, CalculatorIcon
} from "@heroicons/react/24/outline";
import Moment from "moment/moment";

import ModalDialog from "@/app/components/ModalDialog";
import useUserStore from "@/app/store/userStore";
import useQuestionStore from "@/app/store/questionStore";

import useAnswersStore from "@/app/store/answersStore";
import { AnswerType } from "@/app/store/answersStore";
import AnswerCard from "@/app/pages/components/AnswerCard";
import useModelStore from "@/app/store/modelStore";


const AnswerList = () => {

    // Initialisierung
    Moment.locale('de');

    const api_host = process.env.NEXT_PUBLIC_JARVIS_API_HOST;

    // connect variables to zustand store
    const user_uuid = useUserStore(state => state.userUuid);
    const user_name = useUserStore.getState().userName;


    // handle questionsItems via zustand store
    const answers = useAnswersStore(state => state.answers);
    const setAnswers = useAnswersStore(state => state.setAnswers);
    const addAnswer = useAnswersStore(state => state.addAnswer);
    const delAnswer = useAnswersStore(state => state.delAnswer);
    const updateAnswer = useAnswersStore(state => state.updateAnswer);

    const questions = useQuestionStore(state => state.questions);
    const currentQuestionId = useQuestionStore(state => state.currentQuestionId);
    const [loadedQuestionId, setLoadedQuestionId] = useState(null);
    // console.log("@/app/pages/components/AnswerList currentQuestionId: " + currentQuestionId)
    // const setCurrentQuestionId = useQuestionStore(state => state.setCurrentQuestionId);

    const current_model = useModelStore(state => state.current_model);

    console.log("AnswerList start, answers: ", answers)


    // Update Question ModalDialog *******************************************************************************
    // Zustand für das Anzeigen des Dialogs
    const [showDialog, setShowDialog] = useState(false);
    const [modalHeader, setModalHeader] = useState(''); // Zustand für Modal-Header
    const [modalTitle, setModalTitle] = useState(''); // Zustand für Modal-Titel
    const [modalContent, setModalContent] = useState(''); // Zustand für Modal-Inhalt
    const [currentAnswerId, setCurrentAnswerId] = useState('');
    const [isLoading, setIsLoading] = useState('');



    const get_answers_by_question = async (question_uuid: string | null) => {

    };



    const load_answers = useCallback(async () => {

        // console.log("load_answers() start: ", currentQuestionId, " # ")
        if (currentQuestionId === undefined || currentQuestionId === null) {
            console.log("load_answers() no currentQuestionId given");
            return;
        } else {
            const api_url = (api_host + "/answers");
            let formData = new FormData();
            //@ts-ignore
            formData.append("question_uuid", currentQuestionId);


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
                const out_items: any = Object.values(data); // Wandelt das Objekt in ein Array von Werten um
                // console.log("::::::::::::: get_answers_by_question() data OK: ", out_items);
                // clear answers
                setAnswers([]);
                if (out_items.length === 0) {
                    return out_items;
                } // empty list


                // sort out_items by 'rank' which is a number
                out_items.sort((a: number, b: number) => {
                    // @ts-ignore
                    const rankA = a['rank'];
                    // @ts-ignore
                    const rankB = b['rank'];
                    // console.log("rankA: ", rankA, " # rankB: ", rankB);
                    return rankB - rankA;
                });
                out_items.reverse();


                for (let a of out_items) {
                    let answer: AnswerType = {
                        uuid: a.uuid,
                        creator_uuid: a.creator_uuid,
                        creator_name: a.creator_name,
                        user_uuid: a.user_uuid,
                        user_name: a.username,
                        source: a.source,
                        time_elapsed: a.seconds,
                        question: a.question,
                        title: a.title,
                        content: a.content,
                        quality: a.quality,
                        trust: a.trust,
                        date_created: a.date_created,
                        date_updated: a.date_updated,
                        rank: a.rank,
                    }
                    // console.log("Answer Time Elapsed: " + a.time_elapsed);
                    // setting answers with data from api
                    addAnswer(answer);
                }


                console.log("get_answers_by_question() SUCCESS:: #", out_items)
                // console.log("Erstes Element:", data[Object.keys(data)[0]].title, data[Object.keys(data)[0]].uuid);

            } catch (error) {
                console.log("Error fetching data:", error);
            }

        }

    }, [currentQuestionId, addAnswer, api_host, setAnswers]);




    useEffect(() => {
        if (currentQuestionId !== loadedQuestionId) {
            // here we async load the answers from external API and we have top wait for it
            load_answers();

            setLoadedQuestionId(currentQuestionId);
        }
    }, [currentQuestionId, loadedQuestionId, load_answers,]);



    // handle title change
    const handleModalTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModalTitle(e.target.value);
    };

    // handle content change
    const handleModalContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModalContent(e.target.value);
    };


    const api_new_answer = async (question_uuid: string | null, creator_uuid: string, user_uuid: string) => {
        // console.log("New Answer API fetch() start", question_uuid)

        if (question_uuid === undefined || question_uuid === null || creator_uuid === undefined || creator_uuid === null || user_uuid === undefined || user_uuid === null) {
            throw new Error('ERROR: pages/components/AnswerList/api_new_answer(): question_uuid not given:: ' + question_uuid);
        }

        let formData = new FormData();
        // @ts-ignore
        formData.append("question_uuid", question_uuid);
        formData.append("creator_uuid", creator_uuid);
        formData.append("user_uuid", user_uuid);
        const api_url = (api_host + "/new_answer");

        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('api_new_answer Network response was not ok', await response.json());
            }
            const data = await response.json();
            if (!data.uuid) {
                throw new Error('api_new_answer no uuid in new answer', await response.json());
            }
            // console.log("New Answer API fetch() data OK: ", data);
            // console.log("New Answer UUID: ", data.uuid);

            return data.uuid;

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }


    const handleClickNewAnswer = () => {
        // console.log("handleClickNewAnswer was clicked: ", currentQuestionId, " # ", modalTitle, " # ", modalContent)

        // get new answerId from API - creator==user
        // @ts-ignore
        api_new_answer(currentQuestionId, user_uuid, user_uuid).then(new_answer_id => {
            setCurrentAnswerId(new_answer_id)
            setModalHeader("Neue Antwort"); // Setze den Titel des Dialogs
            setShowDialog(true); // ModalDialog anzeigen
        });
    }

    const handleClickEditAnswer = (answerId: string) => {
        console.log("handleClickEditAnswer start for answer ID: ", answerId);
        // @ts-ignore
        const answer = answers.find(a => a.uuid === answerId);
        if (answer) {
            setModalHeader("Antwort bearbeiten"); // Setze den Titel des Dialogs
            // @ts-ignore
            setModalTitle(answer.title); // Setze den Titel der Frage
            // @ts-ignore
            setModalContent(answer.content); // Setze den Inhalt der Frage
            setCurrentAnswerId(answerId); // Speichere die aktuelle Frage-ID
        }
        setShowDialog(true); // ModalDialog anzeigen
    }


    const apiFetch = async (slug: string, formData: FormData): Promise<any> => {
        console.log("API fetch() start", slug);

        if (slug === undefined || slug === null) {
            throw new Error('ERROR: apiFetch(): slug not given: ' + slug);
        }

        const api_url = api_host + "/" + slug; // Assuming api_host is defined elsewhere

        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',
            });
            if (!response.ok) {
                throw new Error('apiFetch Network response was not ok: ' + await response.json());
            }
            const data = await response.json();
            // console.log("AnswerList.apiFetch() data OK: ", data);

            return data; // Return the whole response data

        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }


    const handleAskQuestion = (questionId: string) => {

        setIsLoading("loading")
        console.log("Start handleAskQuestion questionId: " + questionId);
        // @ts-ignore
        const question = questions?.filter((question: any) => question.uuid === questionId)[0].title;
        // @ts-ignore
        const context = questions?.filter((question: any) => question.uuid === questionId)[0].content;
        // @ts-ignore
        const prompt = current_model?.default_prompt.replace("{question}", question).replace("{context}", context);
        // console.log("handleAskQuestion prompt: " + prompt);


        // add answer to store with status loading
        const now = new Date();
        // console.log(now.toString());

        const newAnswer: AnswerType = {
            uuid: "",
            status: "loading",
            // @ts-ignore
            creator_uuid: current_model.uuid,
            creator_name: current_model?.model_label || "??",
            // @ts-ignore
            user_name: user_name,
            user_uuid: user_uuid,
            // @ts-ignore
            source: current_model.uuid,
            time_elapsed: "",

            question: questionId,
            title: "",
            content: "",
            quality: 0,
            trust: 0,
            date_created: now.toString(),
            date_updated: now.toString(),
            rank: 100,
        }

        // @ts-ignore
        api_new_answer(questionId, current_model.uuid, user_uuid).then(new_answer_id => {
            setCurrentAnswerId(new_answer_id)
            newAnswer.uuid = new_answer_id;
            newAnswer.status = "loading";

            // set form data
            const formData = new FormData();
            formData.append('question_uuid', questionId);
            formData.append('question', JSON.stringify(question));
            // @ts-ignore
            formData.append('model', JSON.stringify(current_model));
            // @ts-ignore
            formData.append("creator_uuid", current_model.uuid);
            // @ts-ignore
            formData.append('user_uuid', user_uuid);
            // @ts-ignore
            formData.append('answer', JSON.stringify(newAnswer));
            // @ts-ignore
            formData.append('prompt', prompt);

            // fetch answer from api
            apiFetch("ask", formData).then(answer => {
                console.log("AnswerList.api_new_answer.ask answer: ", answer);
                newAnswer.uuid = answer.uuid;
                newAnswer.title = answer.title;
                newAnswer.content = answer.content;
                newAnswer.status = "loaded";
                newAnswer.time_elapsed = answer.time_elapsed;
                // console.log("AnswerList.api_new_answer.ask time_elapsed: ", newAnswer.time_elapsed);
                newAnswer.creator_uuid = answer.creator_uuid;
                newAnswer.user_name = answer.username;
                // FIXME: rank should be calculated by API
                newAnswer.rank = 100;

                let old_one = answers[0]
                if (old_one !== undefined) {
                    // @ts-ignore
                    old_one.rank = old_one.rank - 1;
                    // updateAnswer(old_one);
                    api_update_answer_rank(old_one.uuid, old_one.rank);

                }


                addAnswer(newAnswer);
                setIsLoading("")

            });


            console.log("End handleAskQuestion newAnswer.uuid: " + newAnswer.uuid);
            // update answer in store


            // here
        });


    }


    const api_update_answer = async (answer_uuid: string, title: string, content: string) => {
        // console.log("Update Answer API fetch() start", answer_uuid, " # ", title, " # ", content);


        let formData = new FormData();
        // @ts-ignore
        formData.append("answer_uuid", answer_uuid);
        formData.append("title", title);
        formData.append("content", content);


        const api_url = (api_host + "/update_answer");

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
        // console.log("handleClickUpdateAnswer was clicked: ", currentAnswerId, " # ", modalTitle, " # ", modalContent)

        // update DB via API
        api_update_answer(currentAnswerId, modalTitle, modalContent);

        let answer = answers.filter(a => a.uuid === currentAnswerId)[0];
        if (answer === undefined || answer === null) {
            // add new answer to store
            console.log("handleClickUpdateAnswer: adding new answer")
            const new_answer: AnswerType = {
                uuid: currentAnswerId,
                creator_uuid: user_uuid,
                creator_name: user_name || "",
                user_uuid: user_uuid,
                user_name: user_name || "",
                source: user_uuid,
                time_elapsed: "00:00:00",
                // @ts-ignore
                question: currentQuestionId,
                title: modalTitle,
                content: modalContent,
                quality: 50,
                trust: 100,
                date_created: Moment().format('YYYY-MM-DD HH:mm:ss'),
                date_updated: Moment().format('YYYY-MM-DD HH:mm:ss'),
            }

            addAnswer(new_answer);
        } else {
            answer.title = modalTitle;
            answer.content = modalContent;
        }

        setShowDialog(false); // ModalDialog schließen
    }


    const api_delete_answer = async (answerId: string) => {
        console.log("Delete Answer API fetch() start")

        let formData = new FormData();
        // @ts-ignore
        formData.append("answer_uuid", answerId);

        const api_url = (api_host + "/delete_answer");

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
            console.log("pages/components/AnswerList/api_delete_answer Error fetching data:", error);
        }
    }





    const handleDeleteAnswer = (answerId: string) => {
        // Bestätigungsdialog
        const isConfirmed = window.confirm("Sind Sie sicher, dass Sie diese Antwort löschen möchten?");

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


    const api_update_answer_rank = async (answer_uuid: string, rank: number) => {
        console.log("Update Answer Rank API fetch() start", answer_uuid, " # ", rank);

        let formData = new FormData();
        // @ts-ignore
        formData.append("answer_uuid", answer_uuid);
        // @ts-ignore
        formData.append("user_uuid", user_uuid);
        formData.append("rank", rank.toString());
        // @ts-ignore
        formData.append("question_uuid", currentQuestionId);

        const api_url = (api_host + "/update_answer_rank");

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
            console.log("Update Answer Rank API fetch() data OK: ", data);
        } catch (error) {
            console.log("Error fetching data:", error);
        }

    }


    const fix_ranking = (answers: AnswerType[]) => {
        console.log("fix_ranking() start: ", answers)
        // @ts-ignore
        let _answers = [...answers];

        let offset = 0;
        for (let i = 0; i < _answers.length; i++) {
            // when an answer.rank is equal or bigger then the precessor's rank then decrease it to be lower the the rank of precessor

            if (i < _answers.length - 1) // all but last element
            {
                // if rank is same or lower than sucessor, hit him
                // @ts-ignore
                if (_answers[i].rank === _answers[i + 1].rank || _answers[i].rank < _answers[i + 1].rank) {
                    // @ts-ignore
                    _answers[i + 1].rank = _answers[i].rank - 1;
                    api_update_answer_rank(_answers[i + 1].uuid, _answers[i + 1].rank);
                }
            }

        }
        console.log("fix_ranking() end: ", _answers)
        return _answers;

    }



    // const handle drag sorting
    const handleSort = () => {
        //duplicate items
        // @ts-ignore
        let _answers = [...answers];
        // console.info("handleSort: dragging  ", dragItem, " to ", dragOverItem)
        console.info("Answers: ", _answers)


        const dragOverItemContent = _answers.find(answer => answer.uuid === dragOverItem.current);
        const dragItemIndex = _answers.findIndex(item => item.uuid === dragItem.current);
        //remove and save the dragged item content
        const draggedItemContent = _answers.splice(dragItemIndex, 1)[0];
        const dragOverItemIndex = _answers.findIndex(item => item.uuid === dragOverItem.current);


        if (dragItemIndex > dragOverItemIndex) {
            // calculate new rank. for now set the draffed item to the tagets rank abnd decrease target by one
            // @ts-ignore
            draggedItemContent.rank = Number(dragOverItemContent.rank) + 1;
            //switch the position
            _answers.splice(dragOverItemIndex, 0, draggedItemContent);

            console.log("Moving UP")
        }
        else {
            // @ts-ignore
            draggedItemContent.rank = dragOverItemContent.rank - 1;
            _answers.splice(dragOverItemIndex + 1, 0, draggedItemContent);
            console.log("Moving DOWN")

        }




        // save the rank of the dragged item and the target item
        // @ts-ignore
        api_update_answer_rank(draggedItemContent.uuid, draggedItemContent.rank);
        // @ts-ignore
        // api_handle_update_answer_rank(dragOverItemContent.uuid, dragOverItemContent.rank);


        _answers = fix_ranking(_answers);

        //reset the position ref
        dragItem.current = null;
        dragOverItem.current = null;

        //update the actual array
        // @ts-ignore
        setAnswers(_answers);
    };

    // Ende Drag & Drop Handling *******************************************************************************


    //     console.log("AnswerList.tsx Ende: " + user_uuid)

    // Main Component *************************************************************************************************
    // @ts-ignore
    return (
        <div className={"w-1/2"}>
            {/*********** Answers Header ************/}
            <div className={"flex"}>
                <div className={"p-2 text-sm  text-gray-400"}>
                    
                    {(answers?.length === 0) && "Noch keine Antworten"}
                    {(answers?.length === 1) && "Eine Antwort"} 
                    {(answers?.length > 1) && answers?.length + " Antworten"} 
                    
                </div>
                <div className={"flex flex row-end-2 p-2"}>
                    <PlusCircleIcon className="w-5 h-5 text-gray-400"
                        onClick={() => handleClickNewAnswer()}
                        onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                        title={"Neue Antwort schreiben"}
                    />

                    <CalculatorIcon className="w-5 h-5 text-gray-400"
                        // @ts-ignore
                        onClick={() => handleAskQuestion(currentQuestionId)}
                        onMouseOver={(e) => e.currentTarget.style.color = 'green'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                        title={"Model fragen"}
                    />
                    {isLoading === "loading" && (
                        <div className="animate-spin h-5 w-5 text-blue-500"
                            title={"Antwort wird berechnet - Bitte warten Sie geduldig..."}
                        >
                            <svg className="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path
                                    d="M12 6v6l4 2" />
                            </svg>
                        </div>
                    )
                    }


                </div>
            </div>

            {/********* ModalDialog Popup *********/}
            {showDialog && (
                <ModalDialog
                    title={modalHeader}
                    onClose={onClose}
                    onOk={handleClickUpdateAnswer}
                    showDialog={showDialog}
                >

                    <div className="col-span-full text-gray-200">
                        <label htmlFor="modal-title" className="block text-sm font-medium leading-6">
                            Kernaussage:
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="modal-title"
                                name="modal-title"
                                // @ts-ignore
                                onChange={handleModalTitleChange}
                                rows={2}
                                className="bg-gray-700  p-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                defaultValue={modalTitle}
                            />
                        </div>
                    </div>

                    <div className="mt-4 col-span-full">
                        <label htmlFor="modal-content" className="block text-sm font-medium leading-6">
                            Hintergrund:
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="modal-content"
                                name="modal-content"
                                // @ts-ignore
                                onChange={handleModalContentChange}
                                rows={6}
                                className="bg-gray-700  p-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                defaultValue={modalContent}
                            />
                        </div>

                    </div>


                </ModalDialog>
            )}


            {/********** Answers List ***********/}

            {
                answers && (
                    answers.map((answer, index) => (
                        <AnswerCard
                            key={index}
                            answer_uuid={answer.uuid}
                            handleDeleteAnswer={handleDeleteAnswer}
                            handleClickEditAnswer={handleClickEditAnswer}
                            dragItem={dragItem}
                            dragOverItem={dragOverItem}
                            handleSort={handleSort}

                        />
                    )
                    ))
            }
        </div>
    )
}

export default AnswerList;