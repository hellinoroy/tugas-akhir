// add guard
// add fetch for current day, and tell assess again tomorrow
// editable history 
import { useContext, useEffect, useState } from "react";
import { UserContext } from "~/context/user-context";
import { api } from "~/root";
import TrackerCard from "~/components/dashboard/home/tracker-card";
import WeeklyTracker from "~/components/dashboard/home/weekly-tracker";
import type { Tracker, TrackerAPI } from "~/components/dashboard/home/tracker-card";
import { toast } from "react-toastify";

export default function DashboardAssessment() {
    
    const { age } = useContext(UserContext)!;
    const [bedtime, setBedtime] = useState("");
    const [wakeup, setWakeup] = useState("");
    const [awakenings, setAwakenings] = useState(0);
    const [timeInBed, setTimeInBed]= useState(0);
    const [assessed, setAssessed] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [historyData, setHistoryData] = useState<TrackerAPI>();

    let sleepDuration: number = 0;
    if(bedtime && wakeup) {
        const start = new Date(bedtime).getTime();
        const end = new Date(wakeup).getTime();
        const diffMs = end - start;

        sleepDuration = diffMs / (1000 * 60 * 60);

    }

    const sleepEfficiency =
    timeInBed > 0
        ? sleepDuration / timeInBed
        : 0;

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
        id: null,
        bedtime,
        wakeup,
        sleepDuration,
        sleepEfficiency,
        awakenings,
        timeInBed,
        isGoodSleep,
        created_at: Date.now().toString(),
        updated_at: null,
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
                endDate.setDate(today.getDate() - 1); 

                const startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);

                const response = await api.get("/sleep/tracker", {
                    params: {
                        start_date: startDate.toISOString().split("T")[0],
                        end_date: endDate.toISOString().split("T")[0],
                    },
                });
                setHistoryData(response.data);
              
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
        if(sleepDuration < 0) {
            toast.error('Wakeup cannot be less than bedtime');
            return;
        }

        if(timeInBed <= sleepDuration) {
            toast.error('Total time in bed cannot be less than sleep duration');
            return;
        }

        if (bedtime && wakeup) {
            const payload = {
                wakeup, bedtime, sleepDuration, sleepEfficiency, awakenings, timeInBed, isGoodSleep
            };

            const response = await api.post("/sleep/tracker", payload);
            toast.success(response.data.message);
            setAssessed(true);

        } else {
            toast.error('An error has occured');
        }
    };  

    return (
        <div className="flex flex-col items-center overflow-scroll @container">
            <div className="flex flex-col @5xl:flex-row h-full justify-center items-center gap-10 my-20">
                <form 
                    className="w-full max-w-lg flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-xl gap-6"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 text-center">
                            Sleep Tracker
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 text-center">
                            Record your most recent sleep session and assess your sleep quality.
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-row gap-5">
                            <div className="flex flex-col flex-1 gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Bedtime
                                </label>

                                <input
                                    type="datetime-local"
                                    disabled={assessed}
                                    onChange={(e) => setBedtime(e.target.value)}
                                    value={bedtime}
                                    className="w-full rounded-lg border border-gray-300 px-2 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="flex flex-col flex-1 gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Wake-up Time
                                </label>

                                <input
                                    type="datetime-local"
                                    disabled={assessed}
                                    onChange={(e) => setWakeup(e.target.value)}
                                    value={wakeup}
                                    className="w-full rounded-lg border border-gray-300 px-2 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Sleep Duration (hours)
                        </label>

                        <input
                            type="string"
                            disabled={true}
                            value={sleepDuration.toFixed(2)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-gray-300 cursor-not-allowed"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
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

                    <div className="flex flex-col gap-2">
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
                                : "bg-indigo-600 hover:bg-indigo-700 curosr-pointer"
                        }`}
                    >
                        Assess Sleep Quality
                    </button>
                    {assessed && (
                        <button
                            type="button"
                            className={`w-full rounded-lg py-3 font-semibold text-white transition-colors bg-green-600 hover:bg-green-700 cursor-pointer`}
                            onClick={() => {
                                setBedtime("");
                                setWakeup("");
                                setAwakenings(0);
                                setTimeInBed(0);
                                setAssessed(false);
                            }}
                        >
                            Track New Sleep
                        </button>
                    )}
                   

                </form>

                {assessed ? (
                    <TrackerCard data={ trackerData }/>
                ) : (
                    <TrackerCard data={undefined} />
                )}
            </div>
            <WeeklyTracker data={ historyData } />
        </div>
    );
}