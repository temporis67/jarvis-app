import { redirect } from "next/navigation";
import { PowerIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./lib/fonts";
import { getServerSession } from "next-auth";
import Link from "next/link";


export default async function Home() {
    const is_client = typeof window !== "undefined";

    // fetch user via api
    async function getUserByEMail(session: any) {
        const api_host = process.env.NEXT_PUBLIC_JARVIS_API_HOST;
        // api function user expects email as parameter (or name or uuid)
        const api_url = (api_host + "/user");
        const email = session?.user?.email;        

        console.log("app/page.tsx /getUserByEMail() start ", email, api_url)

        let formData = new FormData();
        if (!(email === undefined || email === null)) {
            formData.append("email", email);
        }
        else {
            return(
                redirect("/api/auth/signin")
            );
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

            // sessionStorage.setItem("user_uuid", data['uuid']);
            return data['uuid'];

        } catch (error) {
            console.error('API Host down? - Failed to fetch user in /app/api/auth.../route.ts/getUser() :', error);
            throw new Error('Failed to fetch user.' +  error,);
        }

    }

    if (is_client) {
        return (<h1 className="heading block">Houston .... </h1>);

    }
    else {
        
        const session = await getServerSession();
        if (session){
            console.log("app/page.tsx session ", session)
            console.log("app/page.tsx is Logged in Server :: #", session?.user?.email,"#")
            
            let uuid = await getUserByEMail(session);
            return (
                redirect("/pages/?uuid=" + uuid)
            );

        }
        // no session
        return (
            // That's left blank for nowm while the static content is on layout.tsx to remain serverside.
                        // The Welcome Page for new users goes here
                        <main className="mt-40 ml-40 p-4">
                        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Jarvis - LLM Demonstrator
        </h1>
        <div>
            <p className={""}>
                Bitte loggen Sie sich ein oder <Link href="/register" className="font-bold"> registrieren</Link> Sie sich.
            </p>
            <p className={"text-xs text-gray-400"}>
                Die Angaben werden nicht geprüft. Im Profil werden die Fragen & Antworten gespeichert.
            </p>

        </div>
        <div>
            <div
                className="mt-5 flex h-[32px] w-[130px] items-center justify-center gap-2 rounded-md bg-gray-700 p-3 text-sm font-medium hover:bg-gray-500 md:flex-none md:justify-start md:p-2 md:px-3"

            >
                <div>
                    <a href="/api/auth/signin">
                        <PowerIcon className="w-6" />
                    </a>
                </div>
                    <div className="hidden md:block">
                    <a href="/api/auth/signin">Sign In</a>

                    </div>

            </div>
        </div>

    </main>


        );
    }
}
