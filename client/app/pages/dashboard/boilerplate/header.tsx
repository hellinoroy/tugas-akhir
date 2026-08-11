import { ArrowTurnLeftUpIcon, UserIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { UserContext } from "~/context/user-context";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface HeaderProps {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
    menuOpen,
    setMenuOpen,
}: HeaderProps) {
    const { name } = useContext(UserContext)!;
    return (
        <header className="flex h-[4rem] flex-row bg-gray-900">
            <button
                className="ml-4 cursor-pointer text-white sm:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? (
                    <ArrowTurnLeftUpIcon className="size-6 sm:hidden" />
                ) : (
                    <Bars3Icon className="size-6 sm:hidden" />
                )}
            </button>

            <div className="ml-auto mr-8 flex flex-row items-center gap-5 text-white sm:mr-20">
                <UserIcon className="text-3xl" />
                <p className="text-xl">{name}</p>
            </div>
        </header>
    );
}