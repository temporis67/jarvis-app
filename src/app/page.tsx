"use client";
import {lusitana} from "@/app/lib/fonts";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export default function Home() {
    const {data: session, status} = useSession(); // now we have a 'session' and session 'status'

    if (status === 'authenticated') {
        redirect("/pages")
    }

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Jarvis - LLM Demonstrator 
            </h1>
                    <>
                    <p className={"font-semibold"}>Bitte loggen Sie sich ein.</p>
                    <p className={"font-light text-sm"}>
                        Bei &quot;Sign In&quot; &rarr; &quot;Credentials&quot; können Sie als neuer Nutzer einen beliebigen Nutzernamen & Passwort
                        verwenden.</p>
                    </>
        </main>

    );
}
