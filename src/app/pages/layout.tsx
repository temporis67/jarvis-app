import SideNav from "../components/SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {




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