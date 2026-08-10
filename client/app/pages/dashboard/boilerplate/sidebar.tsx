import { NavLink, useNavigate } from "react-router";
import { ClipboardDocumentListIcon, ClipboardDocumentCheckIcon, ChartPieIcon, PowerIcon, Bars3Icon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { api } from "~/root";
import { useState } from "react";

// TODO: show icons when collapsed instead of dissapearing 

export default function Sidebar() {
    const [menuOpen, setMenuOpen] = useState(true);
    const navigate = useNavigate(); 

    const handleLogout = async () => {
        localStorage.removeItem('access_token');
        await api.post("/auth/logout");
        
        navigate('/')
    }


    return (
        <aside 
            className={`
                h-[calc(100vh-4rem)] bg-teal-100 shrink-0 flex flex-col 
            
                transition-all duration-300
                ${menuOpen ? "w-64" : "w-[56px]"}`
            }
        >
            <button
                className="self-end cursor-pointer p-4"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <ArrowLeftIcon className="size-6" /> : <Bars3Icon className="size-6" />}
                
            </button>

            <nav 
                className={`
                    flex flex-col h-full items-center
                    transition-opacity duration-300
                    ${menuOpen
                        ? "opacity-100 visible delay-150"
                        : "opacity-0 invisible"
                    }
                `}
            >

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
                    to="/dashboard/tracker"
                    className={({ isActive }) => (
                        `h-14 w-full leading-[3.5rem] border-l-4 flex flex-row items-center
                            ${isActive ? "border-amber-600" : ""}`)
                    }
                >
                    <ClipboardDocumentListIcon className="px-2 text-sm size-12" />
                        Sleep Tracker
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