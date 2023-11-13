import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"
import {z} from 'zod';
import type {User} from '@/app/lib/definitions';

async function getUser(name: string, password: string): Promise<Response> {
    try {
        const api_host = process.env.JARVIS_API_HOST;
        const api_url = (api_host + "/user");

        let formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);


        const response = await fetch(api_url, {
            method: "POST",
            body: formData,
            mode: 'cors',

        })
        // const data: User = await response.json()
        // console.log("API fetched User: " + data['name'] + " ## " + data['email'])

        return response;

        /*
                console.log("API fetched User: " + data['name'] + " ## " + JSON.stringify(response))
                logResponseData(data)

                for (const key in data) {
                    console.log("2");
                    if (data.hasOwnProperty(key)) {
                        console.log(`${key}: ${data[key]}`);
                    }
                }


        */


    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }

}


export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),

        // my Credentials provider
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {label: "Username", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)

                console.log("credentials: " + JSON.stringify(credentials))
                //@ts-ignore
                const res = await getUser(credentials.username, credentials.password);
                const user = await res.json()
                console.log("user: " + JSON.stringify(user))


                // If no error and we have user data, return it
                if (res.ok && user) { //
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })


    ],
};

export const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
