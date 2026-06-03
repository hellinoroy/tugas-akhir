import { MoonIcon } from "@heroicons/react/24/outline"

export default function Footer() {
    return (
      <footer className="bg-slate-950 py-12 px-6 text-center mt-auto">
        <MoonIcon className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
        <p className="text-indigo-300 mb-2">SleepWell - Your Sleep Wellness Partner</p>
        <p className="text-indigo-400 text-sm">© 2026 All rights reserved</p>
      </footer>
    )
}