"use client";
import NavLinks from './NavLinks';
import Logo from '@/app/components/Logo';
import {PowerIcon} from '@heroicons/react/24/outline';

import Link from "next/link";
import {signIn, signOut, useSession} from "next-auth/react";

import useUserStore from "@/app/store/userStore";
import {useEffect} from "react";

function AuthButton() {
    const {data: session} = useSession();

    if (session) {
        return (

                <button
                    className="flex h-[44px] grow items-center justify-center gap-2 rounded-md bg-gray-700 text-gray-400 p-3 text-sm font-medium hover:bg-gray-500 md:flex-none md:justify-start md:p-2 md:px-3"
                    onClick={() => signOut()}
                >
                    <PowerIcon className="w-6"/>
                    <p className="hidden md:block">Sign Out</p>
                </button>

        );
    }
    return (
        <>
            {/*Not signed in 2 <br/>*/}
            <button
                className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-700 p-3 text-sm font-medium hover:bg-gray-500 md:flex-none md:justify-start md:p-2 md:px-3"
                onClick={() => signIn()}
            >
                <PowerIcon className="w-6"/>
                <div className="hidden md:block">Sign In</div>
            </button>
        </>
    );
}


export default function SideNav() {

    const {data: session, status} = useSession(); // now we have a 'session' and session 'status'
    const user_name = useUserStore(state => state.userName);
    const user_uuid = useUserStore(state => state.userUuid);


    if (status === 'authenticated') {
        return (
            <div className="flex h-full flex-col jupx-3 py-4 md:px-2">
                {/* Logo */}
                <a
                    className="flex flex-col justify-end mb-2 h-20 rounded-md bg-blue-950 p-4 md:h-40"
                    href="/"
                >
                    <div className="text-gray-400 text-right items-end">
                        <Logo/>
                    </div>
                    {
                        user_name ? <div className="text-right text-gray-400"
                            // @ts-ignore
                                         title={user_uuid}>for {user_name}</div> : <div>{user_uuid}</div>
                    }
                </a>


                <div className="flex grow flex-row justify-items-start space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                    <NavLinks/>
                    <AuthButton/>
                </div>

            </div>
        );
    } else {
        return (
            <div className="flex h-full flex-col jupx-3 py-4 md:px-2">
                <div className="flex grow flex-row justify-items-start space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                    <AuthButton/>
                </div>
            </div>
        );
    }

}
