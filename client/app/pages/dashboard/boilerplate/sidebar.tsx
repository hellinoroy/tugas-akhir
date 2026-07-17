import { NavLink, useNavigate } from "react-router";
import { ClipboardDocumentListIcon, ClipboardDocumentCheckIcon, ChartPieIcon, PowerIcon } from "@heroicons/react/24/outline";
import { api } from "~/root";


export default function Sidebar() {
    const navigate = useNavigate(); 

    const handleLogout = async () => {
        localStorage.removeItem('access_token');
        const response = await api.post("/auth/logout");
        
        navigate('/')
    }


    return (
        <aside className="h-[calc(100vh-4rem)] w-64 bg-teal-100 shrink-0">
            <nav className="flex flex-col h-full items-center pt-6">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) => (
                        `h-14 w-full leading-[3.5rem] border-l-4 flex flex-row items-center
                            ${isActive ? "border-amber-600" : ""}`)
                    }
                >
                    <ChartPieIcon className="px-2 text-sm size-12" />
                    Home
                </NavLink>
                
                <NavLink
                    to="/dashboard/assess"
                    className={({ isActive }) => (
                        `h-14 w-full leading-[3.5rem] border-l-4 flex flex-row items-center
                            ${isActive ? "border-amber-600" : ""}`)
                    }
                >
                    <ClipboardDocumentListIcon className="px-2 text-sm size-12" />
                    Sleep Quality Assesment
                </NavLink>

                <NavLink
                    to="/dashboard/predict"
                    className={({ isActive }) => (
                        `h-14 w-full leading-[3.5rem] border-l-4 flex flex-row items-center
                            ${isActive ? "border-amber-600" : ""}`)
                    }
                >
                    <ClipboardDocumentCheckIcon className="px-2 text-sm size-12" />
                    Sleep Quality Prediction
                </NavLink>


                {/* <NavLink
                    to="/dashboard/assess"
                    className={({ isActive }) => (
                        `h-14 w-full leading-[3.5rem] border-l-4 flex flex-row items-center
                            ${isActive ? "border-amber-600" : ""}`)
                    }
                >
                    <ClipboardDocumentCheckIcon className="px-2 text-sm size-12" />
                    History
                </NavLink> */}
                
                <a
                    onClick={handleLogout}
                    href="#"
                    className="h-14 w-full mt-auto leading-[3.5rem] bg-red-600 text-white border-l-[2px] border-red-600 flex flex-row items-center font-bold text-xl"
                >
                    <PowerIcon className="px-2 text-sm size-12" />
                    Logout
                </a>
            </nav>
        </aside>
    );
}