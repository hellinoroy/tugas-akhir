// TODO: add guard
// TODO: add fetch for current day, and tell assess again tomorrow
import { useContext, useEffect, useState } from "react";
import { UserContext } from "~/context/user-context";
import { api } from "~/root";

export default function DashboardAssessment() {
    const { age } = useContext(UserContext)!;
    const [bedtime, setBedtime] = useState("");
    const [wakeup, setWakeup] = useState("");
    const [awakenings, setAwakenings] = useState(0);
    const [timeInBed, setTimeInBed]= useState(0);
    const [assessed, setAssessed] = useState(false);

    let sleepDuration: number = 0;
    let sleepDurationHour: number = 0;
    let sleepDurationMinute: number = 0;
    if(bedtime && wakeup) {
        const [startHour, startMinute] = bedtime.split(":").map(Number);
        const [endHour, endMinute] = wakeup.split(":").map(Number);
        const start = startHour * 60 + startMinute;
        let end = endHour * 60 + endMinute;

        let diff = end - start;
        
        if (diff < 0) {
            end += 24 * 60;
            diff = end - start;
        }

        sleepDuration = (diff / 60);
        sleepDurationHour = Math.floor(sleepDuration);
        sleepDurationMinute = Math.round((sleepDuration - sleepDurationHour) * 60);
    }

    const sleepEfficiency = sleepDuration / timeInBed;

    const isGoodSleep =
        (age >= 18 &&
            age < 65 &&
            sleepDuration >= 7 &&
            sleepDuration <= 9 &&
            awakenings <= 1 &&
            sleepEfficiency >= 0.875) ||

        (age >= 65 &&
            sleepDuration >= 7 &&
            sleepDuration <= 8 &&
            awakenings <= 2 &&
            sleepEfficiency >= 0.875);

    useEffect(() => {
        const fetchToday = async () => {
            const response = await api.get("/sleep/check-today-tracker");
            const data = response.data
            if(data) {
                setBedtime(data.bedtime);
                setWakeup(data.wakeup);
                setAwakenings(data.awakenings);
                setTimeInBed(data.timeInBed);
                setAssessed(true);
            }
        }
        fetchToday();
    }, [])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (bedtime && wakeup && (timeInBed >= sleepDuration)) {
            const payload = {
                wakeup, bedtime, awakenings, timeInBed, isGoodSleep
            };
            
            const response = await api.post("/sleep/tracker", payload);
            console.log(response);

            setAssessed(true);
        } else {
            console.log(bedtime);
            console.log(wakeup);
            console.log(timeInBed);
            console.log(sleepDuration);
            console.log(timeInBed >= sleepDuration);
            console.log("fill out bud");
        }
    };


    return (
        <div className="flex flex-row h-full justify-center items-center gap-10">
            <form 
                className="w-full max-w-md  flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-xl space-y-6"
                onSubmit={handleSubmit}
            >
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Sleep Tracker
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 text-center">
                        Track your sleep and assess your sleep quality.
                    </p>
                </div>

                <hr className="border-gray-100" />

                <div className="flex justify-evenly flex-row gap-5 ">

                    <div className="flex flex-col flex-1 space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Bedtime
                        </label>

                        <input
                            type="time"
                            disabled={assessed}
                            onChange={(e) => setBedtime(e.target.value)}
                            value={bedtime}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div className="flex flex-col flex-1 space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Wake-up Time
                        </label>

                        <input
                            type="time"
                            disabled={assessed}
                            onChange={(e) => setWakeup(e.target.value)}
                            value={wakeup}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Number of Awakenings
                    </label>

                    <input
                        type="number"
                        disabled={assessed}
                        onChange={(e) => setAwakenings(parseInt(e.target.value))}
                        value={awakenings}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Total Time in Bed (hours)
                    </label>

                    <input
                        type="number"
                        disabled={assessed}
                        min={0}
                        step={0.5}
                        onChange={(e) => setTimeInBed(parseFloat(e.target.value))}
                        value={timeInBed}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <button
                    type="submit"
                    disabled={assessed}
                    className={`w-full rounded-lg py-3 font-semibold text-white transition-colors ${
                        assessed
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    Assess Sleep Quality
                </button>

            </form>

            <div className="flex flex-col">
 
                <div className="w-[430px] my-5 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm flex flex-col ">

                    {assessed && (
                        <>
                            <div
                                className={`rounded-xl border p-5 ${
                                    isGoodSleep
                                        ? "border-green-200 bg-green-50"
                                        : "border-red-200 bg-red-50"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl ${
                                            isGoodSleep
                                                ? "bg-green-100"
                                                : "bg-red-100"
                                        }`}
                                    >
                                        {isGoodSleep ? "😊" : "😴"}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Assessment Result
                                        </h3>

                                        <p
                                            className={`mt-1 font-bold ${
                                                isGoodSleep
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                                            {isGoodSleep ? "Good Sleep Quality" : "Poor Sleep Quality"}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {isGoodSleep
                                                ? "Your sleep meets the recommended criteria."
                                                : "Your sleep quality needs improvement."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                           <p className="mt-6 font-medium text-gray-800">
                                Your Sleep Result
                            </p>

                            <div className="mt-3 text-sm text-gray-600">
                                <div>
                                    <p className="font-medium text-gray-700">
                                        Recorded Values
                                    </p>

                                    <ul className="mt-1 list-disc space-y-1 pl-5">
                                        <li>
                                            Sleep duration: <strong>{sleepDurationHour} hours {sleepDurationMinute} minutes</strong> 
                                        </li>
                                        <li>
                                            Awakenings: <strong>{awakenings}</strong>
                                        </li>
                                        <li>
                                            Sleep efficiency: <strong>{(sleepEfficiency * 100).toFixed(2)}%</strong>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}

                    {assessed && <hr className="my-6 border-gray-200" />}


                    <p className="font-medium text-gray-800">
                        Good Sleep Quality Criteria
                    </p>

                    <div className="mt-3 space-y-4 text-sm text-gray-600">

                        <div>
                            <p className="font-medium text-gray-700">
                                Adults (18–64 years)
                            </p>

                            <ul className="mt-1 list-disc space-y-1 pl-5">
                                <li>Sleep duration: <strong>7–9 hours</strong></li>
                                <li>Awakenings: <strong>1 or fewer</strong></li>
                                <li>Sleep efficiency: <strong>87.5% or higher</strong></li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-medium text-gray-700">
                                Older Adults (65+ years)
                            </p>

                            <ul className="mt-1 list-disc space-y-1 pl-5">
                                <li>Sleep duration: <strong>7–8 hours</strong></li>
                                <li>Awakenings: <strong>2 or fewer</strong></li>
                                <li>Sleep efficiency: <strong>87.5% or higher</strong></li>
                            </ul>
                        </div>

                    </div>

                    <div className="mt-4 border-t border-gray-200 pt-3">
                        <p className="text-xs text-gray-500">
                            Sleep Efficiency = (Time Asleep ÷ Time in Bed) × 100
                        </p>
                    </div>
                    
                </div>

            </div>


 

        </div>
    );
}