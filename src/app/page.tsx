import {getServerSession} from "next-auth";
import {lusitana} from "@/app/lib/fonts";
export default async function Home() {
    const session = await getServerSession();

    return (
            <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Jarvis - your Central Scrutunizer
      </h1>
        {
            <h4>

              {session?.user?.name ? (
                  <span>Hallo {session?.user?.name}!</span>
              ) : (
                <span>Bitte loggen Sie sich ein.</span>
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
