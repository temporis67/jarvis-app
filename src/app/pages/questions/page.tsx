"use client";
import 'moment/locale/de';
import React, {useEffect} from "react";
import QuestionList from "@/app/pages/components/QuestionList";
import AnswerList from "@/app/pages/components/AnswerList";
import ModelCardList from "@/app/pages/components/ModelCardList";
import NewQuestionForm from "@/app/pages/components/NewQuestionForm";
import {useSession} from "next-auth/react";
import useUserStore from "@/app/store/userStore";

function Page() {

    // Initialize session
    console.log("questions/page.tsx start")
    const {data: session, status} = useSession(); // now we have a 'session' and 'status'

    // connect variables to zustand store
    const user_uuid = useUserStore(state => state.userUuid);


    return (
        <div className="divide-y divide-gray-100">
            <div className={"flex flex-row"}>
                <ModelCardList mode={"short"}/>
            </div>
            {/* Questions & Answers */}
            <div className={"flex flex-row"}>
                <QuestionList/>
                <AnswerList/>
            </div>

        </div>
    )


}

export default Page;
