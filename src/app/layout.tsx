import "./globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {getServerSession} from "next-auth";
import SessionProvider from "./components/SessionProvider";
import SideNav from "@/app/components/SideNav";
import {HydrationProvider, Server, Client} from "react-hydration-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Jarvis UI",
    description: "Another React Llama",
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    console.log("Root Layout Start :", process.env.GITHUB_SECRET);

    return (
        <html lang="en">
        <body className={`${inter.className} antialiased`} id="root">
        <SessionProvider session={session}>

            <HydrationProvider>

                <Server>
                    <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                        {children}
                    </div>
                </Server>
                <Client>
                    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                        <div className="w-full flex-none md:w-52">
                            <SideNav/>
                        </div>
                        {/*This is the main content area */}
                        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                            {children}
                        </div>
                    </div>
                </Client>


            </HydrationProvider>

        </SessionProvider>
        </body>
        </html>
    );
}
