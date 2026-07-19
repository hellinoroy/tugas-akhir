// TODO: add guard
import { useContext, useState } from "react";
import { UserContext } from "~/context/user-context";

export default function DashboardAssessment() {
    const { age, genderValue } = useContext(UserContext)!;
    const [bedtime, setBedtime] = useState("");
    const [wakeup, setWakeup] = useState("");
    const [awakenings, setAwakenings] = useState(0);
    const [timeInBed, setTimeInBed]= useState(0);

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



    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const sleepEfficiency = sleepDuration / timeInBed;
        const isGoodSleep =
            (age >= 18 &&
                age < 65 &&
                [7, 8, 9].includes(Math.round(sleepDuration)) &&
                awakenings <= 1 &&
                sleepEfficiency >= 0.875) ||

            (age >= 65 &&
                [7, 8].includes(Math.round(sleepDuration)) &&
                awakenings <= 2 &&
                sleepEfficiency >= 87.5);
    };


    return (
        <div className="flex flex-row h-full justify-center items-center gap-10">

            <form 
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-xl space-y-6"
                onSubmit={handleSubmit}
            >
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Sleep Quality Assessment
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Complete the form below to manually assess your sleep quality.
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
                            onChange={(e) => setWakeup(e.target.value)}
                            value={wakeup}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>


                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Sleep Duration
                    </label>

                    <input
                        disabled={true}
                        type="text"
                        value={`${String(sleepDurationHour).padStart(2, "0")}:${String(sleepDurationMinute).padStart(2, "0")}`}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>



                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Number of Awakenings
                    </label>

                    <input
                        type="number"
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
                        step="0.1"
                        onChange={(e) => setTimeInBed(parseInt(e.target.value))}
                        value={timeInBed}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                    Assess Sleep Quality
                </button>

            </form>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl h-fit">

                <h3 className="text-xl font-bold text-gray-800">
                    Assessment Result
                </h3>







                {/* 
                <div className="mt-8 flex justify-center">
                    <div
                        className={`flex h-40 w-40 items-center justify-center rounded-full border-4 ${
                            isGoodSleep
                                ? "border-green-500"
                                : "border-red-500"
                        }`}
                    >
                        <div className="text-center">
                            <div className="text-5xl">
                                {isGoodSleep ? "😊" : "😴"}
                            </div>

                            <p
                                className={`mt-3 text-3xl font-bold ${
                                    isGoodSleep
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {isGoodSleep ? "GOOD" : "POOR"}
                            </p>

                            <p className="text-sm text-gray-500">
                                Sleep Quality
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className={`mt-6 rounded-xl p-4 ${
                        isGoodSleep
                            ? "bg-green-50"
                            : "bg-red-50"
                    }`}
                >
                    <p
                        className={`font-semibold ${
                            isGoodSleep
                                ? "text-green-700"
                                : "text-red-700"
                        }`}
                    >
                        {isGoodSleep
                            ? "Your sleep meets the recommended criteria."
                            : "Your sleep quality needs improvement."}
                    </p>
                </div> */}

                <div className="my-5 w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
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