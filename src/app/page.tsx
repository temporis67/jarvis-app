import {getServerSession} from "next-auth";
import {lusitana} from "@/app/lib/fonts";
import styles from '@/app/ui/home.module.css';


export default async function Home() {
    const session = await getServerSession();

    return (
            <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Home /app
      </h1>
        {
            <h4>{ 'Hallo '}

              {session?.user?.name ? (
                <span>{session?.user?.name}</span>
              ) : (
                <span>Not logged in</span>
              )}

            </h4>
        }
            </main>


        /*

            <>





            </>
        */
    );
}
