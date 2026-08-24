import { ArrowTurnLeftUpIcon, UserIcon, Bars3Icon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { UserContext } from "~/context/user-context";


interface HeaderProps {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
    menuOpen,
    setMenuOpen,
}: HeaderProps) {
    const { name } = useContext(UserContext)!;
    const [isOpen, setIsOpen] = useState(false);
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

            <div
                tabIndex={0}
                className="
                    relative ml-auto mr-8 flex flex-row
                    items-center gap-5 text-white sm:mr-20
                    cursor-pointer px-4
                "
                onClick={() => setIsOpen((prev) => !prev)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsOpen(false);
                    }
                }}
            >
                <UserIcon className="size-6" />
                <p className="text-xl">{name}</p>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-zinc-800 p-4 shadow-lg">
                        <ul>
                            <li>
                                <Link
                                    to="/dashboard/edit-profile"
                                    className="flex flex-row gap-2"
                                >
                                    <WrenchScrewdriverIcon className="size-6" />
                                    <p className="text-sm text-white">Edit Profile</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}