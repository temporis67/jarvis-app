'use client';

import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,
    ChatBubbleBottomCenterTextIcon,
    Cog8ToothIcon,

} from '@heroicons/react/24/outline';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';
import {signIn, signOut, useSession} from "next-auth/react";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [

    {name: 'Fragen', href: '/pages/questions', icon: ChatBubbleBottomCenterTextIcon},
    {name: 'Models', href: '/pages/settings', icon: Cog8ToothIcon},


];

export default function NavLinks() {

    const pathname = usePathname();
    const {status} = useSession();


    if (status === 'authenticated') {
        return (
            <div className=' text-gray-400'>
                {links.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'mt-1 flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-500 md:flex-none md:justify-start md:p-2 md:px-3',
                                {
                                    'bg-gray-500 text-gray-200': pathname === link.href,
                                    'bg-gray-700 text-gray-400': pathname !== link.href,
                                },
                            )}
                        >
                            <LinkIcon className="w-6"/>
                            <p className="hidden md:block">{link.name}</p>
                        </Link>
                    );
                })}
            </div>
        );
    } else {
        return (<></>)
    }
}
