// this component renders a single answer
import useAnswersStore from "@/app/store/answersStore";
import {AnswerType} from "@/app/store/answersStore";
import clsx from "clsx";
import {ExclamationCircleIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import Moment from "moment";
import React from "react";

export default function AnswerCard({answer_uuid, handleDeleteAnswer, handleClickEditAnswer}: {
    answer_uuid: string,
    handleDeleteAnswer: any,
    handleClickEditAnswer: any
}) {

    const answers = useAnswersStore(state => state.answers);
    // select current_answer from answers by answer_uuid
    const answer = answers.filter((answer: AnswerType) => answer.uuid === answer_uuid)[0]
    const current_answer = useAnswersStore(state => state.current_answer);

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


    if (answer.status === "loading") return (
        <div
            draggable
            key={answer_uuid}
            onDragStart={(e) => (dragItem.current = answer_uuid)}
            onDragEnter={(e) => (dragOverItem.current = answer_uuid)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className={clsx(
                'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                    'bg-sky-50 text-blue-600': answer_uuid === current_answer?.uuid,
                },
            )}
        >

            <div className="flex min-w-0 gap-x-4" id={"row1"} title={current_answer?.uuid}>
                <div className="flex min-w-1 gap-x-4">
                    <ExclamationCircleIcon className={"w-5 h-5 text-gray-400"}
                                           onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                                           onMouseOut={(e) => e.currentTarget.style.color = 'gray'}
                                           title={answer_uuid}
                    />
                </div>
                <div className="flex min-w-0 gap-x-4">

                    Antwort wird erzeugt, bitte warten. Es kann bis zu 30 Sekunden dauern.
                    <div
                        className="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-white"
                        role="status" aria-label="loading"><span className="sr-only">Loading...</span></div>
                </div>
            </div>
        </div>


    )

        ;


    return (
        <div
            draggable
            key={answer_uuid}
            onDragStart={(e) => (dragItem.current = answer_uuid)}
            onDragEnter={(e) => (dragOverItem.current = answer_uuid)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className={clsx(
                'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                    'bg-sky-50 text-blue-600': answer_uuid === current_answer?.uuid,
                },
            )}
        >

            <div className="flex min-w-0 gap-x-4" id={"row1"}>
                {/* Icon */}
                <div className="flex min-w-1 gap-x-4">
                    <ExclamationCircleIcon className={"w-5 h-5 text-gray-400"}
                                           onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                                           onMouseOut={(e) => e.currentTarget.style.color = 'gray'}
                                           title={answer_uuid}
                    />
                </div>
                {/* Username, Title, Metadata */}
                <div className="flex min-w-0 gap-x-4">

                    <div className="min-w-0 flex-auto">

                        <p className="text-sm truncate font-semibold leading-6 text-gray-900" title={answer.uuid}>


                            {answer.username}:&nbsp;
                            <span id={"title_" +
                                // @ts-ignore
                                answer.uuid}>{
                                answer.title}</span></p>

                        <p id={"content_" +
                            // @ts-ignore
                            answer.uuid}
                           className="mt-1 truncate text-xs leading-5 text-gray-500">{
                            // @ts-ignore
                            answer.content}</p>
                        <p className="mt-1 text-xs leading-5 text-gray-500 ">
                            Quality: {answer.quality} Time: {answer.time_elapsed} &nbsp;
                            {
                                // @ts-ignore
                                answer.dateUpdated ? (
                                    <>
                                        Updated: <time dateTime={
                                        // @ts-ignore
                                        answer.dateUpdated}>
                                        {
                                            // @ts-ignore
                                            Moment(answer.dateUpdated).format('DD.MM.yy HH:mm')
                                        }
                                    </time>
                                    </>
                                ) : (
                                    <>
                                        Created: <time dateTime={// @ts-ignore
                                        answer.dateCreated}>{// @ts-ignore
                                        Moment(answer.dateCreated).format('DD.MM.yy HH:mm')
                                    }</time>
                                    </>
                                )}
                        </p>
                    </div>

                </div>
                {/* Actions */}
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <TrashIcon className="w-5 h-5 text-gray-400"
                        // @ts-ignore
                               onClick={() => handleDeleteAnswer(answer.uuid)}
                               onMouseOver={(e) => e.currentTarget.style.color = 'red'}
                               onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                               title={"Antwort löschen"}
                    />
                    <PencilSquareIcon className="w-5 h-5 text-gray-400"
                        // @ts-ignore
                                      onClick={() => handleClickEditAnswer(answer.uuid)}
                                      onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                                      onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe
                                      title={"Antwort bearbeiten"}
                    />
                </div>
            </div>


        </div>


    )

}