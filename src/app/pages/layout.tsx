import SideNav from "../components/SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {

        const is_client = typeof window !== "undefined";
        console.log("app/pages/layout.tsx is_client: " + is_client);


        return (

                <div className="flex flex-col md:flex-row">
                        <div className="w-full flex-none md:w-52">
                                <SideNav />
                        </div>
                        {/*This is the main content area */}
                        <div className="flex-grow p-6 overflow-auto md:p-12">                            
                                {children}
                        </div>
                </div>


        );
}