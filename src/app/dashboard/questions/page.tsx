"use client";
import {
    QuestionMarkCircleIcon,

} from '@heroicons/react/24/outline';
import clsx from "clsx";
import Moment from 'moment';
import 'moment/locale/de';
import React from "react";
const questions = [
    {
        id: 1,
        author: 'Peter',
        title: 'Wo liegt Berlin?',
        content: `      
        Ich möchte dort einige Museen besuchen. Besonders interessiert mich Malerei und Moderne Kunst.      
    `,
        dateCreated: '2021-10-15T12:34:56.000Z',
        tags: ['Berlin', 'Museen', 'Kunst'],
    },
    {
        id: 2,
        author: 'Hans',
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
        author: 'Peter',
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
        author: 'Hans',
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
        author: 'Bodo',
        title: 'Wo liegt Frankfurt?',
        content: `      
        Ich möchte dort die Börse besuchen. Besonders interessiert mich die Skyline.     
    `,
        dateCreated: '2021-10-05T12:34:56.000Z',
        dateUpdated: '2021-10-05T12:34:56.000Z',
        tags: ['Frankfurt', 'Börse', 'Skyline'],
    },
]

export default function Page() {
    Moment.locale('de');

    return (

        <div className="divide-y divide-gray-100">

            {questions.map((question) => (

                    //@ts-ignore
                <div my_test="hallo" draggable key={question.id} className={clsx(
                    'm-1 p-3 flex grow items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                    {
                        'bg-sky-50 text-blue-600': question.id === 2,
                    },
                )}
                >
                    <div className="flex min-w-0 gap-x-4">
                        <QuestionMarkCircleIcon className="w-6 h-6"/>
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{question.author}: {question.title}</p>
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


        </div>
    )
}
