"use client";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import React from "react";
import useUserStore from "@/app/store/userStore";


export default function Layout({children}: { children: React.ReactNode }) {

    const {data: session, status} = useSession()
    // connect variables to zustand store
    const user_uuid = useUserStore(state => state.userUuid);
    const setUserUuid = useUserStore(state => state.setUserUuid);
    const setUserName = useUserStore(state => state.setUserName);

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
            setUserName(data['name']); // via zustand store
            console.log("setting uuid via zustand store: " + useUserStore.getState().userUuid)
            // sessionStorage.setItem("user_uuid", data['uuid']);
            return data['name'];

        } catch (error) {
            console.error('API Host down? - Failed to fetch user in /app/api/auth.../route.ts/getUserByEmail() :', error);
            throw new Error('Failed to fetch user.');
        }

    }


    if (status === 'authenticated') {
        // initialize user_uuid one time
        if (user_uuid === null) {
            getUserByEmail().then(r => {
                console.log("dashboard/layout.tsx: getUserByEmail() SUCCESS:: #", r, " # ", useUserStore.getState().userUuid)

            }).catch(e => {
                console.error("dashboard/layout.tsx: getUserByEmail() ERROR:: #", e, " # ", user_uuid)
            })
        } else {
            // console.log("dashboard/layout.tsx: getUserByEmail() SKIP:: #", user_uuid, " # ", useUserStore.getState().userUuid)
        }

        return (
            <div>
                {children}
            </div>
        );
    } else redirect("/");
}