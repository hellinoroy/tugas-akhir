import { ChevronDownIcon } from "@heroicons/react/24/outline";  

export default function Jumbotron() {
    return (
        <section className="flex min-h-screen">          
            <div 
                className="
                    flex flex-row mx-2 sm:mx-20 gap-10 items-center
                    lg:gap-40 xl:mx-30 2xl:mx-50
                "
            >
                <div className="flex flex-col gap-10 justify-center items-center">
                    <h1 className="text-center font-bold text-5xl">Sleep better. Wake up better.</h1>
                    <p className="text-xl text-slate-600 text-justify">
                        Track your sleep, understand your habits, and discover what helps you rest at your best. Get simple insights into your sleep patterns so you can build healthier routines and wake up feeling refreshed.
                    </p>

                    <a
                    href="#learn-more"
                    className="group inline-flex items-center gap-2 text-md font-medium transition-colors hover:text-gray-500"
                    >
                    <span>Learn More</span>

                    <ChevronDownIcon
                        className="size-4 animate-bounce transition-transform group-hover:translate-y-1"
                    />
                    </a>
                </div>
                
                <img 
                    className="
                        w-[400px] h-[180px]
                        xl:w-[600px] xl:h-[270px]
                        hidden lg:inline
                    "   
                    src="images/sleep-illus-Photoroom.png" 
                    alt="Sleeping Illustration"   
                />
            </div>
        </section>  

    )
}