import SideNav from "../components/SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {




        return (

                <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                        <div className="w-full flex-none md:w-52">
                                <SideNav />
                        </div>
                        {/*This is the main content area */}
                        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">                            
                                {children}
                        </div>
                </div>


        );
}