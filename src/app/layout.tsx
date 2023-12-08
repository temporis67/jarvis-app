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
    description: "Another Reactive Llama",
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
            <html lang="en">
                <body className={`${inter.className} antialiased`} id="root">
      
                        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                            {/*This is the main content area */}
                            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                                {children}
                            </div>
                        </div>
  
                </body>
            </html>

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
