"use client";

import QuestionList from "@/app/pages/components/QuestionList";
import AnswerList from "@/app/pages/components/AnswerList";
import ModelCardList from "@/app/pages/components/ModelCardList";

function Page() {

    // Initialize session
    console.log("questions/page.tsx start")
    



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
