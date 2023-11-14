"use client";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export default function Layout({children}: { children: React.ReactNode }) {

    const {status} = useSession();
    if (status === 'authenticated')
        return (
            <div>
                {children}
            </div>
        );
    else redirect("/");


}