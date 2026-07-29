import { Link } from "react-router";
import type { TrackerAPI, Tracker } from "./tracker-card";

export type LastSevenDaysProps = {
    data: TrackerAPI| undefined;
}

export default function WeeklyTracker({ data }: LastSevenDaysProps) {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
    });

    const trackerMap = new Map<string, Tracker>();

    if(!data) {
        return (
            <div className="flex w-[1200px] h-[230px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                    No History Yet
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                    Complete the form on the left, then click <strong>Submit</strong> to
                    generate your sleep quality prediction.
                </p>
            </div>
        );
    }
    console.log(data);

    [...data.items!]
        .sort(
            (a, b) =>
                new Date(b.created_at!).getTime() -
                new Date(a.created_at!).getTime()
        )
        .forEach((item) => {
            const day = item.created_at!.split("T")[0];

            if (!trackerMap.has(day)) {
                trackerMap.set(day, item);
            }
        });

    
    return (
        <div className="flex flex-col w-[1400px] h-[360px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm my-20 gap-4">
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Assessment History</h2>
                <Link to="/dashboard/history" className="text-yellow-500">History</Link>
            </div>
            
            <div className="flex flex-row items-center gap-4 ">
                {last7Days.map((day) => {
                    const tracker = trackerMap.get(day);

                    const date = new Date(day);

                    return (
                        <div
                            key={day}
                            className="flex h-[280px] w-[180px] flex-shrink-0 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
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

                            {tracker ? 
                                (() => {
                                    let sleepDuration = 0;
                                    let sleepDurationHour = 0;
                                    let sleepDurationMinute = 0;

                                    if (tracker.bedtime && tracker.wakeup) {
                                        const [startHour, startMinute] = tracker.bedtime.split(":").map(Number);
                                        const [endHour, endMinute] = tracker.wakeup.split(":").map(Number);

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

                                    const sleepEfficiency = sleepDuration / tracker.timeInBed;

                                    return (
                                        <div className="flex flex-col justify-between">
                                            <span
                                                className={`w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                                                    tracker.isGoodSleep
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {tracker.isGoodSleep ? "Good Sleep" : "Poor Sleep"}
                                            </span>

                                            <div className="mt-3 space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Bed</span>
                                                    <span className="font-medium">{tracker.bedtime}</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Wake</span>
                                                    <span className="font-medium">{tracker.wakeup}</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Slept</span>
                                                    <span className="font-medium">
                                                        {sleepDurationHour}h {sleepDurationMinute}m
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">In Bed</span>
                                                    <span className="font-medium">
                                                        {tracker.timeInBed.toFixed(1)} h
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Efficiency</span>
                                                    <span className="font-medium">
                                                        {(sleepEfficiency * 100 ).toFixed(2)}%
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Awakenings</span>
                                                    <span className="font-medium">
                                                        {tracker.awakenings}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })() : (
                                    <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
                                        No Assessment
                                    </div>
                                )
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
}