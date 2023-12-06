import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getServerSession } from "next-auth";
import SessionProvider from "./components/SessionProvider";
import { PowerIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./lib/fonts";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Jarvis UI",
    description: "Another React Llama",
    authors: [{ name: "Temporis" }],
};


export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    console.log("Root Layout Start",);

    const session = await getServerSession();


    console.info("session", session);

    if (!session) {
        return (
            // The Welcome Page for new users goes here
            <main className="mt-40 ml-40 p-4">
                                <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                    Jarvis - LLM Demonstrator
                </h1>
                <div>
                    <p className={"font-semibold"}>Bitte loggen Sie sich ein.</p>

                    <p className={"font-light text-sm"}>
                        Bei <span className="font-bold">&quot;Sign In&quot; &rarr; &quot;Credentials&quot;</span> können Sie als
                        <span className="font-bold"> neuer Nutzer</span> einen
                        <span className="font-bold"> beliebigen Nutzernamen & Passwort </span>
                        verwenden.</p>
                </div>
                <div>
                    <div
                        className="mt-3 flex h-[32px] w-[130px] items-center justify-center gap-2 rounded-md bg-gray-700 p-3 text-sm font-medium hover:bg-gray-500 md:flex-none md:justify-start md:p-2 md:px-3"

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
    else {

        return (
            <html lang="en">
                <body className={`${inter.className} antialiased`} id="root">
                <SessionProvider session={session}>
                        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                            {/*This is the main content area */}
                            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                                {children}
                            </div>
                        </div>
                    </SessionProvider>

                </body>
            </html>
        );

    }






}
