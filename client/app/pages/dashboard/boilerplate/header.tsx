import { UserIcon } from "@heroicons/react/24/outline";
import type { clientLoader } from "./root";
import { useLoaderData } from "react-router";


export default function Header() {
    const { name } = useLoaderData<typeof clientLoader>();
  
    return (
        <header className="flex flex-row pl-5  bg-gray-900 h-[4rem]">
            <div className="flex flex-row ml-auto mr-20 items-center text-white gap-5">
                <UserIcon className="text-3xl" />
                <p className="text-xl">{name}</p>
            </div>
        </header>
    );
}