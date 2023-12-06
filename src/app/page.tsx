"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import useUserStore from "./store/userStore";

export default async function Home() {
    const { data: session, status } = useSession(); // now we have a 'session' and session 'status'
    const is_client = typeof window !== "undefined";

    const user_uuid = useUserStore(state => state.userUuid);
    const setUserUuid = useUserStore(state => state.setUserUuid);
    const setUserName = useUserStore(state => state.setUserName);
    const setUserEmail = useUserStore(state => state.setUserEmail);

    // fetch user via api
    async function getUserByEMail() {
        const api_host = process.env.NEXT_PUBLIC_JARVIS_API_HOST;
        // api function user expects email as parameter (or name or uuid)
        const api_url = (api_host + "/user");
        const email = session?.user?.email;
        const user_name = session?.user?.name;

        console.log("app/page.tsx /getUserByEMail() start ", email, api_url)

        let formData = new FormData();
        if (!(email === undefined || email === null)) {
            formData.append("email", email);
        }
        else {
            throw new Error('ERROR: User not found / No email in Session',);
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
                throw new Error('ERROR: User not found / UUID in Rsponse is null', await response.json());
            }
            console.log("app/page getting user.uuid by email from session SUCCESS: " + data['name'] + " ## " + data['uuid'])
            setUserUuid(data['uuid']); // via zustand store
            setUserName(data['name']); // via zustand store
            setUserEmail(data['email']); // via zustand store

        //    console.log("setting uuid via zustand store: " + useUserStore.getState().userUuid)
            // sessionStorage.setItem("user_uuid", data['uuid']);
            return data['uuid'];

        } catch (error) {
            console.error('API Host down? - Failed to fetch user in /app/api/auth.../route.ts/getUser() :', error);
            throw new Error('Failed to fetch user.');
        }

    }

    // page action if authenticated
    if (status === 'authenticated') {
        console.log("IS CLIENT:", is_client);
        if(user_uuid === null) {
            console.log("app/page.tsx /getUserByEMail() start ", session?.user?.email)
            // get uuid from database by email and set it to useUserStore
            let new_uuid = await getUserByEMail();
            return(
                redirect("/pages/?uuid=" + new_uuid)
            )
        }
        else {
            return(
                redirect("/pages/?uuid=" + user_uuid)
            )
        }

    }
    // maybe status === loading here ...
    else {

        return (
            // That's left blank for nowm while the static content is on layout.tsx to remain serverside.
            <></>
    
        );
    }
}
