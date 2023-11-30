import "./globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {getServerSession} from "next-auth";
import SessionProvider from "./components/SessionProvider";
import SideNav from "@/app/components/SideNav";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Jarvis UI",
    description: "Another NextJS Llama",
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();




    return (
        <html lang="en">
        <body className={`${inter.className} antialiased`} id="root">
        <SessionProvider session={session}>

            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <div className="w-full flex-none md:w-52">
                    <SideNav/>
                </div>
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
