
export default function Jumbotron() {
    return (
        <section className="relative flex justify-center items-center h-[85vh] overflow-hidden">
            <div className="absolute opacity-50 inset-0">
                <img 
                    src="images/jp-valery-unsplash-bedroom-night.jpg" 
                    alt="Bedroom" 
                    className="w-full h-full object-cover" 
                />
            </div>
            
            <div className="relative text-white text-center flex flex-col items-center gap-2">
                <h1 className="font-bold text-6xl">SleepWell</h1>
                <h4 className="text-gray-400 text-2xl my-4">Transform your sleep, transform your life.</h4>
                <div className="flex flex-row gap-5">
                <button className="cursor-pointer rounded-xl bg-gray-700 py-3 px-8 mt-4 self-center w-40">
                    {/* Link to login page */}
                    Login
                </button>
                <button className="cursor-pointer rounded-xl bg-purple-950 py-3 px-8 mt-4 self-center w-40">
                    {/* Link to Whats SleepWell */}
                    Learn More
                </button>
                </div>

            </div>
        </section>

    )
}