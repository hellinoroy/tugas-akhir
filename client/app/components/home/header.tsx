import { MoonIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router"


export default function HomepageHeader() {
    return (
            <div 
                className="
                    flex flex-col sm:flex-row
                    items-center sm:justify-between
                    gap-2 sm:gap-0
                    mx-4 sm:mx-20 py-4
                "
            >
                <div className="flex flex-row items-center gap-2">
                    <MoonIcon className="size-8 text-black"/>
                    <h1 className="font-bold text-2xl">NightTrack</h1>
                </div>
                
                <div className="flex flex-row gap-5">
                    <Link className="
                            cursor-pointer rounded border border-black
                            py-3 px-4 text-center w-30
                        " 
                        to="/login"
                    >
                        Sign In
                    </Link>
                    <Link 
                        className="
                            cursor-pointer rounded border border-black
                            py-3 px-4 text-center w-30
                            bg-amber-300
                        " 
                        to="/register"
                    >
                        Sign up
                    </Link>
                 
                </div>
            </div>
    )
}