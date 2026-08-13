import { Link } from "react-router";
import type { Tracker, TrackerAPIProp } from "./tracker-card";
import { useMemo } from "react";

export default function WeeklyTracker( { data }: TrackerAPIProp ) {

    const filtered = useMemo(() => {
        const map = new Map<string, Tracker>();

        for (const item of data?.items ?? []) {
            if (!item.created_at) {
                continue;
            }

            const key = item.created_at.slice(0, 10);
            const existing = map.get(key);

            if (!existing) {
                map.set(key, item);
                continue;
            }

            if (
                new Date(item.created_at).getTime() >
                new Date(existing.created_at).getTime()
            ) {
                map.set(key, item);
            }
        }

        return [...map.values()].sort(
            (a, b) =>
                new Date(a.created_at!).getTime() -
                new Date(b.created_at!).getTime()
        );
    }, [data]);

    
    return (
        <div className="
            flex flex-col min-h-[360px] max-w-[1400px] w-full
            rounded-xl border border-gray-200 
            bg-white p-4 shadow-sm 
        ">
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Assessment History</h2>
                <Link to="/dashboard/history" className="text-yellow-500">History</Link>
            </div>
            
            <div className="flex flex-row w-full items-center gap-4 overflow-x-auto py-5">
                {filtered!.map((day) => {
                    const date = new Date(day.created_at!);

                    return (
                        <div
                            key={day.created_at!}
                            className="flex h-[280px] min-w-[180px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                        >
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    {date.toLocaleDateString("en-US", {
                                        weekday: "short",
                                    })}
                                </p>

                                <h3 className="text-lg font-semibold text-gray-800">
                                    {date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </h3>
                            </div>

                            {day.id ? (
                                <div className="flex flex-col justify-between">
                                    <span
                                        className={`w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                                            day.isGoodSleep
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {day.isGoodSleep ? "Good Sleep" : "Poor Sleep"}
                                    </span>

                                    <div className="mt-3 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Bed</span>
                                            <span className="font-medium">{day.bedtime}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Wake</span>
                                            <span className="font-medium">{day.wakeup}</span>
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
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
                                    No Assessment
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}