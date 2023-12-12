import { PowerIcon } from "@heroicons/react/24/outline";

// this is an empty react component that is shown when the user successfully registers
export default function Page(request: any) {
    return (
        <div className="flex w-full justify-center">

            <div className="max-w-sm flex flex-col pt-10 pr-10 pb-10 pl-10 bg-gray-600 shadow-2xl rounded-xl items-center ">
                <p className="w-full text-xl font-medium leading-snug text-center">Ihre Registrierung war erfolgreich.</p>
                <p></p>
                {/* Login Button */}
                <div className="mt-5 p-2 flex h-[32px] w-[120px] items-center justify-center rounded-md bg-gray-700 text-sm font-medium hover:bg-gray-500 md:justify-start">
                    <div className="mr-2">
                        <a href="/api/auth/signin">
                            <PowerIcon className="w-5" />
                        </a>
                    </div>
                    <div>
                        <a href="/api/auth/signin">Login</a>
                    </div>
                </div>
            </div>
        </div>
    )
}