import { Link } from "react-router";
import type { Tracker, TrackerAPIProp } from "./tracker-card";
import { useMemo } from "react";

export default function LatestTracker( { data }: TrackerAPIProp ) {

    console.log(data);
    const filtered = useMemo(() => {
        const map = new Map<string, Tracker>();

        for (const item of data?.items ?? []) {
            const key = item.id!.toString();
            map.set(key, item);
        }

        return [...map.values()].sort(
            (a, b) =>
                new Date(a.bedtime!).getTime() -
                new Date(b.bedtime!).getTime()
        );
    }, [data]);

    
    return (
        <div className="
            flex flex-col min-h-[320px] max-w-[1400px] w-full justify-between
            rounded-xl border border-gray-200 
            bg-white shadow-sm p-4 m    y-4
        ">
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Assessment History</h2>
                <Link to="/dashboard/history" className="text-yellow-500">History</Link>
            </div>
            
            <div className="flex flex-row w-full items-center gap-4 overflow-x-auto">
                {filtered!.map((day) => {
        
                    return (
                        <div
                            key={day.created_at!}
                            className="flex h-[240px] min-w-[180px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm text-sm"
                        >
               
                            <div className="flex flex-col">
                                <p className="text-gray-500">Bedtime</p>
                                <h3 className="font-semibold text-gray-800">
                                    {
                                        new Date(day.bedtime!).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        })
                                    }
                                </h3>
                            </div>

                            <div className="flex flex-col">
                                <p className="text-gray-500">Wakeup Time</p>
                                <h3 className="font-semibold text-gray-800">
                                    {
                                        new Date(day.wakeup!).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        })
                                    }
                                    
                                </h3>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Slept</span>
                                <span className="font-medium">
                                    {Math.floor(day.sleepDuration!)} h{" "}
                                    {Math.round((day.sleepDuration! % 1) * 60)} m
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">In Bed</span>
                                <span className="font-medium">
                                    {day.timeInBed!.toFixed(1)} h
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Efficiency</span>
                                <span className="font-medium">
                                    {(day.sleepEfficiency! * 100).toFixed(2)}%
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Awakenings</span>
                                <span className="font-medium">
                                    {day.awakenings}
                                </span>
                            </div>

                            <div
                                className={`w-full text-center rounded-full px-2 py-1 text-xs font-semibold ${
                                    day.isGoodSleep
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {day.isGoodSleep ? "Good Sleep" : "Poor Sleep"}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}