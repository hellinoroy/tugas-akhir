import { MoonIcon } from "@heroicons/react/24/outline"

export default function Footer() {
    return (
      <footer className=" py-12 px-6 text-center mt-auto">
        <MoonIcon className="w-10 h-10  mx-auto mb-4" />
        <p className="mb-2">SleepWell - Your Sleep Wellness Partner</p>
        <p className=" text-sm">© 2026 All rights reserved</p>
      </footer>
    )
}