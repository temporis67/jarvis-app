import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth";

async function getUser(name: string, password: string): Promise<Response> {

    try {
        const api_host = process.env.NEXT_PUBLIC_JARVIS_API_HOST;
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

    } catch (error) {
        console.error('API Host down? - Failed to fetch user in /app/api/auth.../route.ts/getUser() :', error);
        throw new Error('Failed to fetch user.');
    }

}


export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID ?? "",
        //     clientSecret: process.env.GITHUB_SECRET ?? "",
        // }),

        // my Credentials provider
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {label: "Username", type: "text", placeholder: "Choose a username"},
                password: {label: "Password", type: "password" },
                // email: {label: "Email", type: "email" },
                // uuid: {label: "UUID", type: "hidden" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)

                // console.log("credentials: " + JSON.stringify(credentials))
                // @ts-ignore
                const res = await getUser(credentials.username, credentials.password); // credentials.email
                const user = await res.json()


                // If no error and we have user data, return it
                if (res.ok && user) { //

                    console.log("** user authorized: ", JSON.stringify(user), " ## ", JSON.stringify(user.uuid))
                    return user
                }
                // Return null if user data could not be retrieved
                console.log("user not authorized.")
                return null
            }
        })
    ], // end of providers
};
