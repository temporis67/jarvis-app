// this component renders a single answer
import useAnswersStore from "@/app/store/answersStore";
import { AnswerType } from "@/app/store/answersStore";
import clsx from "clsx";
import { ExclamationCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Moment from "moment";
import React from "react";
import TagList from "./tags/TagList";

export default function AnswerCard({ answer_uuid, handleDeleteAnswer, handleClickEditAnswer,
    handleClickViewAnswer, dragItem, dragOverItem, handleSort }:
    {
        answer_uuid: string,
        handleDeleteAnswer: any,
        handleClickEditAnswer: any,
        handleClickViewAnswer: any,
        dragItem: any,
        dragOverItem: any,
        handleSort: any
    }
) {

    const answers = useAnswersStore(state => state.answers);
    const setAnswers = useAnswersStore(state => state.setAnswers);
    // select current_answer from answers by answer_uuid
    const answer = answers.filter((answer: AnswerType) => answer.uuid === answer_uuid)[0]
    // console.log("AnswerCard: ", answer)

    const current_answer = useAnswersStore(state => state.current_answer);
    const setCurrentAnswer = useAnswersStore(state => state.setCurrentAnswer);


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


    const handleOnClickAnswer = () => {

        console.log("handleOnClickAnswer: ", answer.title)
        console.log("handleOnClickAnswer: ", answer.uuid, " current_answer: ", current_answer?.uuid)

        setCurrentAnswer(answer)
    }


    return (
        <div
            draggable
            key={answer.uuid}
            onDragStart={(e) => (dragItem.current = answer.uuid)}
            onDragEnter={(e) => (
                // console.log("onDragEnter move ", dragItem.current, " to ", answer_uuid),
                dragOverItem.current = answer.uuid)
            }
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleOnClickAnswer}
            className={clsx(
                'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-gray-500 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                    'bg-gray-600': answer.uuid === current_answer?.uuid,
                    'bg-gray-700': answer.uuid !== current_answer?.uuid,
                },
            )}
        >

            <div className={clsx('flex min-w-0 gap-x-4 text-red-500',

            )}


                id={"row1"}>

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

                        <div className="text-sm font-semibold leading-6 text-gray-300" title={answer.uuid}>


                            <div className="text-xs text-gray-400 flex">
                                <div className="mr-4">
                                {answer.creator_name}</div>
                                { 
                                    answer.tags ? <TagList object_uuid={answer.uuid} tags={answer.tags} /> : <TagList object_uuid={answer.uuid} tags={[]} />
                                
                                }
                            </div>
                            <div id={"title_" +
                                answer.uuid}
                                className="mt-1 truncate text-sm leading-5 text-gray-300 "

                                onMouseOver={showFullAnswer}
                                onMouseOut={showShortAnswer}

                            >
                                {answer.title}
                            </div>
                        </div>

                        <div id={"content_" +
                            // @ts-ignore
                            answer.uuid}
                            className="mt-1 truncate text-xs leading-5 text-gray-300"
                            onMouseOver={showFullAnswer}
                            onMouseOut={showShortAnswer}
                        >{
                                // @ts-ignore
                                answer.content}</div>

                            {/* Rank, Time elapsed and Date */}
                        <div className="mt-1 text-xs leading-5 text-gray-400 ">
                            Rank: {answer.rank} Dauer: {

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
                        </div>

                    </div>

                </div>
                {/* Actions */}
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">

                    <EyeIcon className="w-5 h-5 text-gray-300"
                        // @ts-ignore
                        onClick={() => handleClickViewAnswer(answer.uuid)}
                        onMouseOver={(e) => e.currentTarget.style.color = 'darkblue'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'rgb(209,213,219)'} // Setzen Sie hier die ursprüngliche Farbe
                        title={"Antwort ansehen"}
                    />

                    <PencilSquareIcon className="w-5 h-5 text-gray-300"
                        // @ts-ignore
                        onClick={() => handleClickEditAnswer(answer.uuid)}
                        onMouseOver={(e) => e.currentTarget.style.color = 'darkblue'}
                        onMouseOut={(e) => e.currentTarget.style.color = "rgb(209,213,219)"} // Setzen Sie hier die ursprüngliche Farbe
                        title={"Antwort bearbeiten"}
                    />
                    <TrashIcon className="w-5 h-5 text-gray-300"
                        // @ts-ignore
                        onClick={() => handleDeleteAnswer(answer.uuid)}
                        onMouseOver={(e) => e.currentTarget.style.color = 'darkred'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'rgb(209,213,219)'} // Setzen Sie hier die ursprüngliche Farbe
                        title={"Antwort löschen"}
                    />
                </div>
            </div>


        </div>


    )

}