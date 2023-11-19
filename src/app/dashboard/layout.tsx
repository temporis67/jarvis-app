"use client";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {useEffect} from "react";


export default function Layout({children}: { children: React.ReactNode }) {

    const {data: session, status} = useSession()

    if(status === 'unauthenticated'){
        redirect("/");
    }


    const email = session?.user?.email;
    if (email === undefined || email === null) {
        throw new Error('ERROR: user email not found in session - Not authorized?');
    }

    const api_host = "http://127.0.0.1:5000/api";
    const api_url = (api_host + "/user");


    const getUser = async () => {

        console.log("dashboard/layout/getUser() start ", email, api_url)

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
            sessionStorage.setItem("user_uuid", data['uuid']);

        } catch (error) {
            console.error('API Host down? - Failed to fetch user in /app/api/auth.../route.ts/getUser() :', error);
            throw new Error('Failed to fetch user.');
        }

    }

    // execute fetch data on page load
    useEffect(() => {
        //@ts-ignore
        getUser(session?.user?.email);
    }, []);

    if (status === 'authenticated') {

        return (
            <div>
                {children}
            </div>
        );
    } else redirect("/");


}