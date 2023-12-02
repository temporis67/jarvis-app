// this component renders a single answer
import useAnswersStore from "@/app/store/answersStore";
import {AnswerType} from "@/app/store/answersStore";
import clsx from "clsx";
import {ExclamationCircleIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import Moment from "moment";
import React from "react";

export default function AnswerCard({key, answer_uuid, handleDeleteAnswer, handleClickEditAnswer, dragItem, dragOverItem, handleSort}: {
    key: any,
    answer_uuid: string,
    handleDeleteAnswer: any,
    handleClickEditAnswer: any,
    dragItem: any,
    dragOverItem: any,
    handleSort: any
}) {

    const answers = useAnswersStore(state => state.answers);
    const setAnswers = useAnswersStore(state => state.setAnswers);
    // select current_answer from answers by answer_uuid
    const answer = answers.filter((answer: AnswerType) => answer.uuid === answer_uuid)[0]
    // console.log("AnswerCard: ", answer)

    const current_answer = useAnswersStore(state => state.current_answer);


// Display full answer
const showFullAnswer = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    const element = event.currentTarget;
    element.className = element.className.replace('truncate', '');
};

const showShortAnswer = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    const element = event.currentTarget;
    // Fügt 'truncate' hinzu, wenn es nicht bereits vorhanden ist
    if (!element.className.includes('truncate')) {
        element.className += ' truncate';
    }
};

    if (answer.status === "loading") return (
        <div
            draggable
            key={key}
            onDragStart={(e) => (dragItem.current = key)}
            onDragEnter={(e) => (dragOverItem.current = key)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className={clsx(
                'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                    'bg-sky-50 text-blue-600': answer_uuid === current_answer?.uuid,
                },
            )}
        >

            <div className="flex min-w-0 gap-x-4" id={"row1"} title={answer_uuid}>
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
            onDragEnter={(e) => (
                // console.log("onDragEnter move ", dragItem.current, " to ", answer_uuid),
                dragOverItem.current = answer_uuid)
            }
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className={clsx(
                'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md bg-gray-700 text-sm font-medium hover:bg-gray-500 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                    'bg-gray-500': answer_uuid === current_answer?.uuid,
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

                        <p className="text-sm truncate font-semibold leading-6 text-gray-300" title={answer.uuid}>


                            {answer.creator_name}:&nbsp;
                            <span id={"title_" +
                                // @ts-ignore
                                answer.uuid}>{
                                answer.title}</span></p>

                        <p id={"content_" +
                            // @ts-ignore
                            answer.uuid}
                           className="mt-1 truncate text-xs leading-5 text-gray-300"
                            onMouseOver={showFullAnswer}
                            onMouseOut={showShortAnswer}
                        >{
                            // @ts-ignore
                            answer.content}</p>

                        <p className="mt-1 text-xs leading-5 text-gray-400 ">
                            Ranking: {answer.quality} Dauer: {

                            parseFloat(answer.time_elapsed).toFixed(1)
                        } s &nbsp;
                            {
                                // @ts-ignore
                                answer.date_updated ? (
                                    <>
                                        <time dateTime={
                                        // @ts-ignore
                                        answer.date_updated}>
                                        {
                                            // @ts-ignore
                                            Moment(answer.date_updated).format('DD.MM.yy HH:mm')
                                        }
                                    </time>
                                    </>
                                ) : (
                                    <>
                                        <time dateTime={// @ts-ignore
                                        answer.date_created}>{// @ts-ignore
                                        Moment(answer.date_created).format('DD.MM.yy HH:mm')
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