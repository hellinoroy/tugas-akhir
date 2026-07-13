import { NavLink, useNavigate } from "react-router";
import { PencilSquareIcon, ChartPieIcon, PowerIcon } from "@heroicons/react/24/outline";


export default function Sidebar() {
    const navigate = useNavigate(); 

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate('/')
    }


    return (
        <aside className="h-[calc(100vh-4rem)] w-60 bg-teal-100 shrink-0">
            <nav className="flex flex-col h-full items-center pt-6 ">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) => (
                        `h-14 w-full leading-[3.5rem] border-l-4 flex flex-row items-center
                            ${isActive ? "border-amber-600" : ""}`)
                    }
                >
                    <ChartPieIcon className="px-2 text-sm size-12" />
                    Statistik Tidur
                </NavLink>
                
                <NavLink
                    to="/dashboard/predict"
                    className={({ isActive }) => (
                        `h-14 w-full leading-[3.5rem] border-l-4 flex flex-row items-center
                            ${isActive ? "border-amber-600" : ""}`)
                    }
                >
                    <PencilSquareIcon className="px-2 text-sm size-12" />
                    Prediksi Kualitas Tidur
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