"use client";
import Logo from '@/app/components/Logo';


export default function Page(request: any) {

    const api_host = process.env.NEXT_PUBLIC_JARVIS_API_HOST;

    const handleSignUp = async (event: any) => {
        console.log("handleSignUp Start");
        const api_url = (api_host + "/new_user");

        // @ts-ignore
        if (document.getElementById("user_email").value == "") {
            alert("Bitte geben Sie eine Email Adresse ein.");
            return;
        }

        // @ts-ignore
        if (document.getElementById("user_name").value == "") {
            alert("Bitte geben Sie einen Namen ein.");
            return;
        }

        // @ts-ignore
        if (document.getElementById("user_password").value == "") {
            alert("Bitte geben Sie ein Passwort ein.");
            return;
        }


        let formData = new FormData();
        // @ts-ignore
        formData.append("name", document.getElementById("user_name").value);
        // @ts-ignore
        formData.append("email", document.getElementById("user_email").value);
        // @ts-ignore
        formData.append("password", document.getElementById("user_password").value);



        let response = await fetch(api_url, {
            method: 'POST',
            body: formData
        });
        let data = await response.json();
        console.log(data);
        if (data["uuid"] != undefined && data["uuid"] != "") {
            window.location.href = "/api/auth/signin";
        }

    }

    return (

        <div className="flex w-full justify-center">

        <div className="max-w-sm flex flex-col pt-10 pr-10 pb-10 pl-10 bg-gray-600 shadow-2xl rounded-xl">
            <p className="w-full text-4xl font-medium text-center leading-snug">Registrieren Sie sich</p>

            <div className="w-full mt-6 mr-0 mb-0 ml-0  space-y-8">
                <div className="">
                    <p className="bg-gray-600 pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-300
                  ">Name</p>
                    <input placeholder="Max" id="user_name" type="text" className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-gray-600
                  border-gray-300 rounded-md"/>
                </div>
                <div className="">
                    <p className="bg-gray-600 pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-300 
                 ">E-Mail</p>
                    <input id="user_email" placeholder="123@test.de" type="text" className="bg-gray-600 border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block 
                  border-gray-300 rounded-md"/>
                </div>
                <div className="">
                    <p className="bg-gray-600 pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-300
                  ">Passwort</p>
                    <input id="user_password" placeholder="Passwort" type="password" className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-gray-600
                  border-gray-300 rounded-md"/>
                </div>
                <div className="">
                    <a onClick={handleSignUp} className="w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-gray-300 bg-gray-800
                  rounded-lg transition duration-200 hover:bg-gray-600 ease border-gray-800 border-2">Senden</a>
                </div>
            </div>
        </div>

        </div>



    );

}