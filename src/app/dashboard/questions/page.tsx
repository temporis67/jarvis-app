"use client";
import 'moment/locale/de';
import React, {useEffect} from "react";
import QuestionList from "@/app/dashboard/components/QuestionList";
import NewQuestionForm from "@/app/dashboard/components/NewQuestionForm";
import {useSession} from "next-auth/react";

function Page() {

    let user_uuid = "";

    useEffect(() => {
      // Perform localStorage action
        user_uuid = localStorage.getItem("user_uuid");
    }, [])

    console.log("questions/pages.tsx start UUID: #" , user_uuid,"#")


    const {data: session, status} = useSession(); // now we have a 'session' and 'status'

    // Main List of Questions &  handler *************************************************************************
    const [questionsItems, setQuestionItems] = React.useState([
    ])


    // console.log("TypeOf Questions: " + typeof questionsItems)

    // Main Component *************************************************************************************************

    return (

        <div className="divide-y divide-gray-100">

            <div>Nutzer: {
                // @ts-ignore
                session.user.name
            }
            UUID: {user_uuid}
            </div>

            {/*Questions*/}
            <QuestionList
                // @ts-ignore
                user_uuid={user_uuid}
                questionsItems={questionsItems}
                setQuestionItems={setQuestionItems}/>

           <NewQuestionForm
               // @ts-ignore
                user_uuid={user_uuid}
                questionsItems={questionsItems}
                setQuestionItems={setQuestionItems}
            />

        </div>
    )
}

export default Page;
