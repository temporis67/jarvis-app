import { redirect } from "next/navigation";
import { PlusCircleIcon, PowerIcon } from "@heroicons/react/24/outline";
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
            return (
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
            console.error('API Host down? - Failed to fetch user in /app/pages.tsx/getUser() :', error);
            throw new Error('Faild getting UserId - API Host down?' + error,);
        }

    }

    if (is_client) {
        return (<h1 className="heading block">Houston .... </h1>);

    }
    else {

        const session = await getServerSession();
        if (session) {
            // console.log("app/page.tsx session ", session)
            // console.log("app/page.tsx is Logged in Server :: #", session?.user?.email,"#")

            let uuid = await getUserByEMail(session);
            return (
                redirect("/pages/?uuid=" + uuid)
            );

        }
        // no session
        return (
            // That's left blank for nowm while the static content is on layout.tsx to remain serverside.
            // The Welcome Page for new users goes here
            <main className="mt-8 ml-40 p-4">
                <h1 className={"mb-4 text-xl md:text-2xl"}>
                Preussen KI Demonstrator
                </h1>
                <div>
                <p className="m-2">Beim Preussen KI Demonstrator handelt es sich um eine Machbarkeitsstudie zu den Einsatzmöglichkeiten einer lokalen LLM in der Forschung zu Fragen der Preußischen Geschichte.</p>
    <p className="m-2">
        Der Demonstrator erhebt keinen Anspruch auf Vollständigkeit oder fehlerfreies Funktionieren. Der Demonstrator ist zeitlich begrenzt. </p>
    <p className="m-2">Die verwendeten Daten stammen aus folgender Ressource: <a href=" https://actaborussica.bbaw.de/register/personen/detail.xql?id=P0004671">https://actaborussica.bbaw.de/register/personen/detail.xql?id=P0004671</a></p>
    <hr className="mt-5 mb-5"/>
    
                    <p  className="m-2">
                        Bitte melden Sie sich an oder registrieren Sie sich.
                    </p>
                    <p className={"m-2 text-xs text-gray-400"}>
                        Die Angaben werden nicht geprüft. Im Profil werden ihre Fragen & Antworten gespeichert.
                    </p>

                </div>
                <div className="flex p-6 gap-4">

                    {/* Login Button */}
                    <div className="p-2 flex h-[32px] w-[120px] items-center justify-center rounded-md bg-gray-700 text-sm font-medium hover:bg-gray-500 md:justify-start">
                        <div className="mr-2">
                            <a href="/api/auth/signin">
                                <PowerIcon className="w-5" />
                            </a>
                        </div>
                        <div className="hidden md:block">
                            <a href="/api/auth/signin">Anmelden</a>

                        </div>

                    </div>

                    {/* Register Button */}
                    <div className="p-2 flex h-[32px] w-[120px] items-center justify-center rounded-md bg-gray-700 text-sm font-medium hover:bg-gray-500 md:justify-start">                        <div>
                            <a href="/register">
                                <PlusCircleIcon className="w-5 mr-2" />
                            </a>
                        </div>
                        <div className="hidden md:block">
                            <a href="/register">Registrieren</a>

                        </div>

                    </div>

                </div>

            </main>


        );
    }
}
