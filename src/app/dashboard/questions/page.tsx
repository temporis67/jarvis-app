"use client";
import 'moment/locale/de';
import React, {useEffect} from "react";
import QuestionList from "@/app/dashboard/components/QuestionList";
import NewQuestionForm from "@/app/dashboard/components/NewQuestionForm";
import {useSession} from "next-auth/react";
import useUserStore from "@/app/store/userStore";

function Page() {

    // Initialize session
    console.log("questions/pages.tsx start")
    const {data: session, status} = useSession(); // now we have a 'session' and 'status'
    // Main List of Questions &  handler *************************************************************************
    const [questionsItems, setQuestionItems] = React.useState([])

    // connect variables to zustand store
    const user_uuid = useUserStore(state => state.userUuid);
    const setUserUuid = useUserStore(state => state.setUserUuid);

    // fetch user via api
    const getUserByEmail = async () => {
        const api_host = "http://127.0.0.1:5000/api";
        const api_url = (api_host + "/user");
        const email = session?.user?.email;
        if (email === undefined || email === null) {
            throw new Error('ERROR: dashboard/questions/page.tsx/getUserByEMail(): user email not found in session');
        }

        console.log("dashboard/questions/getUserByEmail() start ", email, api_url)

        let formData = new FormData();
        formData.append("email", email);


        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',

            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error('ERROR: Network response was not ok', await response.json());
            }
            if (data['uuid'] === undefined || data['uuid'] === null) {
                throw new Error('ERROR: User not found / UUID null', await response.json());
            }
            console.log("dashboard/layout getting user.uuid by email from session SUCCESS: " + data['name'] + " ## " + data['uuid'])
            setUserUuid(data['uuid']); // via zustand store
            console.log("setting uuid via zustand store: " + useUserStore.getState().userUuid)
            // sessionStorage.setItem("user_uuid", data['uuid']);

        } catch (error) {
            console.error('API Host down? - Failed to fetch user in /app/api/auth.../route.ts/getUserByEmail() :', error);
            throw new Error('Failed to fetch user.');
        }

    }

    const renderPage = () => {
        return (
            <div className="divide-y divide-gray-100">
                <div className={"text-xs"}>
                    {
                        // @ts-ignore
                        <b>{session.user.name}</b>
                    }
                    <span className={"text-gray-500"}> UUID: {user_uuid}</span>
                </div>
                {/*Questions*/}
                <div className={"flex flex-row"}>
                <QuestionList/>
                    <div>
                        <h1>Antworten</h1>
                        <QuestionList/>
                    </div>
                </div>

                <NewQuestionForm/>
            </div>
        )
    }

    // initialize user_uuid one time
    if (user_uuid === null) {
        getUserByEmail().then(r => {
            console.log("dashboard/questions/page.tsx: getUserByEmail() SUCCESS:: #", r, " # ", useUserStore.getState().userUuid)
            // Main Component *************************************************************************************************

            return (renderPage())


        }).catch(e => {
            console.error("dashboard/questions/page.tsx: getUserByEmail() ERROR:: #", e, " # ", user_uuid)
        })
    } else {
        return (renderPage())
    }


}

export default Page;
