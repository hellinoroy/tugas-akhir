import { SunIcon } from "@heroicons/react/24/outline"

export default function BetterDays() {
    return (
        <section className="py-10 flex flex-col justify-center items-center">
            <div className="bg-gradient-to-br from-gray-300 to-gray-700 rounded-3xl p-12 mx-10 shadow-2xl max-w-4xl text-center text-white flex flex-col gap-2">
                <SunIcon className="w-16 h-16 text-yellow-300 mx-auto mb-6"/>
                <h2 className="font-bold text-4xl">Wake Up to Better Days</h2>
                <h5 className="text-lg md:text-xl">Start tracking your sleep today and discover patterns that will help you sleep better tommorow</h5>

                <button className="cursor-pointer rounded-xl bg-gray-700 py-3 px-8 mt-4 self-center w-40">
                    {/* Link to login page */}
                    Login
                </button>
            </div>
        </section>
    )
}