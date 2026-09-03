import { MoonIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router"

export default function     Jumbotron() {
    return (
        <section className="flex h-[85vh]">          
            <div 
                className="
                    flex flex-row mx-20 gap-10 items-center
                    lg:gap-40 xl:mx-30 2xl:mx-70
                "
            >
                <div className="flex flex-col gap-5 justify-center">
                    <h1 className="text-center font-bold text-5xl">Sleep better. Wake up better.</h1>
                    <p className="text-xl text-slate-600 text-justify">
                        Track your sleep, understand your habits, and discover what helps you rest at your best. Get simple insights into your sleep patterns so you can build healthier routines and wake up feeling refreshed.
                    </p>
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