import { NavLink, useNavigate } from "react-router";
import { 
    ClipboardDocumentListIcon, ClipboardDocumentCheckIcon, 
    ChartPieIcon, PowerIcon, 
    Bars3Icon, ArrowLeftIcon, 
} from "@heroicons/react/24/outline";
import { api } from "~/root";
import { useState } from "react";

// TODO: show icons when collapsed instead of dissapearing 
interface SidebarProps {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
    menuOpen,
    setMenuOpen,
}: SidebarProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.removeItem("access_token");
        await api.post("/auth/logout");

        navigate("/");
    };

    return (
        <div
            className={`
                absolute top-16 left-0 z-auto
                bg-teal-100 w-full
                transition-all duration-300
                ${menuOpen ? "h-[224px]" : "h-0"}

                sm:relative
                sm:top-auto sm:left-auto
                sm:h-[calc(100vh-4rem)]
                ${menuOpen ? "sm:w-64" : "sm:w-[56px]"}
            `}
        >
            <button
                className="hidden sm:flex self-end cursor-pointer p-4"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? (
                    <ArrowLeftIcon className="size-6 hidden sm:block" />
                ) : (
                    <Bars3Icon className="size-6 hidden sm:block" />
                )}

     
            </button>

            <nav
                className={`
                    flex flex-col h-full items-center
                    transition-opacity duration-300
                    ${
                        menuOpen
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
                    className="
                        h-14 w-full mt-auto leading-[3.5rem] 
                        bg-red-600 text-white border-l-[2px] 
                        border-red-600 flex flex-row items-center font-bold text-xl
                    "
                >
                    <PowerIcon className="px-2 text-sm size-12" />
                    Logout
                </a>

            </nav>
        </div>
    );
}