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
    const setUserEmail = useUserStore(state => state.setUserEmail);

    // fetch user via api
    const getUser = async () => {
        const api_host = process.env.NEXT_PUBLIC_JARVIS_API_HOST;
        const api_url = (api_host + "/user");
        const email = session?.user?.email;
        const user_name = session?.user?.name;

        console.log("pages/questions/getUser() start ", email, api_url)

        let formData = new FormData();
        if (!(email === undefined || email === null)) {
            formData.append("email", email);
        }
        if (!(user_name === undefined || user_name === null)) {
        formData.append("name", user_name);
        }
        if (!(user_uuid === undefined || user_uuid === null)) {
        formData.append("uuid", user_uuid);
        }


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
            console.log("pages/layout getting user.uuid by email from session SUCCESS: " + data['name'] + " ## " + data['uuid'])
            setUserUuid(data['uuid']); // via zustand store
            setUserName(data['name']); // via zustand store
            setUserEmail(data['email']); // via zustand store

        //    console.log("setting uuid via zustand store: " + useUserStore.getState().userUuid)
            // sessionStorage.setItem("user_uuid", data['uuid']);
            return data['name'];

        } catch (error) {
            console.error('API Host down? - Failed to fetch user in /app/api/auth.../route.ts/getUser() :', error);
            throw new Error('Failed to fetch user.');
        }

    }


    if (status === 'authenticated') {
        // initialize user_uuid one time
        if (user_uuid === null) {
            getUser().then(r => {
                console.log("pages/layout.tsx: getUser() SUCCESS:: #", r, " # ", useUserStore.getState().userUuid)

            }).catch(e => {
                console.error("pages/layout.tsx: getUser() ERROR:: #", e, " # ", user_uuid)
            })
        } else {
            // console.log("pages/layout.tsx: getUser() SKIP:: #", user_uuid, " # ", useUserStore.getState().userUuid)
        }

        return (
            <div>
                {children}
            </div>
        );
    } else redirect("/");
}