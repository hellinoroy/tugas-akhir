import { UserIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <header className="flex flex-row pl-5 mr-auto bg-gray-900 h-[4rem]">

      <div className="flex flex-row ml-auto mr-20 items-center text-white gap-5">
        <UserIcon className="text-3xl" />
        <p className="text-xl">Ryo Marchellino</p>
      </div>
    </header>
  );
}