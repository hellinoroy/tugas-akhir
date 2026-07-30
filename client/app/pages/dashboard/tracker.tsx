// add guard
// add fetch for current day, and tell assess again tomorrow
// editable history 
import { useContext, useEffect, useState } from "react";
import { UserContext } from "~/context/user-context";
import { api } from "~/root";
import TrackerCard from "~/components/dashboard/home/tracker-card";
import WeeklyTracker from "~/components/dashboard/home/weekly-tracker";
import type { Tracker, TrackerAPI } from "~/components/dashboard/home/tracker-card";

export default function DashboardAssessment() {
    const [historyData, setHistoryData] = useState<TrackerAPI>();
    
    const { age } = useContext(UserContext)!;
    const [bedtime, setBedtime] = useState("");
    const [wakeup, setWakeup] = useState("");
    const [awakenings, setAwakenings] = useState(0);
    const [timeInBed, setTimeInBed]= useState(0);
    const [assessed, setAssessed] = useState(false);
    const [loading, setLoading] = useState(true);

    let sleepDuration: number = 0;
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


    const trackerData: Tracker = {
        bedtime,
        wakeup,
        sleepDuration,
        sleepEfficiency,
        awakenings,
        timeInBed,
        isGoodSleep,
    };


    useEffect(() => {
        setLoading(true);
        const fetchToday = async () => {
            try {
                const response = await api.get("/sleep/check-today-tracker");
                const data = response.data
                if(data) {
                    setBedtime(data.bedtime);
                    setWakeup(data.wakeup);
                    setAwakenings(data.awakenings);
                    setTimeInBed(data.timeInBed);
                    setAssessed(true);
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }

        }

        const fetchWeekly = async () => {
            try {
                const today = new Date();

                const endDate = new Date(today);
                endDate.setDate(today.getDate() - 1); // yesterday

                const startDate = new Date(today);
                startDate.setDate(today.getDate() - 7); // 7 days ago

                const response = await api.get("/sleep/tracker", {
                    params: {
                        start_date: startDate.toISOString().split("T")[0],
                        end_date: endDate.toISOString().split("T")[0],
                    },
                });

                if (response) {
                    console.log(response.data);
                    setHistoryData(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchToday();
        fetchWeekly();

    }, [])

    if(loading){
        return(
            <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"></div>
            </div>
        )
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (bedtime && wakeup && (timeInBed >= sleepDuration)) {
            const payload = {
                wakeup, bedtime, sleepDuration, sleepEfficiency, awakenings, timeInBed, isGoodSleep
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
        <div className="flex flex-col items-center overflow-scroll">
            <div className="flex flex-row h-full justify-center items-center gap-10 my-20">
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

                {assessed ? (
                    <TrackerCard data={trackerData}/>
                ) : (
                    <TrackerCard data={undefined} />
                )}
                
            </div>
            <WeeklyTracker />
        </div>

    );
}