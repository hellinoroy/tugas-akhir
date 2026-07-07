import { NavLink  } from "react-router";
import { UserIcon } from "@heroicons/react/24/outline";

export default function Sidebar() {
  return (
    <aside className="h-[calc(100vh-5rem)] w-60 bg-teal-100 shrink-0">
      <nav className="flex flex-col h-full items-center pt-6 text-lg ">
        <NavLink
          to="/antrian-pasien"
          className={({ isActive }) => (
            `h-14 w-full leading-[3.5rem] border-l-4 border-l-4
            ${isActive ? "border-amber-600" : ""}`)
          }
        >
          <UserIcon
            className="px-2 text-xl"
          />
          Antrian Pasien
        </NavLink>

        <NavLink
          to="/antrian-pasien"
          className={({ isActive }) => (
            `h-14 w-full leading-[3.5rem] border-l-4 border-l-4
            ${isActive ? "border-amber-600" : ""}`)
          }
        >
          <UserIcon
            className="px-2 text-xl"
          />
          Antrian Pasien
        </NavLink>

        <NavLink
          to="/antrian-pasien"
          className={({ isActive }) => (
            `h-14 w-full leading-[3.5rem] border-l-4 border-l-4
            ${isActive ? "border-amber-600" : ""}`)
          }
        >
          <UserIcon
            className="px-2 text-xl"
          />
          Antrian Pasien
        </NavLink>

        <NavLink
          to="/antrian-pasien"
          className={({ isActive }) => (
            `h-14 w-full leading-[3.5rem] border-l-4 border-l-4
            ${isActive ? "border-amber-600" : ""}`)
          }
        >
          <UserIcon
            className="px-2 text-xl"
          />
          Antrian Pasien
        </NavLink>

        <a
          href="#"
          className="h-14 w-full mt-auto leading-[3.5rem] bg-red-600 text-white border-l-[2px] border-red-600"
        >
          Logout
        </a>
      </nav>
    </aside>
  );
}