import { UserContext } from "~/context/user-context";
import { useContext, useEffect, useState } from "react";
import { api } from "~/root";

export default function Tracker() {
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



    return (
        <>
            {assessed ? (
                <div className="flex flex-col h-[290px] w-[400px] rounded-xl border border-gray-200 bg-white shadow-sm p-5">
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
                                    Today's Assessment Result
                                </h3>

                                <p
                                    className={`mt-1 font-bold ${
                                        isGoodSleep
                                            ? "text-green-700"
                                            : "text-red-700"
                                    }`}
                                >
                                    {isGoodSleep
                                        ? "Good Sleep Quality"
                                        : "Poor Sleep Quality"}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    {isGoodSleep
                                        ? "Your sleep meets the recommended criteria."
                                        : "Your sleep quality needs improvement."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                        <div>
                            <p className="font-medium text-gray-700">
                                Recorded Values
                            </p>

                            <ul className="mt-1 list-disc space-y-1 pl-5">
                                <li>
                                    Sleep duration:{" "}
                                    <strong>
                                        {sleepDurationHour} hours {sleepDurationMinute} minutes
                                    </strong>
                                </li>
                                <li>
                                    Awakenings: <strong>{awakenings}</strong>
                                </li>
                                <li>
                                    Sleep efficiency:{" "}
                                    <strong>
                                        {(sleepEfficiency * 100).toFixed(2)}%
                                    </strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-[290px] w-[400px] rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col justify-center text-center">
                    <p className="font-medium text-gray-700">
                        No sleep assessment for today.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Complete today's sleep tracker to view your assessment.
                    </p>
                </div>
            )}
        </>
    );
}