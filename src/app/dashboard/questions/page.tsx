"use client";
import {
    QuestionMarkCircleIcon,

} from '@heroicons/react/24/outline';
import clsx from "clsx";
import Moment from 'moment';
import 'moment/locale/de';
import React, {useState, useEffect} from "react";
import QuestionList from "@/app/dashboard/components/QuestionList";
import NewQuestionForm from "@/app/dashboard/components/NewQuestionForm";
import {useSession} from "next-auth/react";

function Page() {

    console.log("questions/pages.tsx start")


    const {data: session, status} = useSession(); // now we have a 'session' and 'status'

    // Main List of Questions &  handler *************************************************************************
    const [questionsItems, setQuestionItems] = React.useState([
        {
            uuid: '02968b5e-7861-11ee-aef8-047c16bbac52',
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
            uuid: '12968b5e-7861-11ee-aef8-047c16bbac53',
            creator: 'Hans',
            title: 'Wo liegt Köln?',
            content: `      
        Ich möchte dort Bier trinken. Besonders interessiert mich der Karneval und das Essen.     
    `,
            dateCreated: '2021-10-02T12:34:56.000Z',
            dateUpdated: '2021-10-02T12:34:56.000Z',
            tags: ['Köln', 'Bier', 'Karneval'],
        },
    ])


    console.log("TypeOf Questions: " + typeof questionsItems)

    // Main Component *************************************************************************************************

    // @ts-ignore
    return (

        <div className="divide-y divide-gray-100">

            <div>Nutzer: {
                // @ts-ignore
                session.user.name
            }
            </div>

            {/*Questions*/}
            <QuestionList
                questionsItems={questionsItems}
                setQuestionItems={setQuestionItems}/>

            <NewQuestionForm
                questionsItems={questionsItems}
                setQuestionItems={setQuestionItems}
            />

        </div>
    )
}

export default Page;
