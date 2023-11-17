"use client";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {useEffect} from "react";


export default function Layout({children}: { children: React.ReactNode }) {

    const {data: session, status} = useSession()
    let email = session?.user?.email;

    const api_host = "http://127.0.0.1:5000/api";
    const api_url = (api_host + "/user");

    let formData = new FormData();
    formData.append("email", email);

    const getUser = async () =>
    {

        console.log("dashboard/layout/getUser() start ", email, api_url)

        try {
            const response = await fetch(api_url, {
                method: "POST",
                body: formData,
                mode: 'cors',

            })
            const data = await response.json()
            console.log("API fetched User Dashboard: " + data['name'] + " ## " + data['uuid'])
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