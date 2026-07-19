import { UserIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { UserContext } from "~/context/user-context";


export default function Header() {
    const { name } = useContext(UserContext)!;
  
    return (
        <header className="flex flex-row pl-5  bg-gray-900 h-[4rem]">
            <div className="flex flex-row ml-auto mr-20 items-center text-white gap-5">
                <UserIcon className="text-3xl" />
                <p className="text-xl">{name}</p>
            </div>
        </header>
    );
}