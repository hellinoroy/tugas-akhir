import { SunIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router"

export default function BetterDays() {
    return (
        <section className="py-10 flex flex-col justify-center items-center">
            <div className="bg-stone-100 rounded-3xl p-12 mx-10 shadow-md max-w-4xl text-center flex flex-col items-center gap-4">
                <SunIcon className="w-16 h-16 text-yellow-400"/>
                <div className="flex flex-col">
                    <h2 className="font-bold text-4xl">Wake Up to Better Days</h2>
                    <h5 className="text-lg md:text-xl text-slate-600">Start tracking your sleep today and discover patterns that will help you sleep better tommorow</h5>
                </div>
       

                <Link className="
                        cursor-pointer rounded border border-black
                        py-3 px-4 text-center w-30
                    " 
                    to="/login"
                >
                    Sign In
                </Link>
            </div>
        </section>
    )
}