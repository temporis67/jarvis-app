"use client";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import React from "react";
export default function Layout({children}: { children: React.ReactNode }) {

    const {data: session, status} = useSession()

    if (status === 'authenticated') {
        return (
            <div>
                {children}
            </div>
        );
    } else redirect("/");
}