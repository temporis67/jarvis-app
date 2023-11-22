"use client";

import NavLinks from './NavLinks';
import Logo from '@/app/components/Logo';
import {PowerIcon} from '@heroicons/react/24/outline';

import Link from "next/link";
import {signIn, signOut, useSession} from "next-auth/react";

import useUserStore from "@/app/store/userStore";

function AuthButton() {
    const {data: session} = useSession();

    if (session) {
        return (
            <div className={'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'}>
                {/*{session?.user?.name} 2 <br/>*/}
                <button
                    className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                    onClick={() => signOut()}
                >
                    <PowerIcon className="w-6"/>
                    <div className="hidden md:block">Sign Out</div>
                </button>
            </div>
        );
    }
    return (
        <>
            {/*Not signed in 2 <br/>*/}
            <button
                className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                onClick={() => signIn()}
            >
                <PowerIcon className="w-6"/>
                <div className="hidden md:block">Sign In</div>
            </button>
        </>
    );
}



export default function SideNav() {

    const {data: session} = useSession();
    const user_name = useUserStore(state => state.userName);
    const user_uuid = useUserStore(state => state.userUuid);


    return (
        <div className="flex h-full flex-col jupx-3 py-4 md:px-2">

            <Link
                className="flex flex-col justify-end mb-2 h-20 rounded-md bg-blue-600 p-4 md:h-40"
                href="/dashboard"
            >
                <div className="text-white text-right items-end">
                    <Logo/>
                </div>
                            {
                    user_name? <div className="text-white text-right"
                                    // @ts-ignore
                                    title={user_uuid}>for {user_name}</div> : <div>{user_uuid}</div>
            }
            </Link>


            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">


                    <NavLinks/>



                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block">
                    <AuthButton/>
                </div>


            </div>
        </div>
    );
}
