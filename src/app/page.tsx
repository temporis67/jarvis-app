import {getServerSession} from "next-auth";
import {lusitana} from "@/app/lib/fonts";

export default async function Home() {
    const session = await getServerSession();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Jarvis - LLM Demonstrator
            </h1>
            {
                session?.user?.name ? (
                    <>
                        <p className={"mb-2"}>
                            Hallo {session?.user?.name}!</p>

                        <p>
                            In diesem Demonstrator können Sie das Verhalten von Large Language Models (LLM) testen und
                            dabei das "Hintergrundwissen" des Modells um eigene Daten ergänzen (Context)
                            sowie das Verhalten des Models über Anweisungen (Prompt) steuern.
                            Beginnen Sie, indem Sie in den Bereich Fragen wechseln und dort eine Frage stellen.
                        </p>
                    </>

                ) : (
                    <p>Bitte loggen Sie sich ein.<br/>
                        Bei SignIn => Credentials können Sie als neuer Nutzer einen beliebigen Nutzernamen & Passwort
                        verwenden.</p>
                )
            }
        </main>


        /*

            <>





            </>
        */
    );
}
